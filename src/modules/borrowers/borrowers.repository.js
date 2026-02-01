const db = require("../../database/db");

const register = async (name, email) => {
  const query =
    "INSERT INTO borrowers (name, email) VALUES ($1, $2) RETURNING *";
  const result = await db.query(query, [name, email]);
  return result.rows[0];
};

const findAll = async (limit = 5, offset = 0) => {
  try {
    const query = `
            SELECT *, count(*) OVER() AS total_count 
            FROM Borrowers 
            ORDER BY id DESC 
            LIMIT $1 OFFSET $2
        `;

    // Only one query call needed
    const { rows } = await db.query(query, [limit, offset]);

    // If no rows, totalCount is 0
    const totalCount = rows.length > 0 ? parseInt(rows[0].total_count) : 0;

    // Map through rows to remove total_count from the individual borrower objects
    const borrowers = rows.map(
      ({ total_count, ...borrowerData }) => borrowerData,
    );

    return { borrowers, totalCount };
  } catch (error) {
    console.error("Borrower Repository Error:", error.message);
    throw error;
  }
};
const findByEmail = async (email) => {
  const result = await db.query("SELECT * FROM borrowers WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
const findById = async (id) => {
  const result = await db.query("SELECT * FROM borrowers WHERE id = $1", [id]);
  return result.rows[0];
};
const update = async (id, name, email) => {
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

const remove = async (id) => {
  const res = await db.query("DELETE FROM borrowers WHERE id = $1", [id]);
  return res.rowCount > 0;
};

module.exports = { register, findById, findByEmail, findAll, update, remove };
