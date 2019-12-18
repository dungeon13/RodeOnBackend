const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username:{  // roll number
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
    admin:{
        type:Boolean,
        default:false
    },
    cyclesbooked:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Cycle"
        }
    ]
})
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);