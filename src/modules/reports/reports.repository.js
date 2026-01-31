const db = require("../../database/db");

// Helper to keep SQL clean
const BASE_SELECT = `
    SELECT 
        bw.id as "Borrowing ID", 
        b.title as "Book Title", 
        br.name as "Borrower Name", 
        bw.checkout_date as "Checkout Date", 
        bw.due_date as "Due Date",
        bw.return_date as "Return Date",
        CASE 
            WHEN bw.return_date IS NOT NULL THEN 'Returned'
            ELSE 'Not Returned'
        END as "Status"
    FROM borrowings bw
    JOIN books b ON bw.book_id = b.id
    JOIN borrowers br ON bw.borrower_id = br.id
`;

async function getBorrowingsByRange(start, end) {
    const query = `${BASE_SELECT} WHERE bw.checkout_date >= $1 AND bw.checkout_date <= $2 ORDER BY bw.checkout_date DESC`;
    const { rows } = await db.query(query, [start, end]);
    return rows;
}

async function getLastMonthProcesses() {
    const query = `${BASE_SELECT} 
        WHERE bw.checkout_date >= date_trunc('month', current_date - interval '1 month')
          AND bw.checkout_date < date_trunc('month', current_date)`;
    const { rows } = await db.query(query);
    return rows;
}

async function getLastMonthOverdue() {
    const query = `
        SELECT 
            bw.id as "Borrowing ID",
            b.title as "Book Title",
            br.name as "Borrower Name",
            bw.checkout_date as "Checkout Date",
            bw.due_date as "Due Date"
        FROM borrowings bw
        JOIN books b ON bw.book_id = b.id
        JOIN borrowers br ON bw.borrower_id = br.id
        WHERE bw.due_date >= date_trunc('month', current_date - interval '1 month')
          AND bw.due_date < date_trunc('month', current_date)
          AND bw.return_date IS NULL
          AND bw.due_date < CURRENT_TIMESTAMP
        ORDER BY bw.due_date ASC`;
    const { rows } = await db.query(query);
    return rows;
}

module.exports = {
    getBorrowingsByRange,
    getLastMonthProcesses,
    getLastMonthOverdue,
};