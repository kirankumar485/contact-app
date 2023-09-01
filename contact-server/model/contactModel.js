const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3 },
  lastName: { type: String, required: true, minlength: 3 },
  gender: { type: String, required: true, enum: ["MALE", "FEMALE", "OTHERS"] },
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true, maxlength: 10 },
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  other: { type: String },
});

module.exports = mongoose.model("Contact", contactSchema);
