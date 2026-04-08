const booksService = require("../services/books.service");

const getAllBooks = (req, res) => {
    res.json(booksService.getAllBooks());
};

const getBookById = (req, res) => {
    const book = booksService.getBookById(req.params.id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.json(book);
};

module.exports = {
    getAllBooks,
    getBookById
};
