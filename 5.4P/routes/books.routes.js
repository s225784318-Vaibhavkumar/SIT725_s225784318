const express = require("express");
const booksController = require("../controllers/books.controller");

const router = express.Router();

router.get("/", booksController.getAllBooks);
router.post("/", booksController.createBook);
router.get("/:id", booksController.getBookById);
router.put("/:id", booksController.updateBook);

module.exports = router;
