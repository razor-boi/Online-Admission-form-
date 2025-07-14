const mongoose = require("mongoose")
const express = require("express")

mongoose.connect("mongodb://localhost:27017/SData")
.then(()=>{
    console.log("Connection Successfull...")
}).catch((e)=>{
    console.log("Some Error")
})