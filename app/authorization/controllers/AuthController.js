var passport = require('passport');
var User  = require('../models/UserModel.js');

exports.localSignup =  function(req, res, next){    
    passport.authenticate('local-signup',function(err, user, info){
        if (err) { 
            return res.json({type:false,data: 'error occured '+ err}); 
        }
            return res.json(user);
    })(req, res, next);
}

exports.testGet = function(req,res,next){
    /* 
        req.user is set when : 
        2.) header "authorization" is set to "bearer <token>" valid API is protected
    
    */
    
    req.user.msg = "Response appended from Server";
    return res.json(req.user);
}

function urlBase64Decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output);
}

function parseToken(token){
    var user = {};
    if(token){
        var encoded = token.split('.')[1];
        user = JSON.parse(urlBase64Decode(encoded));
    }
    return user;  
}



exports.testPost = function(req,res,next){
    res.json({msg: 'response form test post',name:req.body.name});
}

exports.localLogin = function(req, res, next){
    passport.authenticate('local-login',function(err, user, info){
        if (err) { 
            return res.json({type:false,data: 'error occured '+ err}); 
        }
        if(user){
            return res.json(user);
        }
    })(req, res, next);
}

exports.logout = function(req, res) {
  if(req.user) {
     req.session.destroy();
    req.logout();
    res.json({'status':200,'message':'User successfully logged out.','role':'none',type:false});
  } else {
      res.json({'status':200,'message':'User successfully logged out','role':'none', type: false});
  }
};
