const db = require("../../../src/database/db");

const findAll = async() => {
    try {
        // Double-check: Is db defined?x
        if (!db) throw new Error("Database connection module not found");

        const { rows } = await db.query("SELECT * FROM books ORDER BY id DESC");
        return rows;
    } catch (error) {
        console.error("Repository Error:", error.message);
        throw error; // Throw so the Service layer can catch it
    }
};

const findById = async(id) => {
    const { rows } = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    return rows[0];
};

const add = async(data) => {
    const { rows } = await db.query(
        `INSERT INTO books (title, author, isbn, available_quantity, shelf_location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [
            data.title,
            data.author,
            data.isbn,
            data.available_quantity,
            data.shelf_location,
        ],
    );
    return rows[0];
};
const update = async(id, data) => {
    const { rows } = await db.query(
        `UPDATE books
         SET title = COALESCE($1, title), 
             author = COALESCE($2, author), 
             isbn = COALESCE($3, isbn), 
             available_quantity = COALESCE($4, available_quantity), 
             shelf_location = COALESCE($5, shelf_location)
         WHERE id = $6
         RETURNING *`, [
            data.title || null,
            data.author || null,
            data.isbn || null,
            data.available_quantity || null,
            data.shelf_location || null,
            id,
        ],
    );
    return rows[0];
};

const deletex = async(id) => {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
};

const decrementQuantity = async(bookId, client = db) => {
    const result = await client.query(
        `UPDATE books
       SET available_quantity = available_quantity - 1
       WHERE id = $1 AND available_quantity > 0`, [bookId],
    );

    return result.rowCount > 0;
};

const incrementQuantity = async(bookId, client = db) => {
    await client.query(
        `UPDATE books
       SET available_quantity = available_quantity + 1
       WHERE id = $1`, [bookId],
    );
};
const searchBooks = async(query) => {
    // We use %...% for partial matching (e.g., "Orw" matches "Orwell")
    const searchTerm = `%${query}%`;

    const sql = `
        SELECT * FROM books 
        WHERE title ILIKE $1 
        OR author ILIKE $1 
        OR isbn ILIKE $1
    `;

    const { rows } = await db.query(sql, [searchTerm]);
    return rows;
};

module.exports = {
    incrementQuantity,
    decrementQuantity,
    searchBooks,
    update,
    deletex,
    add,
    findById,
    findAll,
};