"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const canvaPublish_1 = __importDefault(require("../middlewares/canvaPublish"));
const router = express_1.default.Router();
const canvaController = require("../controllers/CanvaController");
router.post("/resources/upload", canvaController.publishDesign);
router.use("/resources/upload", canvaPublish_1.default);
router.post("/resources/find", canvaController.resourceFind);
router.post("/resources/get", canvaController.resourceGet);
module.exports = router;
