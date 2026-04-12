const loadBooksBtn = document.getElementById("loadBooksBtn");
const booksList = document.getElementById("booksList");
const bookDetails = document.getElementById("bookDetails");

const formatPrice = (price) => `AUD ${Number(price).toFixed(2)}`;

const renderBookDetails = (book) => {
    bookDetails.innerHTML = `
        <article class="detail-card">
            <p class="detail-label">Title</p>
            <h3>${book.title}</h3>
            <dl class="detail-grid">
                <div>
                    <dt>Author</dt>
                    <dd>${book.author}</dd>
                </div>
                <div>
                    <dt>Year</dt>
                    <dd>${book.year}</dd>
                </div>
                <div>
                    <dt>Genre</dt>
                    <dd>${book.genre}</dd>
                </div>
                <div>
                    <dt>Price</dt>
                    <dd>${formatPrice(book.price)}</dd>
                </div>
            </dl>
            <div class="summary-block">
                <p class="detail-label">Summary</p>
                <p>${book.summary}</p>
            </div>
        </article>
    `;
};

const loadBookDetails = async (bookId, selectedButton) => {
    document.querySelectorAll(".book-item").forEach((button) => {
        button.classList.remove("active");
    });
    selectedButton.classList.add("active");

    bookDetails.innerHTML = '<p class="status">Loading book details...</p>';

    try {
        const response = await fetch(`/api/books/${bookId}`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const book = await response.json();
        renderBookDetails(book);
    } catch (error) {
        bookDetails.innerHTML = `<p class="status">${error.message}</p>`;
    }
};

const renderBooks = (books) => {
    if (!books.length) {
        booksList.innerHTML = '<p class="status">No books available.</p>';
        return;
    }

    booksList.innerHTML = books
        .map(
            (book) => `
                <button class="book-item" type="button" data-book-id="${book.id}">
                    <span class="book-item-title">${book.title}</span>
                    <span class="book-item-price">${formatPrice(book.price)}</span>
                </button>
            `
        )
        .join("");

    document.querySelectorAll(".book-item").forEach((button) => {
        button.addEventListener("click", () => {
            loadBookDetails(button.dataset.bookId, button);
        });
    });
};

const loadBooks = async () => {
    booksList.innerHTML = '<p class="status">Loading books...</p>';
    bookDetails.innerHTML = '<p class="status">Select a book after loading the catalog.</p>';

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

loadBooksBtn.addEventListener("click", loadBooks);
