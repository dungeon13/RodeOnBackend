const express = require("express");
const router = express.Router();
var User = require("../models/user");
const Cycle = require("../models/cycle");
const Booked = require("../models/booked");
const middleWare = require("./middleware");
var request = require("request")
//http://188.166.206.43/wXVsG5sd3JXgCN5P5ks4-ANrzWP5m31Y/pin/V1
//http://ec2-15-206-89-34.ap-south-1.compute.amazonaws.com:8080/api/test

const options = {
    url:'http://188.166.206.43/wXVsG5sd3JXgCN5P5ks4-ANrzWP5m31Y/pin/V1',
    method:'PUT',
    headers:{
        'Content-Type':'application/json',
    },
    body:JSON.stringify(4000)
}

router.post("/endRide",(req,res)=>{
    var data = JSON.parse(Object.keys(req.body)[0]);
    console.log(data);
    var username = data.username;
    var time = data.time;
    User.findOne({username:username},(err,response)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else{
            //console.log(response)
            res.send({
                message:"1"
            })
        }
    })
})

router.post("/unlock",(req,res)=>{
    request(options,function(err,response,body){
        if(err){
            res.send({
                message:err
            })
        }else{
            //console.log(response)
            //console.log(body)
            res.send({
                message:"1"
            })
        }
    })
})


router.post("/book",(req,res)=>{
    var data = JSON.parse(Object.keys(req.body)[0]);

    // res.send({
    //     message:"1"
    // })
    
    // check in cycle model
    Cycle.find({model:model,bookingStatus:0,point:spoint},(err,cycle)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else{
            var User = req.user._id
            var cycyleId = cycle._id
            var spoint = req.body.spoint
            var epoint = req.body.epoint
            var stime = req.body.stime
            var etime = req.body.etime
            var edate = req.body.edate
            var sdate = req.body.sdate
            if(cycle.length==0){
                Booked.findOne({spoint:spoint,etime:stime},(err,cycle2)=>{
                    if(err){
                        res.send({
                            message:"error"
                        })
                    }
                    else if(cycle2!=null){
                        Booked.create({vno:cycle2.vno,sdate:sdate,edate:edate,cyclebooked:cycle2.cyclebooked,user:User,spoint:spoint,epoint:epoint,stime:stime,etime:etime},(err,detail)=>{
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
                    else{
                        res.send({
                            message:"No cycle found"
                        })
                    }
                })
            }
            else{
                // car present at that point
                // now add to booked and make booingStatus as 1
                Booked.create({vno:cycle.vno,sdate:sdate,edate:edate,cyclebooked:cycleId,user:User,spoint:spoint,epoint:epoint,stime:stime,etime:etime},(err,detail)=>{
                    if(err){
                        res.send({
                            message:"error"
                        })
                    }else{
                        Cycle.findByIdAndUpdate(cycle._id,{"$set":{bookingStatus:1}},(err,car)=>{
                            res.send({
                                message:"Booked"
                            })
                        })
                    }
                })
            }
        }
    })
});

// check for the availability
router.get("/check",(req,res)=>{
    var data = JSON.parse(Object.keys(req.body)[0])
    var result = [];
    var spoint = data.spoint
    var sdate = data.sdate
    var stime = data.stime
    Cycle.find({spoint:spoint,bookingStatus:0},(err,cycle)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else{
            // find all cars present in carModel
            result.push(cycle);
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

router.post("/cancel",(req,res)=>{
    Booked.findOneAndRemove({vno:req.body.vno},(err,cycle)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else{
            Cycle.findByIdAndUpdate(cycle.cyclebooked,{bookingStatus:0},(err,detail)=>{
                res.send(detail)
            })
        }
    })
})

module.exports = router;