const express=require("express");
const router=express.Router();
const listing=require("../models/listing.js");
const wrapAsyn=require("../utils/wrapAsyn.js");
const expressError=require("../utils/expressEroor.js");
const {listSchema}=require("../schema.js");
const {isLoggedIn, isOwner}=require("../middle.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


const validateListing=(req,res,next)=>{
    let {error}=listSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
    }else{
        next();
    }
};

//INDEX and CREATE NEW FORM
router
   .route("/")
   .get(wrapAsyn(listingController.index))
   .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsyn(listingController.createListing));

//new list
router.get("/new",isLoggedIn,listingController.renderNewform);

//show page , update  and delete
router
  .route("/:id")
  .get(wrapAsyn(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsyn(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsyn(listingController.destroyListing));


//edit route
router.get("/:id/edit",wrapAsyn(listingController.renderEditForm));

module.exports=router;