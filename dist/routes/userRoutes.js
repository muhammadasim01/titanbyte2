"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = __importDefault(require("../middlewares/authenticateToken"));
const router = express_1.default.Router();
const userController = require("../controllers/UserController");
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/getuser", authenticateToken_1.default, userController.getUserData);
module.exports = router;
