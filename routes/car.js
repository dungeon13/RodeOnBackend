const express = require("express");
const router = express.Router();
const Car = require("../models/car")
const Booked = require("../models/booked")
const middleWare = require("./middleware")


router.post("/book",middleWare.isLoggedIn,(req,res)=>{
    var model = req.body.model
    var capacity = req.body.capacity
    var spoint = req.body.spoint

    // check in cars model
    Car.find({model:model,capacity:capacity,bookingStatus:0,point:spoint},(err,car)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else{
            var User = req.user._id
            var carId = car._id
            var spoint = req.body.spoint
            var epoint = req.body.epoint
            var stime = req.body.stime
            var etime = req.body.etime
            var edate = req.body.edate
            var sdate = req.body.sdate
            if(car.length==0){
                // means no car remaining at time in pool
                // check in booked model
                Booked.findOne({spoint:spoint,etime:stime},(err,car)=>{
                    if(err){
                        res.send({
                            message:"error"
                        })
                    }
                    else{
                        Booked.create({sdate:sdate,edate:edate,carbooked:carId,user:User,spoint:spoint,epoint:epoint,stime:stime,etime:etime},(err,detail)=>{
                            if(err){
                                res.send({
                                    message:"error"
                                })
                            }
                            else{
                                res.send(detail);
                            }
                        })
                    }
                })
            }
            else{
                // car present at that point
                // now add to booked and make booingStatus as 1
                Booked.create({sdate:sdate,edate:edate,carbooked:carId,user:User,spoint:spoint,epoint:epoint,stime:stime,etime:etime},(err,detail)=>{
                    if(err){
                        res.send({
                            message:"error"
                        })
                    }else{
                        Car.findByIdAndUpdate(car._id,{bookingStatus:1},(err,car)=>{
                            res.send(detail)
                        })
                    }
                })
            }
        }
    })
});


router.get("/details",(req,res)=>{
    var model = req.body.model;
    Car.find({model:req.body.model},(err,car)=>{
        if(err){
            res.send(err);
        }else{
            res.send(car)
        }
    })
});

// check for the availability
router.get("/check",(req,res)=>{
    var result = [];
    var spoint = req.body.spoint
    var capacity = req.body.capacity
    var sdate = req.body.sdate
    var stime = req.body.stime
    Car.find({spoint:spoint,capacity:capacity,bookingStatus:0},(err,car)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else{
            // find all cars present in carModel
            result.push(car);
            // find all cars in bookedModel 
            Booked.find({spoint:spoint,edate:sdate,etime:stime},(err,bookings)=>{
                if(err){
                    res.send({
                        message:"error"
                    })
                }
                else{
                    result.push(bookings);
                    res.send(result);
                }
            })
        }
    })
})

module.exports = router;