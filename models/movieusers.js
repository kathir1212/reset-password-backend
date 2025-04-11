const mongoose = require("mongoose");


const MovieUsersSchema = new mongoose.Schema({

name : {
    type: String,
    required: true,
},

email : {
    type: String,
    required: true,
},

password : {
    type: String,
    required: true,
},



});


const MovieUser = mongoose.model("user", MovieUsersSchema);


module.exports = MovieUser;

