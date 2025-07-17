import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../config.js";


dotenv.config();

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: String,
    last_name: String,
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    birthdate: Date,
    token: {
        type: String,
        required: true,
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    const payload = {
        id: this._id,
        username: this.username,
    };

    this.token = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
};

UserSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
