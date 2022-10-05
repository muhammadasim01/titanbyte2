"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const branchController = require("../controllers/BranchController");
router.get("/", branchController.getAllBranches);
// Route responsible for handling addition of branch from dashboard add branch to server page
router.post("/createnewbranch", branchController.createNewBranch);
// function for getting branch Id
router.post("/getsitedetails", branchController.getSiteDetails);
router.post("/postblogtodb", branchController.postBlogToDb);
router.post("/getpostbytid", branchController.getPostByID);
router.post("/addbranchurl", branchController.addBranchUrl);
router.get("/withoutemailbranches", branchController.getBranchesWithoutAssociatedEmail);
router.post("/approveandscheduleblogpost", branchController.approveAndScheduleBlogPost);
module.exports = router;
