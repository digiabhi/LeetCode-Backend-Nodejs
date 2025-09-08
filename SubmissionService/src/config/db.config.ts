import mongoose from "mongoose";
import {serverConfig} from "./index";
import logger from "./logger.config";

export const connectDB = async () => {
    try {
        const dbURL = serverConfig.DB_URL;
        await mongoose.connect(dbURL);
        logger.info("MongoDB connected successfully");
        mongoose.connection.on("error", (err) => {
            logger.error("MongoDB connection error:", err);
        });
        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
        });
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed due to app termination");
            process.exit(0);
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};