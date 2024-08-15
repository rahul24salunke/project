const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsyn=require("../utils/wrapAsyn.js");
const expressError=require("../utils/expressEroor.js");
const {listSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const listing=require("../models/listing.js");
const { isLoggedIn,isReviewAuthor } = require("../middle.js");
const reviewController=require("../controller/reviews.js");


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
    }else{
        next();
    }
};

//create review
router.post("/",isLoggedIn,validateReview,wrapAsyn(reviewController.createReview));

//delete review 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsyn(reviewController.destroyReview));

module.exports=router;