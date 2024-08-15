const mongoose=require("mongoose");
const indata=require("./data.js");
const listing=require("../models/listing.js");

main().catch((err)=>{
    console.log(err);
}).then(()=>{
    console.log("success");
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const addata=async ()=>{
    await listing.deleteMany({});
    indata.data=indata.data.map((obj)=>({...obj,owner:"66ab976cc7c154ef13dc6983"}));
    await listing.insertMany(indata.data);
}
addata();