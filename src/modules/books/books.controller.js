const BooksService = require("./books.service");

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { books, totalCount } = await BooksService.listBooks(limit, offset);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: books.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve books",
      message: error.message,
    });
  }
};

const searchBooks = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: "Search term is required",
      });
    }

    const books = await BooksService.searchBooks(searchTerm);

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Search failed",
      message: error.message,
    });
  }
};

const addBook = async (req, res, next) => {
  try {
    const bookData = req.body;

    // Validation
    if (!bookData.title || !bookData.author || !bookData.isbn) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        message:
          "Missing required fields: title, author, and isbn are mandatory",
      });
    }

    const book = await BooksService.addBook(bookData);

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "Duplicate entry",
        message: "Book with the same ISBN already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to add book",
      message: error.message,
    });
  }
};

const updateBook = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Update data is required",
      });
    }

    const book = await BooksService.updateBook(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Update failed",
      message: error.message,
    });
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    await BooksService.deleteBook(id);

    res.status(200).json({
      success: true,
      message: `Book with ID ${id} deleted successfully`,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Deletion failed",
      message: error.message,
    });
  }
};

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
};
