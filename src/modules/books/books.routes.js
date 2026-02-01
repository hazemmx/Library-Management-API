const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
} = require("./books.controller");

router.get("/", getAllBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.post("/search", searchBooks);

module.exports = router;
