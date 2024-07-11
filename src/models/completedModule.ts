import mongoose from "mongoose";

const CompletedModuleSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Module",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const CompletedModule = mongoose.model(
  "CompletedModule",
  CompletedModuleSchema
);
export default CompletedModule;
