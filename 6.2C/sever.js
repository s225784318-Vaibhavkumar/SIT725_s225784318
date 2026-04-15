const express = require("express");
const path = require("path");
const { calculateSum } = require("./calculator");

const app = express();
const port = process.env.PORT || 3002;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// GET endpoint to add two numbers using query parameters
// Example: http://localhost:3002/api/add?a=10&b=15
app.get("/api/add", (req, res) => {
  try {
    const sum = calculateSum(req.query.a, req.query.b);

    res.json({
      a: Number(req.query.a),
      b: Number(req.query.b),
      result: sum
    });
  } catch (error) {
    res.status(400).json({
      error: "Please provide two valid numbers using query parameters 'a' and 'b'."
    });
  }
});

app.get("/add", (req, res) => {
  try {
    const sum = calculateSum(req.query.a, req.query.b);

    res.send(`The sum of ${Number(req.query.a)} and ${Number(req.query.b)} is: ${sum}`);
  } catch (error) {
    res.send("Error: Please provide two valid numbers using query parameters 'a' and 'b'.");
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
