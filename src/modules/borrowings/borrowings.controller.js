const borrowingService = require("./borrowings.service");

async function checkout(req, res, next) {
  try {
    const { bookId } = req.body;
    // Take borrowerId from token (req.user), not from body
    const borrowerId = req.user.id;

    const record = await borrowingService.checkoutBook(bookId, borrowerId);
    res.status(201).json({
      success: true,
      message: "Book checked out successfully",
      data: record,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to check out book",
      error: err.message,
    });
  }
}

async function returnBook(req, res, next) {
  try {
    const { id } = req.params; // The borrowing record ID
    const borrowerId = req.user.id; // The logged-in user's ID

    // Pass both to ensure the user actually owns this borrowing record
    const result = await borrowingService.returnBook(id, borrowerId);
    res.json({
      success: true,
      message: "Book returned successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to return book",
      error: err.message,
    });
  }
}

async function getBorrowerBooks(req, res, next) {
  try {
    // Users can check their own books using their token ID
    const borrowerId = req.user.id;
    const books = await borrowingService.getBorrowerBooks(borrowerId);

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found for this user",
      });
    }
    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error: err.message,
    });
  }
}

async function getOverdue(req, res, next) {
  try {
    const overdue = await borrowingService.getOverdue();
    res.json({
      success: true,
      message: "Overdue books retrieved successfully",
      data: overdue,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve overdue books",
      error: err.message,
    });
  }
}

module.exports = {
  checkout,
  returnBook,
  getBorrowerBooks,
  getOverdue,
};
