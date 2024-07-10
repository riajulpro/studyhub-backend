import mongoose from "mongoose";

const contactShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  enquiryType: {
    type: String,
    required: true,
  },
  preferredContactMethod: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    required: true,
  },

  // how_did_you_hear_about_us
  howDidYouHear: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactShema);

export default Contact;
