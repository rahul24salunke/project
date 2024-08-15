const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsyn=require("../utils/wrapAsyn.js");
const passport=require("passport");
const {saveredirctUrl}=require("../middle.js");
const userController=require("../controller/user.js");

//signup
router
.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsyn(userController.signUp));

//login user
router
.route("/login")
.get(userController.renderLoginForm)
.post(saveredirctUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true, }),userController.login);

//logout
router.get("/logout",userController.logout);

module.exports=router;