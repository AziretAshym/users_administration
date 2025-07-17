import express from "express";
import User from "../models/User.js";
import auth from "../middlewares/auth.js";

const usersRouter = express.Router();

usersRouter.get('/', auth, async (req, res) => {
    const sortField = req.query.sort || 'username';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find()
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

    res.render('users/list', {
        title: 'Users List',
        users,
        sortOrder,
        sortField,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        csrfToken: req.csrfToken ? req.csrfToken() : '',
    });
});


usersRouter.get("/new", auth, (req, res) => {
    try {
        res.render("users/new.ejs", { title: "Create User" });
    } catch (e) {
        console.error("Render error:", e);
        res.status(500).send("Render error");
    }
});

usersRouter.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return res.status(404).render('404', { title: 'User Not Found' });
        }
        res.render('users/detail.ejs', { title: 'User Details', user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

usersRouter.post("/", auth, async (req, res) => {
    try {
        const { username, password, first_name, last_name, gender, birthdate } = req.body;

        const user = new User({
            username,
            password,
            first_name,
            last_name,
            gender,
            birthdate,
        });

        user.generateToken();

        await user.save();

        res.redirect("/users");
    } catch (err) {
        console.error(err);
        res.status(500).render("users/new", {
            title: "Create User",
            error: "Server error"
        });
    }
});



usersRouter.get('/:id/edit', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return res.status(404).render('404', { title: 'User Not Found' });
        }
        res.render('users/edit.ejs', { title: 'Edit User', user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

usersRouter.post('/:id', auth, async (req, res) => {
    try {
        const { first_name, last_name, gender, birthdate } = req.body;
        await User.findByIdAndUpdate(req.params.id, {
            first_name,
            last_name,
            gender,
            birthdate,
        });
        res.redirect(`/users/`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


usersRouter.post("/:id/delete", auth, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/users");
});

export default usersRouter;
