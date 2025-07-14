const mongoose = require("mongoose");

const ptaFormSchema = new mongoose.Schema({
    parentName: {
      type: String,
      required: true
    },
    wardName: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    rollNo: {
      type: Number,
      required: true
    },
    wardSubject: {
      type: String,
      required: true
    },
    occupation: {
      type: String,  
      required: true
    },
    address: {
      type: String,
      required: true
    },
    telephone: {
      type: Number,
      required: true
    },
   
    parentPhoto: {
      type: String,
      required: true
    },
    parentSignature: {
      type: String, 
      required: true
    },
  }
  
)
const ptacreation = mongoose.model("ptacreation", ptaFormSchema);
module.exports = ptacreation;