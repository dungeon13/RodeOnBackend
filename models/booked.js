const mongoose = require("mongoose");
const bookedCar = new mongoose.Schema({
    carbooked:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cars"
    },
    vno:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    spoint:{
        type:String
    },
    epoint:{
        type:String
    },
    stime:{
        type:String
    },
    etime:{
        type:String
    },
    sdate:{
        type:String
    },
    edate:{
        type:String
    }
})
module.exports = mongoose.model("BookedCar",bookedCar);