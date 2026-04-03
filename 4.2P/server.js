require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/Public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Public/index.html");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    rating: Number,
    available: Boolean
});

const Book = mongoose.model("Book", BookSchema);

app.get("/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

app.post("/books", async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.json(newBook);
});

app.delete("/books/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
