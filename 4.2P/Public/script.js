const API = "/books";

function showError(message) {
    alert(message);
}

async function requestJson(url, options = {}) {
    let res;

    try {
        res = await fetch(url, options);
    } catch (err) {
        throw new Error("Cannot reach the server. Open the app from http://localhost:3000 and make sure npm start is running.");
    }

    let data = null;
    try {
        data = await res.json();
    } catch (err) {
        data = null;
    }

    if (!res.ok) {
        const message = data?.message || `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return data;
}

async function loadBooks() {
    try {
        const books = await requestJson(API);
        const list = document.getElementById("bookList");
        list.innerHTML = "";

        books.forEach((book) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
            <hr>
            <section>
                <div class="book-grid">
                    <article class="book-card">
                        <h3>${book.title}</h3>
                        <p>${book.author}</p>
                    </article>
                    <button class="delete-btn" onclick="deleteBook('${book._id}')" title="Delete Book">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </section>
            `;

            list.appendChild(li);
        });
    } catch (err) {
        showError(err.message);
    }
}

async function addBook() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!title || !author) {
        showError("Please enter all fields");
        return;
    }

    try {
        await requestJson(API, {
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

        document.getElementById("title").value = "";
        document.getElementById("author").value = "";

        await loadBooks();
    } catch (err) {
        showError(err.message);
    }
}

async function deleteBook(id) {
    try {
        await requestJson(`${API}/${id}`, { method: "DELETE" });
        await loadBooks();
    } catch (err) {
        showError(err.message);
    }
}

loadBooks();
