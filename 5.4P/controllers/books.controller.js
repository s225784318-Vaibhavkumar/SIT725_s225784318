const booksService = require("../services/books.service");

const handleBooksError = (res, error, fallbackMessage) => {
    if (error?.status) {
        return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: fallbackMessage });
};

const getAllBooks = async (req, res) => {
    try {
        const books = await booksService.getAllBooks();
        res.json(books);
    } catch (error) {
        handleBooksError(res, error, "Failed to fetch books");
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
        return handleBooksError(res, error, "Failed to fetch book");
    }
};

const createBook = async (req, res) => {
    try {
        const book = await booksService.createBook(req.body);
        return res.status(201).json(book);
    } catch (error) {
        return handleBooksError(res, error, "Failed to create book");
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await booksService.updateBook(req.params.id, req.body);
        return res.status(200).json(book);
    } catch (error) {
        return handleBooksError(res, error, "Failed to update book");
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook
};
