const { ref } = require("joi");
const mongoose=require("mongoose");
const Review=require("./review.js");
const User=require("../models/user.js");
const { type } = require("express/lib/response.js");
const listSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});

listSchema.post("findOneAndDelete",async(Listing)=>{
    if (Listing) {
        await Review.deleteMany({_id:{$in:Listing.reviews}});
    }
});

const listing=mongoose.model("listing",listSchema);
module.exports=listing;