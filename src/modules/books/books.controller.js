const BooksService = require("./books.service");

const listBooks = async(req, res, next) => {
    try {
        const books = await BooksService.listBooks();
        res.status(200).json({
            success: true,
            data: books,
        });
    } catch (err) {
        next(err);
    }
};
const searchBooks = async(req, res, next) => {
    try {
        const { searchTerm } = req.body; // Must match the key in your Postman JSON
        if (!searchTerm) {
            return res.status(400).json({ error: "Search term is required" });
        }
        const books = await BooksService.searchBooks(searchTerm);
        res.status(200).json(books);
    } catch (err) {
        next(err);
    }
};

const addBook = async(req, res, next) => {
    try {
        // 1. Pull the data from the request body
        const bookData = req.body;

        // 2. Manual Validation (Passes the "should fail with missing title" test)
        if (!bookData.title || !bookData.author || !bookData.isbn) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title, author, and isbn are mandatory.",
            });
        }

        // 3. Call Service with the single 'bookData' object
        const book = await BooksService.addBook(bookData);

        // 4. Enveloped Response (Passes the "success: true" test)
        res.status(201).json({
            success: true,
            data: book,
            message: "Book added successfully",
        });
    } catch (err) {
        next(err);
    }
};

const updateBook = async(req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Update data is required" });
        }
        const book = await BooksService.updateBook(req.params.id, req.body);
        res.json(book);
    } catch (err) {
        next(err);
    }
};

const deleteBook = async(req, res, next) => {
    try {
        const id = req.params.id;
        await BooksService.deleteBook(req.params.id);
        res.status(200).json({
            success: true,
            message: `Book with ID ${id} has been deleted successfully`,
            deletedAt: new Date().toISOString(),
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listBooks,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
};