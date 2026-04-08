const express = require("express");
const booksController = require("../controllers/books.controller");

const router = express.Router();

router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getBookById);

module.exports = router;
