const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
    vno:{
        type:String
    },
    rent:{
        type:String
    },
    bookingStatus:{
        type:Number,
        default:0
    },
    spoint:{
        type:String
    }
})
module.exports = mongoose.model("Cycle",cycleSchema);