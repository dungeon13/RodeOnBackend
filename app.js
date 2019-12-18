const express       = require("express");
const bodyParser    = require("body-parser");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app           = express();
const mongoose      = require("mongoose");
const User          = require("./models/user");


var isProduction = true; // make it true while uploading the code 
// connecting to mongoose
if(isProduction){
    mongoose.connect("mongodb+srv://arpit:Mongodb%4012345@cluster0-hinwt.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
    mongoose.set('useNewUrlParser',true)
    mongoose.set('useCreateIndex',true)

}
else{
    mongoose.connect("mongodb://localhost/rideon",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true})
    mongoose.set('useNewUrlParser',true);
}
app.use(bodyParser.urlencoded({extended:true}));

// passport configuration
app.use(require("express-session")({
    secret:"whitepanda",
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// passing info to all pages
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
})
// getting all the routes
const user = require("./routes/user");
const cycle = require("./routes/cycle");
const admin = require("./routes/admin");
app.use("/user",user);
app.use("/cycle",cycle);
app.use("/admin",admin);

app.get("/test",(req,res)=>{
    res.send({
        message:"Testing"
    })
})



if(isProduction){
    app.listen(process.env.PORT, process.env.IP);
}
else{
    const port = 8080;
    app.listen(port,()=>{
        console.log(`Server is listening at ${port}..`);
})
}
