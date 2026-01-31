const db = require("../../database/db");

const checkout = async(bookId, borrowerId, dueDate) => {
    await db.query("BEGIN");
    try {
        // 1. Record the borrowing
        const res = await db.query(
            `INSERT INTO borrowings (book_id, borrower_id, due_date) 
             VALUES ($1, $2, $3) RETURNING *`, [bookId, borrowerId, dueDate],
        );

        // 2. Decrease available quantity
        await db.query(
            "UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1", [bookId],
        );

        await db.query("COMMIT");
        return res.rows[0];
    } catch (err) {
        await db.query("ROLLBACK");
        throw err;
    }
};

const returnBook = async(borrowingId) => {
    await db.query("BEGIN");
    try {
        // 1. Set return_date and get the book_id
        const res = await db.query(
            `UPDATE borrowings SET return_date = CURRENT_TIMESTAMP 
             WHERE id = $1 AND return_date IS NULL RETURNING book_id`, [borrowingId],
        );

        if (res.rows.length === 0)
            throw new Error("Borrowing record not found or already returned");

        // 2. Increase available quantity
        await db.query(
            "UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1", [res.rows[0].book_id],
        );

        await db.query("COMMIT");
        return { message: "Book returned successfully" };
    } catch (err) {
        await db.query("ROLLBACK");
        throw err;
    }
};

const findByBorrower = async(borrowerId) => {
    const query = `
        SELECT b.title, b.author, bw.checkout_date, bw.due_date 
        FROM borrowings bw
        JOIN books b ON bw.book_id = b.id
        WHERE bw.borrower_id = $1 AND bw.return_date IS NULL`;
    const { rows } = await db.query(query, [borrowerId]);
    return rows;
};

const findOverdue = async() => {
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