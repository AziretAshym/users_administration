import express from "express";
import * as mongoose from "mongoose";
import config from "./config";
import MongoDb from "./mongoDb";


const app = express();
const port = 8000;

app.use(express.json());


const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
    process.on("exit", () => {
        MongoDb.disconnect();
    });
};

run().catch((e) => console.error(e));
