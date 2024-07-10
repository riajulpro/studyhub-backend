import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

const Module = mongoose.model("Module", ModuleSchema);
export default Module;
