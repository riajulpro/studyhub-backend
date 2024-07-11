import mongoose from "mongoose";

const CompletedLessonSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Module",
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Lesson",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const CompletedLesson = mongoose.model(
  "CompletedLesson",
  CompletedLessonSchema
);
export default CompletedLesson;
