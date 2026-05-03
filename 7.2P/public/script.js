const socket = io();
const form = document.getElementById("idea-form");
const input = document.getElementById("idea-input");
const statusText = document.getElementById("status");
const ideaList = document.getElementById("idea-list");
const ideaCount = document.getElementById("idea-count");

const renderIdeas = (ideas) => {
  ideaList.innerHTML = "";

  ideas.forEach((idea, index) => {
    const item = document.createElement("li");
    item.className = "idea-card";
    item.innerHTML = `
      <span class="idea-number">${index + 1}</span>
      <span class="idea-text"></span>
    `;
    item.querySelector(".idea-text").textContent = idea;
    ideaList.appendChild(item);
  });

  ideaCount.textContent = `${ideas.length} idea${ideas.length === 1 ? "" : "s"}`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();

  if (!value) {
    statusText.textContent = "Enter an idea before sending.";
    return;
  }

  socket.emit("idea:add", value);
  input.value = "";
  statusText.textContent = "Idea sent to all connected users.";
});

socket.on("ideas:init", (ideas) => {
  renderIdeas(ideas);
  statusText.textContent = "Board updated in real time.";
});

socket.on("idea:error", (message) => {
  statusText.textContent = message;
});
