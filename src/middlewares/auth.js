const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

export default auth;