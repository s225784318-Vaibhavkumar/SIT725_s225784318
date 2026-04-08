const booksService = require("../services/books.service");

const getAllBooks = async (req, res) => {
    try {
        const books = await booksService.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books" });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await booksService.getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.json(book);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch book" });
    }
};

module.exports = {
    getAllBooks,
    getBookById
};
