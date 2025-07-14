const mongoose = require("mongoose");
const validator = require("validator");
const autoIncrement = require("mongoose-sequence")(mongoose);

const createSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true, 
  },
  roll_number: { type: Number, required: false },
  university_roll: { type: Number, required: false },
  university_reg: { type: Number, required: false },
  course: { type: String, required: true, enum: ["ba", "bcom", "bsc", "msc", "bca", "bba", "pgdca"] },

  student_name: { type: String, required: true },
  father_name: { type: String, required: true },
  mother_name: { type: String, required: true },
  student_phone: { type: String, required: true },
  dob: { type: Date, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "This Email is invalid"
    }
  },
  aadhaar: { type: Number, required: true },
  blood_group: { type: String, required: false },

  category: { type: String, required: true, enum: ["GEN", "SC", "ST", "OBC"] },
  sub_category: { type: String, required: false, enum: ["irdp", "bpl"] },

  signature_photo: { type: String, required: true },
  passport_photo: { type: String, required: true },

  correspondence_address: { type: String, required: true },
  permanent_address: { type: String, required: true },

  bank_name: { type: String, required: true },
  account_no: { type: Number, required: true },
  ifsc: { type: String, required: true },

  selectedSubjects: { type: [String], required: true },

  matriculation: {
    year: { type: Number, required: true },
    roll_no: { type: Number, required: true },
    division: { type: String, required: true },
    sgpa: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    board: { type: String, required: true },
    subjects: { type: String, required: true }
  },

  twelfth: [{
    year: { type: Number, required: true },
    roll_no: { type: Number, required: true },
    division: { type: String, required: true },
    sgpa: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    board: { type: String, required: true },
    subjects: { type: String, required: true }
  }],

  semesters: [{
    semester: { type: Number },
    year: { type: Number },
    roll_no: { type: Number },
    division: { type: String },
    sgpa: { type: Number },
    cgpa: { type: Number },
    board: { type: String },
    subjects: { type: String }
  }]
});

createSchema.plugin(autoIncrement, { inc_field: "serial_number" }); 

const creationmodel = mongoose.model("creationmodel", createSchema);
module.exports = creationmodel;


    