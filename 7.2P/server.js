const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

const ideas = [
  "Add a warm-up coding challenge",
  "Schedule a quick revision session",
  "Share one debugging tip",
  "Review last week's notes together",
  "Prepare one interview question",
];

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.emit("ideas:init", ideas);

  socket.on("idea:add", (idea) => {
    const trimmedIdea = String(idea || "").trim();

    if (!trimmedIdea) {
      socket.emit("idea:error", "Idea cannot be empty.");
      return;
    }

    if (trimmedIdea.length > 80) {
      socket.emit("idea:error", "Keep each idea under 80 characters.");
      return;
    }

    ideas.unshift(trimmedIdea);
    io.emit("ideas:init", ideas);
  });
});

server.listen(PORT, () => {
  console.log(`7.2P Socket.IO app running at http://localhost:${PORT}`);
});
