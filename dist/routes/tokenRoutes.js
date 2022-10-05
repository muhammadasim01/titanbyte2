"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const socialTokenController = require("../controllers/SocialTokenController");
router.post("/storetoken", socialTokenController.storeToken);
router.post("/checktoken", socialTokenController.checkToken);
router.get("/gettoken", socialTokenController.getToken);
router.post("/settokenforcurrentsite", socialTokenController.setCurrentSiteForToken);
router.post("/getcurrentselectedsiteurl", socialTokenController.getCurrentSelectedSiteUrl);
router.post("/storetemporarytoken", socialTokenController.storeTemporaryToken);
router.post("/gettemporarytoken", socialTokenController.getTemporaryToken);
router.post("/deletetoken", socialTokenController.deleteSocialIntegrationToken);
module.exports = router;
