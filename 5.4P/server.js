const connectToDatabase = require("./config/db");
const createApp = require("./app");

const PORT = process.env.PORT || 3000;
const app = createApp();

const startServer = async () => {
    try {
        await connectToDatabase();
        return app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = {
    app,
    startServer
};
