const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    fname:{
        type:String
    },
    lname:{
        type:String
    },
    carsbooked:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Cars"
        }
    ]
})
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);