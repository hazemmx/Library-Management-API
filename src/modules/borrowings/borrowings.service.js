const db = require("../../database/db");
const borrowingRepo = require("./borrowings.repository");

const checkoutBook = async(bookId, borrowerId) => {
    // Check stock
    const bookRes = await db.query(
        "SELECT available_quantity FROM books WHERE id = $1", [bookId],
    );
    if (bookRes.rows.length === 0) throw new Error("Book not found");
    if (bookRes.rows[0].available_quantity <= 0)
        throw new Error("Book out of stock");

    // Set due date to 14 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // to test getting overdue comment this line and abuse checkout

    return await borrowingRepo.checkout(bookId, borrowerId, dueDate);
};

async function returnBook(borrowingId, borrowerId) {
    // 1. Verify the borrowing record exists and belongs to this borrower
    const checkQuery = `
        SELECT id FROM borrowings 
        WHERE id = $1 AND borrower_id = $2 AND return_date IS NULL
    `;
    const checkRes = await db.query(checkQuery, [borrowingId, borrowerId]);

    if (checkRes.rows.length === 0) {
        throw new Error(
            "No active borrowing record found for this user and book ID.",
        );
    }

    // 2. Call the repository to update return_date and increment stock
    return await borrowingRepo.returnBook(borrowingId);
}
async function getBorrowerBooks(borrowerId) {
    try {
        if (!borrowerId) {
            throw new Error("Borrower ID is required to fetch books.");
        }

        const books = await borrowingRepo.findByBorrower(borrowerId);

        // Return an empty array if no books, or handle as error if preferred
        return books || [];
    } catch (err) {
        // Log the error for internal debugging
        console.error(`Service Error [getBorrowerBooks]: ${err.message}`);
        throw err; // Re-throw to be caught by the Controller's next(err)
    }
}

async function getOverdue() {
    try {
        const overdueBooks = await borrowingRepo.findOverdue();

        if (!overdueBooks) {
            return [];
        }

        return overdueBooks;
    } catch (err) {
        console.error(`Service Error [getOverdue]: ${err.message}`);
        throw new Error("Could not retrieve overdue records at this time.");
    }
}

module.exports = {
    checkoutBook,
    returnBook,
    getBorrowerBooks,
    getOverdue,
};