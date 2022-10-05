import mongoose from "mongoose";
const folderStructureSchema = new mongoose.Schema({
  createdAt: { type: String, required: true },
  folderDocument: { type: String, required: true },
  folderName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
});
const FolderStructure = mongoose.model(
  "FolderStructure",
  folderStructureSchema
);
export default FolderStructure;
