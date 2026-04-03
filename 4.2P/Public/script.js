const API = "/books";

async function readJsonResponse(res) {
    const text = await res.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error("Server returned an invalid response");
    }
}

async function loadBooks() {
    const list = document.getElementById("bookList");
    const statusMessage = document.getElementById("statusMessage");
    list.innerHTML = "";
    statusMessage.textContent = "";

    try {
        const res = await fetch(API);
        const books = await readJsonResponse(res);

        if (!res.ok) {
            throw new Error(books.message || "Unable to load books");
        }

        if (books.length === 0) {
            statusMessage.textContent = "No books added yet.";
            return;
        }

        books.forEach((book) => {
            const li = document.createElement("li");
            li.className = "book-row";
            li.innerHTML = `
                <article class="book-card">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </article>
                <button class="delete-btn" onclick="deleteBook('${book._id}')" title="Delete Book">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        statusMessage.textContent = error.message || "Unable to load books";
    }
}

async function addBook() {
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const statusMessage = document.getElementById("statusMessage");

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) {
        statusMessage.textContent = "Please enter all fields.";
        return;
    }

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                author,
                genre: "General",
                rating: 4,
                available: true
            })
        });

        const data = await readJsonResponse(res);

        if (!res.ok) {
            throw new Error(data.message || "Unable to add book");
        }

        titleInput.value = "";
        authorInput.value = "";
        loadBooks();
    } catch (error) {
        statusMessage.textContent = error.message || "Unable to add book";
    }
}

async function deleteBook(id) {
    const statusMessage = document.getElementById("statusMessage");

    try {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });
        const data = await readJsonResponse(res);

        if (!res.ok) {
            throw new Error(data.message || "Unable to delete book");
        }

        loadBooks();
    } catch (error) {
        statusMessage.textContent = error.message || "Unable to delete book";
    }
}

loadBooks();
