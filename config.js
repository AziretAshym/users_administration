import dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT || 8000,
    db: process.env.MONGO_URI || "mongodb://localhost:27017/user_administration",
    jwtSecret: process.env.JWT_SECRET || "secretKey",
    sessionSecret: process.env.SESSION_SECRET || "sessionSecret",
};

export default config;
