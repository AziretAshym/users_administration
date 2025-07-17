import express from "express";
import User from "../models/User.js";
import auth from "../middlewares/auth.js";
import mongoose from "mongoose";

const usersRouter = express.Router();

usersRouter.get("/", auth, async (req, res, next) => {
    const sortField = req.query.sort || "username";
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const totalUsers = await User.countDocuments();
        const users = await User.find()
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        res.render("users/list", {
            title: "Users List",
            users,
            sortOrder,
            sortField,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            csrfToken: req.csrfToken(),
        });
    } catch (e) {
        next(e);
    }
});

usersRouter.get("/new", auth, (req, res) => {
    res.render("users/new", { title: "Create User" });
});

usersRouter.post("/", auth, async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, gender, birthdate } = req.body;

        if (!username || !password) {
            res.status(400).render("users/new", {
                title: "Create User",
                error: "Username and password are required",
            });
            return;
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).render("users/new", {
                title: "Create User",
                error: "Username already exists",
            });
            return;
        }

        const user = new User({ username, password, first_name, last_name, gender, birthdate });
        user.generateToken();
        await user.save();

        res.redirect("/users");
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).render("users/new", {
                title: "Create User",
                error: "Validation error",
            });
        } else {
            next(error);
        }
    }
});

usersRouter.get("/:id", auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            res.status(404).render("404", { title: "User Not Found" });
            return;
        }
        res.render("users/detail", { title: "User Details", user });
    } catch (e) {
        next(e);
    }
});

usersRouter.get("/:id/edit", auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            res.status(404).render("404", { title: "User Not Found" });
            return;
        }
        res.render("users/edit", { title: "Edit User", user });
    } catch (e) {
        next(e);
    }
});

usersRouter.post("/:id", auth, async (req, res, next) => {
    const { first_name, last_name, gender, birthdate } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).send({ error: "User not found" });
            return;
        }

        user.first_name = first_name;
        user.last_name = last_name;
        user.gender = gender;
        user.birthdate = birthdate;
        await user.save();

        res.redirect("/users");
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).send({ error: "Validation error" });
        } else {
            next(error);
        }
    }
});

usersRouter.post("/:id/delete", auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).send({ error: "User not found" });
            return;
        }

        await user.deleteOne();
        res.redirect("/users");
    } catch (e) {
        next(e);
    }
});

export default usersRouter;
