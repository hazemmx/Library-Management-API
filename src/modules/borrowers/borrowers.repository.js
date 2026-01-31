const db = require("../../database/db");

const register = async(name, email) => {
    const query =
        "INSERT INTO borrowers (name, email) VALUES ($1, $2) RETURNING *";
    const result = await db.query(query, [name, email]);
    return result.rows[0];
};

const findAll = async() => {
    const result = await db.query(
        "SELECT * FROM borrowers ORDER BY registered_date DESC",
    );
    return result.rows;
};
const findByEmail = async(email) => {
    const result = await db.query("SELECT * FROM borrowers WHERE email = $1", [
        email,
    ]);
    return result.rows[0];
};
const findById = async(id) => {
    const result = await db.query("SELECT * FROM borrowers WHERE id = $1", [id]);
    return result.rows[0];
};
const update = async(id, name, email) => {
    const query = `
        UPDATE borrowers 
        SET 
            name = COALESCE($1, name), 
            email = COALESCE($2, email) 
        WHERE id = $3 
        RETURNING *`;

    // We pass the values; if they are undefined/null,
    // COALESCE tells PostgreSQL to keep the current column value.
    const result = await db.query(query, [name || null, email || null, id]);
    return result.rows[0];
};

const remove = async(id) => {
    await db.query("DELETE FROM borrowers WHERE id = $1", [id]);
    return true;
};

module.exports = { register, findById, findByEmail, findAll, update, remove };