const mongoose = require("mongoose");

const CURRENT_YEAR = () => new Date().getFullYear();

const bookSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 1
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3
        },
        author: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        year: {
            type: Number,
            required: true,
            validate: [
                {
                    validator: (value) => value >= 1800,
                    message: "Year must be 1800 or later"
                },
                {
                    validator: (value) => value <= CURRENT_YEAR(),
                    message: "Year cannot be in the future"
                }
            ]
        },
        genre: {
            type: String,
            required: true,
            trim: true,
            minlength: 3
        },
        summary: {
            type: String,
            required: true,
            trim: true,
            minlength: 10
        },
        price: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            validate: {
                validator: (value) => Number.parseFloat(value.toString()) >= 0,
                message: "Price must be a non-negative number"
            }
        }
    },
    {
        id: false,
        versionKey: false,
        strict: "throw",
        toJSON: {
            transform: (doc, ret) => {
                ret.price = ret.price.toString();
                delete ret._id;
                return ret;
            }
        }
    }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
