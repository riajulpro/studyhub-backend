import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  completedModule: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Module",
  },
  completedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Lesson",
  },
  expireAt: {
    type: Date,
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  picture: {
    type: String,
    required: false,
    default: "",
  },
  progress: {
    type: Map,
    of: Boolean,
    default: {},
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
