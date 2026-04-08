const booksList = document.getElementById("booksList");

const renderBooks = (books) => {
    if (!books.length) {
        booksList.innerHTML = '<p class="status">No books available.</p>';
        return;
    }

    booksList.innerHTML = books
        .map(
            (book) => `
                <article class="book-card">
                    <h2>${book.title}</h2>
                    <p>Author: ${book.author}</p>
                </article>
            `
        )
        .join("");
};

const loadBooks = async () => {
    booksList.innerHTML = '<p class="status">Loading books...</p>';

    try {
        const response = await fetch("/api/books");

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        booksList.innerHTML = `<p class="status">${error.message}</p>`;
    }
};

loadBooks();
