const express = require("express");
const router = express.Router();
const {
    listBooks,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
} = require("./books.controller");

router.get("/", listBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.post("/search", searchBooks);

module.exports = router;