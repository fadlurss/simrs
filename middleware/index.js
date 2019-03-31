var jwt = require('jsonwebtoken')
config = require('../config/database')
middlewareObj = {};

//     middlewareObj.checkCampgroundOwnership = function(req, res, next) {
//         if(req.isAuthenticated()){
//                Campground.findById(req.params.id, function(err, foundCampground){
//                   if(err){
//                       req.flash("error", "Campground not found");
//                       res.redirect("back");
//                   }  else {
//                        if (!foundCampground) {
//                                req.flash("error", "Item not found.");
//                                return res.redirect("back");
//                        }
//                        if(foundCampground.author.id.equals(req.user._id)){ 
//                            next();
//                        } else {
//                            req.flash("error", "You don't have permission to do that");
//                            res.redirect("back");
//                        }
//                   }
//                });
//            } else {
//                req.flash("error", "You need to be logged in to do that");
//                res.redirect("back");
//            }
//        }

// middlewareObj.checkCommentOwnership = function(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//              }else {
//                 //does user own the comment?
//                 if(foundComment.author.id_user.equals(req.user._id) || req.user.local.isAdmin){ 
//                     next();
//                 } else {
//                     req.flash("error", "You don't have permission to do that");
//                     res.redirect("back");
//                 }
//             }
//         });
//       } else {
//         req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//       }  
// }

// middlewareObj.verifyToken = function(req, res, next){
//     var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//     console.log("Your token is "+token);
//     if(token) {
//         //verifies secret and checks exp
//         jwt.verify(token, config.secret, function(err, decoded){
//             if(err){
//                 return res.json({success: false, message: "Failed to authenticate token"});
//             }else {
//             // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });

//     } else {
//         // if there is no token
//         // return an error
//         return res.status(403).send({ 
//             success: false, 
//             message: 'No token provided.' 
//         });
//     }
// }


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } // else
    req.flash("error", "You need to be logged in to do that"); // pertama dari sini, trs ke app.js trs ke header
    res.redirect("/index");
}

middlewareObj.asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

module.exports = middlewareObj;