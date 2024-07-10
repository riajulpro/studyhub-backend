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
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Number },
  otp: {
    type: Number || null,
    default: null,
  },
  expireAt: {
    type: Date,
  },
  isVarified: {
    type: Boolean,
    default: false,
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
