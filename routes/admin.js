// add the information for the different cycles
const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const Cycle = require("../models/cycle")
const middleWare = require("./middleware")
const User = require("../models/user")
// add the cycle
router.post("/add",middleWare.isLoggedIn,(req,res)=>{
    var id = req.user._id
    User.findById(id,(err,user)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else if(user.admin){
            Cycle.create(req.body,(err,cycle)=>{
                if(err){
                res.send(err)
            }
            else{
                res.status(200).send(cycle)
                }
            })
        }
        else{
            res.send({
                message:"Not Allowed"
            })
        }
    })
    
    
})
// upddate cycle
router.post("/update",middleWare.isLoggedIn,(req,res)=>{
    var id = req.user._id
    User.findById(id,(err,user)=>{
        if(err){
            res.send({
                message:"error"
            })
        }
        else if(user.admin){
            var vno = req.body.vno
            var rent = req.body.rent
            var spoint = req.body.spoint
            Cycle.findOneAndUpdate({vno:vno},{rent:rent,spoint:spoint},(err,cycle)=>{
                res.status(200).send(cycle)
            })
        }
        else{
            res.send({
                message:"Not Allowed"
            })
        }
    })
    
}) 
// delete cycle 
router.post("/delete",middleWare.isLoggedIn,(req,res)=>{
    var id = req.user._id
    User.findById(id,(err,user)=>{
        if(err){
            res.status(500).send({
                message:"error"
            })
        }
        else if(user.admin){
            Cycle.findOneAndRemove({vno:req.body.vno,bookingStatus:0},(err,response)=>{
                if(err){
                    res.status(500).send({
                        message:"error"
                    })
                }
                else{
                    console.log(response)
                    res.send({
                        message:"deleted"
                    })
                }
            })
        }
        else{
            res.send({
                message:"Not Allowed"
            })
        }
    })
})
router.get("/",(req,res)=>{
    res.send({
        "message":"Admin"
    })
});
module.exports = router;