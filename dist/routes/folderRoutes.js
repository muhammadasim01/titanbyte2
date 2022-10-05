"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const folderController = require("../controllers/FolderController");
router.get("/", folderController.getAllFolders);
router.post("/newfolder", folderController.createNewFolder);
router.get("/getchildfolders/:parent_id", folderController.getChildFolders);
// route for selecting the current selected folder for uploading the design to the selected folder
router.post("/setcurrentfolder", folderController.setCurrentFolder);
// Function for getting folders and designs for the sub folder page instead of getting for hierarchy
router.post("/getsubfolders", folderController.getSubFolders);
router.post("/getdesignsbyfolder", folderController.getDesignsByFolder);
module.exports = router;
