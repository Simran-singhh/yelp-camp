const User=require('../models/user');
module.exports.renderRegisterForm=(req,res)=>{
    res.render('users/register');
}

module.exports.createNewUser=async(req,res)=>{
    try{
    const{email,username,password}=req.body;
    const user=new User({email,username});
    const registeredUser= await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash('success','welcome to Yelpcamp');
        res.redirect('/campground')
    })
    }catch(e){
    req.flash('error',e.message)
    res.redirect('/register');
    };
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login');
}

module.exports.login=async(req,res,next)=>{
    req.flash('success',`welcome back ${req.user.username.toUpperCase()}`);
    const redirectUrl = res.locals.returnTo || '/campground'; 
    res.redirect(redirectUrl);
 }

module.exports.logout=async(req,res,next)=>{
     req.logout(function(err){
         if(err){
             return next(err);
         }
         req.flash('success','Goodbye!')
         
         res.redirect('/campground')
     });
    
 }