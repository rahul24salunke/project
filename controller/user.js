const User=require("../models/user.js");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/user.ejs");
}

module.exports.signUp=async(req,res,next)=>{
    try {
        let {username,email,password}=req.body;
    const newUser=new User({email,username});

   let use= await User.register(newUser,password);
   console.log(use);
   req.login(use,(err)=>{
      if (err) {
        next(err);
      }
      req.flash("success","welcome to airbnb");
      res.redirect("/listings");
     });
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome airbnb");
    let RedirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(RedirectUrl);
 }

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if (err) {
          return next(err);
        }
    });
    req.flash("success","logged out!");  
    res.redirect("/listings");
} 