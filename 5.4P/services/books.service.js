const Book = require("../models/book.model");

const ALLOWED_FIELDS = ["id", "title", "author", "year", "genre", "summary", "price"];

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const rejectUnknownFields = (payload) => {
    const unknownFields = Object.keys(payload).filter((field) => !ALLOWED_FIELDS.includes(field));

    if (unknownFields.length) {
        throw createHttpError(400, `Unknown field(s): ${unknownFields.join(", ")}`);
    }
};

const mapPersistenceError = (error) => {
    if (error?.status) {
        return error;
    }

    if (error?.code === 11000) {
        return createHttpError(409, "Book id already exists");
    }

    if (["ValidationError", "CastError", "StrictModeError"].includes(error?.name)) {
        return createHttpError(400, error.message);
    }

    return error;
};

const getAllBooks = async () => Book.find().sort({ title: 1 });

const getBookById = async (id) => Book.findOne({ id });

const createBook = async (payload) => {
    try {
        rejectUnknownFields(payload);
        const book = new Book(payload);
        await book.save();
        return book;
    } catch (error) {
        throw mapPersistenceError(error);
    }
};

const updateBook = async (id, payload) => {
    try {
        rejectUnknownFields(payload);

        if (Object.prototype.hasOwnProperty.call(payload, "id") && payload.id !== id) {
            throw createHttpError(400, "Book id is immutable");
        }

        const book = await Book.findOne({ id });

        if (!book) {
            throw createHttpError(404, "Book not found");
        }

        const nextValues = { ...payload };
        delete nextValues.id;

        book.set(nextValues);
        await book.save();
        return book;
    } catch (error) {
        throw mapPersistenceError(error);
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    ALLOWED_FIELDS
};
