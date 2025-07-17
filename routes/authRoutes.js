import express from 'express';
import User from '../models/User.js';

const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.render('auth/login', { title: 'Login', error: 'Invalid credentials' });
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
        return res.render('auth/login', { title: 'Login', error: 'Invalid credentials' });
    }

    req.session.user = { id: user._id, username: user.username };
    res.redirect('/users');
});

authRouter.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

export default authRouter;
