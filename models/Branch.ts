import mongoose from "mongoose";
const branchSchema = new mongoose.Schema({
  branchEmail: { type: String, required: true },
  branchName: { type: String, required: true },
  corporateId: { type: mongoose.Schema.Types.ObjectId, ref: "Corporate" },
  location: { type: String },
  websiteUrl: { type: String, required: true },
});
const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
