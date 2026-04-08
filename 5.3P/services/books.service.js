const Book = require("../models/book.model");

const getAllBooks = async () => Book.find().sort({ title: 1 });

const getBookById = async (id) => Book.findOne({ id });

module.exports = {
    getAllBooks,
    getBookById
};
