import mongoose from "mongoose";
const corporateSchema = new mongoose.Schema({
  coporateEmail: { type: String, required: true },
  coporateName: { type: String, required: true },
  coporateType: { type: String, required: true },
  location: { type: String, required: true },
  websiteUrl: { type: String, required: true },
});
const Corporate = mongoose.model("Corporate", corporateSchema);
export default Corporate;
