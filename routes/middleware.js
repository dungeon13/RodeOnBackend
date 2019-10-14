var middlewareObj = {}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.send({
        "message":"You need to login"
    })
}
module.exports = middlewareObj;