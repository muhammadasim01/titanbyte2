import mongoose from "mongoose";
const selectedFolderSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "FolderStructure" },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
});
const SelectedFolderForCanva = mongoose.model(
  "SelectedFolderForCanva",
  selectedFolderSchema
);
export default SelectedFolderForCanva;
