if(process.env.NODE_ENV!=="production"){
  require('dotenv').config();
}
require('dotenv').config();
// console.log(process.env.CLOUDINARY_SECRET);
const express=require('express');
const ejsMate = require('ejs-mate');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const Campground=require('./models/campground');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const Joi=require('joi');
const Review=require('./models/review');
const{campgroundSchema,reviewSchema}=require('./schemas.js');
const campgroundRoutes=require('./routes/campground');
const reviewRoutes=require('./routes/review');
const userRoutes=require('./routes/user');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');

const MongoStore = require('connect-mongo');
const User=require('./models/user');
const mongoSanitize = require('express-mongo-sanitize')
const helmet=require("helmet");
const dbUrl=process.env.DB_URL||'mongodb://127.0.0.1:27017/yelp-camp';


//mongodb://127.0.0.1:27017/yelp-camp
mongoose.connect(dbUrl)
const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Database connected ");
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(session({
  store,
  secret:'geeksforgeeks',
  saveUninitialized: true,
  resave: true
}));
app.use(mongoSanitize());
app.use(flash());
app.use(helmet({contentSecurityPolicy: false}))

app.use(passport.initialize());//use after app.use(session({}))
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  if(!['/login','/'].includes(req.originalUrl)){
    req.session.returnTo = req.originalUrl;
  }
  
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
})

app.get('/',catchAsync(async(req,res,next)=>{
  
  
  res.render('home');
}))
app.use('/',userRoutes);
app.use('/campground',campgroundRoutes);
app.use('/campground/:id/reviews',reviewRoutes);


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404));
    // res.send("error")
})
app.use((err,req,res,next)=>{
  const{statusCode=500}=err;
  if(!err){
    err.message='Page Not Found'
  }
    res.status(statusCode).render('error',{err});
})

app.listen(3000, ()=>{
    console.log('serving on port 3000');
})
