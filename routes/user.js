const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const User = require("../models/user")


router.get("/profile",(req,res)=>{
    if(req.user==undefined){
        res.send({
            "message":"You need to logIn"
        })
    }
    else{
        //console.log(req.user._id)    
        User.findById(req.user._id,(err,user)=>{
         if(err){
             res.send(err)
         }
         else{
             res.send(user)
         }
     })
    }   
})
router.post("/login",function(req,res){
    passport.authenticate('local',function(err,user,info){
        if(err){
            res.send(err)
        }
        if(!user){
            res.send({
                "message":"Invalid Username or password"
            })
        }
        req.logIn(user,function(err){
            if(err){
                res.send(err)
            }else{
                res.send({
                    "message":"Logged In"
                })
            }
        })
    })(req,res)
})
router.post("/signup",(req,res)=>{
    var newUser = new User({username:req.body.username,fname:req.body.fname,lname:req.body.lname})
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            //console.log(err)
            res.send(err)
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.send({
                    "message":"signup success"
                })
            })
        }
    })
})
router.get("/logout",(req,res)=>{
    req.logOut();
    res.send({
        "message":"logged Out"
    })
})
module.exports = router;