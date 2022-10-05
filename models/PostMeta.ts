import mongoose from "mongoose";
const postMetaSchema = new mongoose.Schema({
  elementorData: { type: String, required: true },
  elementorEditMode: { type: String, required: true },
  elementorProVersion: { type: String, required: true },
  elementorTemplateType: { type: String, required: true },
  elementorVersion: { type: String, required: true },
  wpPageTemplate: { type: String, required: true },
  yoastFbDesc: { type: String, required: true },
  yoastFbImage: { type: String, required: true },
  yoastFbImageId: { type: String, required: true },
  yoastFbTitle: { type: String, required: true },
  authorEmail: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  schedulePostData: { type: String, required: true },
});
const PostMeta = mongoose.model("PostMeta", postMetaSchema);
export default PostMeta;
