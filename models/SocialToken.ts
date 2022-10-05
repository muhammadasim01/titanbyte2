import mongoose from "mongoose";
const socialTokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  accessTokenSecret: { type: String, required: true },
  tokenType: { type: String, required: true },
  websiteUrl: { type: String, required: true },
});
const SocialToken = mongoose.model("SocialToken", socialTokenSchema);
export default SocialToken;
