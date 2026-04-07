const db = require("../../database/db");

const checkout = async (bookId, borrowerId, dueDate, client) => {
  const q = (text, params) => client.query(text, params);

  // 1. Decrease available quantity — only if stock is still > 0.
  //    RETURNING * lets us confirm the row was actually updated.
  const stockUpdate = await q(
    `UPDATE books
        SET available_quantity = available_quantity - 1
        WHERE id = $1 AND available_quantity > 0
        RETURNING *`,
    [bookId],
  );

  // If no row came back, the guard condition failed — stock hit 0 between the
  // service-layer check and this write (shouldn't happen with FOR UPDATE, but
  // now the DB itself refuses the operation regardless of how it was called).
  if (stockUpdate.rows.length === 0) {
    throw new Error("Book out of stock");
  }

  // 2. Record the borrowing only after inventory is confirmed updated
  const res = await q(
    `INSERT INTO borrowings (book_id, borrower_id, due_date)
           VALUES ($1, $2, $3) RETURNING *`,
    [bookId, borrowerId, dueDate],
  );

  return res.rows[0];
};

const returnBook = async (borrowingId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // 1. Set return_date and get the book_id
    const res = await client.query(
      `UPDATE borrowings SET return_date = CURRENT_TIMESTAMP
             WHERE id = $1 AND return_date IS NULL RETURNING book_id`,
      [borrowingId],
    );

    if (res.rows.length === 0)
      throw new Error("Borrowing record not found or already returned");

    // 2. Increase available quantity
    await client.query(
      "UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1",
      [res.rows[0].book_id],
    );

    await client.query("COMMIT");
    return { message: "Book returned successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const findByBorrower = async (borrowerId) => {
  const query = `
        SELECT b.title, b.author, bw.checkout_date, bw.due_date 
        FROM borrowings bw
        JOIN books b ON bw.book_id = b.id
        WHERE bw.borrower_id = $1 AND bw.return_date IS NULL`;
  const { rows } = await db.query(query, [borrowerId]);
  return rows;
};

const findOverdue = async () => {
  const query = `
        SELECT bw.id, b.title, br.name as borrower_name, bw.due_date 
        FROM borrowings bw
        JOIN books b ON bw.book_id = b.id
        JOIN borrowers br ON bw.borrower_id = br.id
        WHERE bw.return_date IS NULL AND bw.due_date < CURRENT_TIMESTAMP`;
  const { rows } = await db.query(query);
  return rows;
};

module.exports = { checkout, returnBook, findByBorrower, findOverdue };
