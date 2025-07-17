import express from "express";
import * as mongoose from "mongoose";
import path from "path";
import session from "express-session";
import config from "./config.js";
import MongoDb from "./mongoDb.js";
import usersRouter from "./routes/usersRoutes.js";
import authRouter from "./routes/authRoutes.js";


const app = express();
const port = 8000;
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'yourSecret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    })
);

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use((req, res) => {
    res.status(404).render("404");
});

const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
    process.on("exit", () => {
        MongoDb.disconnect();
    });
};

run().catch((e) => console.error(e));
