"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const CorporateController = require("../controllers/CorporateController");
Router.get("/", CorporateController.showAllCorporates);
Router.post("/create", CorporateController.createNewCorporate);
Router.post("/getcorporateid", CorporateController.getCorporateId);
module.exports = Router;
