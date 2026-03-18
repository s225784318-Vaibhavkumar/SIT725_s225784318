var express = require("express")
const path = require('path'); // Make sure to include this
var app = express()
var port = process.env.port || 3002;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// GET endpoint to add two numbers using query parameters
// Example: http://localhost:3000/add?a=10&b=15
app.get('/add', (req, res) => {
  // Parse the numbers from the query string
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  
  // Validate the inputs
  if (isNaN(a) || isNaN(b)) {
    return res.send("Error: Please provide two valid numbers using query parameters 'a' and 'b'.");
  }
  
  // Calculate the sum
  const sum = a + b;
  
  // Send the result as plain text
  res.send(`The sum of ${a} and ${b} is: ${sum}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});