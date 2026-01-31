const BooksRepository = require("./books.repository");
const { NotFoundError } = require("../../utils/errors");

const listBooks = async() => {
    return await BooksRepository.findAll();
};

const searchBooks = async(query) => {
    return await BooksRepository.searchBooks(query);
};

const addBook = async(data) => {
    return await BooksRepository.add(data);
};

const getBook = async(id) => {
    const book = await await BooksRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    return book;
};
const deleteBook = async(id) => {
    const book = await await BooksRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    return await BooksRepository.deletex(id);
};
const updateBook = async(id, data) => {
    const book = await BooksRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    return await BooksRepository.update(id, data);
};

module.exports = {
    updateBook,
    deleteBook,
    getBook,
    addBook,
    listBooks,
    searchBooks,
};