const listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allist=await listing.find({});
   res.render("listings/index.ejs",{allist});
}

module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let List=await listing.findById(id).populate({path:"reviews", populate:{ path:"author",strictPopulate:false },}).populate("owner");
    if (!List) {
     req.flash("error"," listing you want not found");
     res.redirect("/listings")
    }
    res.render("listings/show.ejs",{List});
}

module.exports.createListing=async(req,res)=>{

    let responce=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let url=req.file.path;
    let filename=req.file.filename;
    const prof=new listing(req.body.listing);
    prof.owner=req.user._id;
    prof.image={url,filename};
    prof.geometry=responce.body.features[0].geometry;
   let newlist= await prof.save();
   console.log(newlist);
    req.flash("success","new listing is added");
    res.redirect("/listings");
} 

module.exports.renderEditForm=async (req,res) =>{
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error","requested file not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=Listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", {Listing , originalImageUrl});
}   

module.exports.updateListing=async (req,res) =>{
    let {id} = req.params;
    let Listing=await listing.findByIdAndUpdate(id, {...req.body.listing});
    if (typeof req.file !=="undefined") {
        let url=req.file.path;
        let filename=req.file.filename;
        Listing.image={url,filename};
        await Listing.save();
    }
    req.flash("success"," listing is updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let { id }=req.params;
    const deleteli= await listing.findByIdAndDelete(id);
    req.flash("success"," listing is deleted");
    res.redirect("/listings");
}