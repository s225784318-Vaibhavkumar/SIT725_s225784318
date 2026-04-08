const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/sit725_week5_3";

const connectToDatabase = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    try {
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB at ${mongoUri}`);
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            throw new Error(
                `MongoDB is not running at ${mongoUri}. Start a local MongoDB server or set MONGODB_URI to a working database connection string.`
            );
        }

        throw error;
    }
};

module.exports = connectToDatabase;
