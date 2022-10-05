"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const EmailControllerDashBoard = require("../controllers/EmailControllerDashBoard");
Router.post("/emailfromdashboard", EmailControllerDashBoard.sendEmailFromDashBoard);
Router.post("/emailonnewactivity", EmailControllerDashBoard.emailOnNewActivity);
Router.post("/sendemailonblogpostapproval", EmailControllerDashBoard.sendEmailOnBlogPostApproval);
Router.post("/sendemailforactivityapproval", EmailControllerDashBoard.sendEmailForActivityApproval);
module.exports = Router;
