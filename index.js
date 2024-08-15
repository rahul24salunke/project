if (process.env.NODE_ENV!="production") {
    require('dotenv').config()
}     
// console.log(process.env.SECRET);

const express=require("express");
const ejs=require("ejs");
const ejsMate=require("ejs-mate");
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require('method-override');
const expressError=require("./utils/expressEroor.js");
const list=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user.js");
const { error } = require('console');
const Url=process.env.ATLASDB_URL;

const app=express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);

const store=MongoStore.create({
    mongoUrl:Url,
    crypto: {
        secret: process.env.SECRET,
      },
    touchAfter:24*3600,  
});

store.on("error",()=>{
    console.log("error in mongo store",err);
})

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnlu:true
    }
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//rroutes middleware
app.use("/listings",list);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter)

//mongoose connection
main().catch((err)=>{
    console.log(err);
}).then(()=>{
    console.log("connection success");
})
async function main(){
    await mongoose.connect(Url);
}

app.listen(8080,(req,res)=>{
    console.log("server started 8080");
})

app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="soming wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});
