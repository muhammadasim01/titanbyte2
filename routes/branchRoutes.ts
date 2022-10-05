import express from "express";
import authenticateToken from "../middlewares/authenticateToken";

const router = express.Router();

const branchController = require("../controllers/BranchController");

router.get("/", branchController.getAllBranches);
router.post("/createnewbranch", branchController.createNewBranch);
router.post("/getsitedetails", branchController.getSiteDetails);
router.post("/postblogtodb", branchController.postBlogToDb);
router.post("/getpostbytid", branchController.getPostByID);
router.post("/addbranchurl", branchController.addBranchUrl);
router.get(
  "/withoutemailbranches",
  branchController.getBranchesWithoutAssociatedEmail
);
router.post(
  "/approveandscheduleblogpost",
  branchController.approveAndScheduleBlogPost
);

module.exports = router;
