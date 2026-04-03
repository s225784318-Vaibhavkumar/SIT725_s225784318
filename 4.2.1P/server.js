const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "Public")));

if (!MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection failed:", err.message));

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: String,
    rating: Number,
    available: Boolean
});

const Book = mongoose.model("Book", BookSchema);

app.get("/books", async (req, res) => {
    try {
        const books = await Book.find().sort({ _id: -1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Failed to load books", error: err.message });
    }
});

app.post("/books", async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: "Failed to add book", error: err.message });
    }
});

app.delete("/books/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(400).json({ message: "Failed to delete book", error: err.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
