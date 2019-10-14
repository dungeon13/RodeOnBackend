// add the information for the different cars
const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const Car = require("../models/car")
const middleWare = require("./middleware")
// login for the admin
router.get("/login",(req,res)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            res.send({
                "message":"error"
            })
        }
        if(!user){
            res.send({
                "message":"Invalid Username/Password"
            })
        }
        req.logIn(user,(err)=>{
            if(err){
                res.send({
                    "message":"error"
                })
            }
            else{
                res.send({
                    status:200
                })
            }
        })
    })(req,res)
})

// logOut admin 
router.get("/logout",(req,res)=>{
    req.logOut();
    res.send({
        "message":"Logged Out"
    })
})

// add the car
router.post("/add",(req,res)=>{
    Car.create(req.body,(err,car)=>{
        if(err){
            res.send(err)
        }
        else{
            res.status(200).send(car)
        }
    })
})
// upddate car
router.post("/update",middleWare.isLoggedIn,(req,res)=>{
    var vno = req.body.vno
    var rent = req.body.rent
    var spoint = req.body.spoint
    Car.findOneAndUpdate({vno:vno},{rent:rent,spoint:spoint},(err,car)=>{
        res.send(car)
    })
}) 
// delete car 
router.post("/delete",middleWare.isLoggedIn,(req,res)=>{
    Car.findByIdAndDelete()
})
router.get("/",(req,res)=>{
    res.send({
        "message":"Admin"
    })
});
module.exports = router;