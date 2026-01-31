const borrowingService = require("./borrowings.service");

async function checkout(req, res, next) {
    try {
        const { bookId } = req.body;
        // Take borrowerId from token (req.user), not from body
        const borrowerId = req.user.id;

        const record = await borrowingService.checkoutBook(bookId, borrowerId);
        res.status(201).json(record);
    } catch (err) {
        next(err);
    }
}

async function returnBook(req, res, next) {
    try {
        const { id } = req.params; // The borrowing record ID
        const borrowerId = req.user.id; // The logged-in user's ID

        // Pass both to ensure the user actually owns this borrowing record
        const result = await borrowingService.returnBook(id, borrowerId);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

async function getBorrowerBooks(req, res, next) {
    try {
        // Users can check their own books using their token ID
        const borrowerId = req.user.id;
        const books = await borrowingService.getBorrowerBooks(borrowerId);
        res.json(books);
    } catch (err) {
        next(err);
    }
}

async function getOverdue(req, res, next) {
    try {
        const overdue = await borrowingService.getOverdue();
        res.json(overdue);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkout,
    returnBook,
    getBorrowerBooks,
    getOverdue,
};