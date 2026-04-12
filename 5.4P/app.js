const express = require("express");
const path = require("path");
const booksRoutes = require("./routes/books.routes");

const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use(express.static(path.join(__dirname, "public")));

    app.use("/api/books", booksRoutes);
    app.get("/api/integrity-check42", (req, res) => {
        res.status(204).send();
    });

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    return app;
};

module.exports = createApp;
