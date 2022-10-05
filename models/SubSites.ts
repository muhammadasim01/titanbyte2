import mongoose from "mongoose";
const subSitesSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  corporateId: { type: mongoose.Schema.Types.ObjectId, ref: "Corporate" },
  subSiteEmail: { type: String, required: true },
  subSiteName: { type: String, required: true },
  location: { type: String },
  websiteUrl: { type: String, required: true },
});
const SubSite = mongoose.model("SubSite", subSitesSchema);
export default SubSite;
