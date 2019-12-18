const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const User = require("../models/user")
var passwordHash = require('password-hash');


router.post('/login',function (req,res) {
    //console.log("here")
    var data = JSON.parse(Object.keys(req.body)[0]);
    var username = data.username;
    var password = data.password;
    User.find({"username" : username },function(err,res1){
        // console.log( passwordHash.verify(password, res1[0].password));
           if(res1.length>0 && passwordHash.verify(password, res1[0].password))
           {
               req.session.username = username;
                res.send({
                    message:"1"
                })
           }
           else
           {
              res.send({
                  message:"Incorrect Username/Password"
              })
           }
            
  });
  });

  router.post('/signup',function (req,res) {
    var data = JSON.parse(Object.keys(req.body)[0]);
    var username = data.roll;
    var password = data.password;
    var hashedPassword = passwordHash.generate(password);
    var fname = data.firstname
    var lname = data.lastname
    var user = new User({
      username : username,
      password : hashedPassword,
      fname:fname,
      lname:lname
    });
    User.find({"username":username},(err,user1)=>{
        if(err){
            res.send({
                message:"0"
            })
        }
        else if(user1.length===0){
            user.save()
                .then(item=>{
                    res.send({
                        message:"1"
                    });
                })
                    .catch(err=>{
                        res.status(400).send({
                            message:"0"
                        })
                    })
        }
        else{
            res.send({
                message:"Username already exists"
            })
        }
    })
    
  });

  router.get('/logout', function (req, res) {
    delete req.session.username;
    res.send({
        message:"1"
    })
  });
module.exports = router;