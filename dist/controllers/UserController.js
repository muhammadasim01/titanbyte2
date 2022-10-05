"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
function generateToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET_KEY);
}
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const saltRounds = 10;
    bcrypt_1.default
        .hash(password, saltRounds)
        .then((data) => {
        User_1.User.insert(["email", "password"], [email, data])
            .then((result) => {
            console.log(result);
            return res.send(result);
        })
            .catch((err) => {
            return res.send(err);
        });
    })
        .catch((err) => {
        console.log(err);
    });
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    User_1.User.select(["email", "password"])
        .where("email", "=", email)
        .get()
        .then((result) => {
        console.log(result);
        if (!result[0]) {
            return res.sendStatus(404);
        }
        bcrypt_1.default
            .compare(password, result[0].password)
            .then((data) => {
            if (!data) {
                return res.json({
                    success: false,
                    message: `Invalid password for the user ${email}`,
                });
            }
            console.log(result[0]);
            const token = generateToken(result[0].email);
            return res.json({
                success: true,
                message: "Token generated for the user",
                token,
            });
        })
            .catch((error) => {
            console.log(error);
            return res.send(error);
        });
    });
});
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    try {
        const userData = yield User_1.User.select(["email", 'user_id'])
            .where("user_id", "=", user)
            .get();
        if (userData) {
            return res.json(userData[0]);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (error) {
        console.log(error);
    }
});
module.exports = { registerUser, loginUser, getUserData };
