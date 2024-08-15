const listing=require("./models/listing.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","must login");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveredirctUrl=(req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id} = req.params;
    let Listing=await listing.findById(id);
    if (!Listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id ,reviewId} = req.params;
    let review=await Review.findById(reviewId);
    console.log(review.author);
        if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","you are not author");
        return res.redirect(`/listings/${id}`);
    }
    next();
}