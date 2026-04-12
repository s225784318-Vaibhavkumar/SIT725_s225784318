const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });

const TEST_DB_NAME = "sit725_week5_4_validation_tests";

const toTestDatabaseUri = (uri) => {
    const [base, query] = uri.split("?");

    if (/\/[^/]+$/.test(base)) {
        const rewrittenBase = base.replace(/\/[^/]+$/, `/${TEST_DB_NAME}`);
        return query ? `${rewrittenBase}?${query}` : rewrittenBase;
    }

    const rewrittenBase = `${base.replace(/\/$/, "")}/${TEST_DB_NAME}`;
    return query ? `${rewrittenBase}?${query}` : rewrittenBase;
};

const configuredUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/default";
const TEST_DB_URI = toTestDatabaseUri(configuredUri);
process.env.MONGODB_URI = TEST_DB_URI;
process.env.MONGO_URI = TEST_DB_URI;

const connectToDatabase = require("./config/db");
const createApp = require("./app");
const Book = require("./models/book.model");

const makeValidBook = () => ({
    id: `book-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: "Clean Code",
    author: "Robert Martin",
    year: 2008,
    genre: "Software",
    summary: "A practical guide to writing readable and maintainable software.",
    price: "34.95"
});

const makeValidUpdate = () => ({
    title: "Clean Code Revised",
    author: "Robert C. Martin",
    year: 2009,
    genre: "Software Engineering",
    summary: "An updated edition focused on maintainable and expressive code.",
    price: "39.95"
});

const coverageHits = new Set();
const results = [];

const markCoverage = (...labels) => {
    labels.forEach((label) => coverageHits.add(label));
};

const expectStatus = async (response, expectedStatus) => {
    if (response.status !== expectedStatus) {
        const body = await response.text();
        throw new Error(`Expected ${expectedStatus}, received ${response.status}. Body: ${body}`);
    }
};

const runTest = async (name, coverage, fn) => {
    try {
        await fn();
        markCoverage(...coverage);
        results.push({ name, ok: true });
        console.log(`TEST|PASS|${name}`);
    } catch (error) {
        results.push({ name, ok: false, error });
        console.log(`TEST|FAIL|${name}|${error.message}`);
    }
};

const main = async () => {
    let server;

    try {
        await connectToDatabase();
        await Book.deleteMany({});

        const seedBook = makeValidBook();
        seedBook.id = "seed-book";
        await Book.create(seedBook);

        const app = createApp();
        server = await new Promise((resolve) => {
            const instance = app.listen(0, () => resolve(instance));
        });

        const port = server.address().port;
        const baseUrl = `http://127.0.0.1:${port}`;

        const request = (path, options = {}) =>
            fetch(`${baseUrl}${path}`, {
                headers: { "Content-Type": "application/json", ...(options.headers || {}) },
                ...options
            });

        await runTest("integrity route returns 204", ["required"], async () => {
            const response = await request("/api/integrity-check42");
            await expectStatus(response, 204);
        });

        await runTest("POST accepts a valid book", ["required"], async () => {
            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(makeValidBook())
            });
            await expectStatus(response, 201);
        });

        await runTest("POST rejects duplicate id with 409", ["required"], async () => {
            const duplicateBook = makeValidBook();
            duplicateBook.id = "seed-book";

            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(duplicateBook)
            });

            await expectStatus(response, 409);
        });

        await runTest("POST rejects missing required field", ["required"], async () => {
            const invalidBook = makeValidBook();
            delete invalidBook.title;

            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(invalidBook)
            });

            await expectStatus(response, 400);
        });

        await runTest("POST rejects wrong type", ["type"], async () => {
            const invalidBook = makeValidBook();
            invalidBook.year = "not-a-number";

            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(invalidBook)
            });

            await expectStatus(response, 400);
        });

        await runTest("POST rejects year below lower boundary", ["boundary"], async () => {
            const invalidBook = makeValidBook();
            invalidBook.year = 1799;

            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(invalidBook)
            });

            await expectStatus(response, 400);
        });

        await runTest("POST rejects short title", ["length"], async () => {
            const invalidBook = makeValidBook();
            invalidBook.title = "It";

            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(invalidBook)
            });

            await expectStatus(response, 400);
        });

        await runTest("POST rejects future year", ["temporal"], async () => {
            const invalidBook = makeValidBook();
            invalidBook.year = new Date().getFullYear() + 1;

            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(invalidBook)
            });

            await expectStatus(response, 400);
        });

        await runTest("POST rejects unknown field", ["unknown"], async () => {
            const invalidBook = makeValidBook();
            invalidBook.publisher = "Unknown Press";

            const response = await request("/api/books", {
                method: "POST",
                body: JSON.stringify(invalidBook)
            });

            await expectStatus(response, 400);
        });

        await runTest("PUT updates a valid book", ["required"], async () => {
            const response = await request("/api/books/seed-book", {
                method: "PUT",
                body: JSON.stringify(makeValidUpdate())
            });

            await expectStatus(response, 200);
        });

        await runTest("PUT returns 404 for missing book", ["required"], async () => {
            const response = await request("/api/books/does-not-exist", {
                method: "PUT",
                body: JSON.stringify(makeValidUpdate())
            });

            await expectStatus(response, 404);
        });

        await runTest("PUT rejects id changes", ["immutable"], async () => {
            const invalidUpdate = makeValidUpdate();
            invalidUpdate.id = "another-id";

            const response = await request("/api/books/seed-book", {
                method: "PUT",
                body: JSON.stringify(invalidUpdate)
            });

            await expectStatus(response, 400);
        });

        await runTest("PUT rejects unknown field", ["unknown"], async () => {
            const invalidUpdate = makeValidUpdate();
            invalidUpdate.publisher = "Unknown Press";

            const response = await request("/api/books/seed-book", {
                method: "PUT",
                body: JSON.stringify(invalidUpdate)
            });

            await expectStatus(response, 400);
        });

        await runTest("PUT rejects wrong type", ["type"], async () => {
            const invalidUpdate = makeValidUpdate();
            invalidUpdate.price = { amount: 12.5 };

            const response = await request("/api/books/seed-book", {
                method: "PUT",
                body: JSON.stringify(invalidUpdate)
            });

            await expectStatus(response, 400);
        });

        await runTest("PUT rejects future year", ["temporal"], async () => {
            const invalidUpdate = makeValidUpdate();
            invalidUpdate.year = new Date().getFullYear() + 5;

            const response = await request("/api/books/seed-book", {
                method: "PUT",
                body: JSON.stringify(invalidUpdate)
            });

            await expectStatus(response, 400);
        });

        await runTest("PUT rejects short title", ["length"], async () => {
            const invalidUpdate = makeValidUpdate();
            invalidUpdate.title = "No";

            const response = await request("/api/books/seed-book", {
                method: "PUT",
                body: JSON.stringify(invalidUpdate)
            });

            await expectStatus(response, 400);
        });

        const passed = results.filter((result) => result.ok).length;
        const failed = results.length - passed;
        console.log(`SUMMARY|total=${results.length}|passed=${passed}|failed=${failed}`);
        console.log(`COVERAGE|${["required", "type", "boundary", "length", "temporal", "unknown", "immutable"].map((label) => `${label}=${coverageHits.has(label) ? "yes" : "no"}`).join("|")}`);

        process.exitCode = failed === 0 ? 0 : 1;
    } catch (error) {
        console.log(`SUMMARY|fatal=1|message=${error.message}`);
        console.log("COVERAGE|required=no|type=no|boundary=no|length=no|temporal=no|unknown=no|immutable=no");
        process.exitCode = 1;
    } finally {
        if (server) {
            await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
        }

        await mongoose.connection.close();
    }
};

main();
