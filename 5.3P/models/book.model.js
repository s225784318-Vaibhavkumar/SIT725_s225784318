const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        year: {
            type: Number,
            required: true
        },
        genre: {
            type: String,
            required: true,
            trim: true
        },
        summary: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        }
    },
    {
        id: false,
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                ret.price = ret.price.toString();
                delete ret._id;
                return ret;
            }
        }
    }
);

module.exports = mongoose.model("Book", bookSchema);
