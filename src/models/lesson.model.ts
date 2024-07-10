import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
});

const LessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema],
});

const Lesson = mongoose.model("Lesson", LessonSchema);
export default Lesson;
