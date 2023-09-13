const Campground=require('../models/campground');
const{cloudinary}=require("../cloudinary")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding ({accessToken:mapboxToken});


module.exports.index=async(req,res,next)=>{
    const campgrounds=await Campground.find({})
   res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm=(req,res,next)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground= async(req,res,next)=>{
        const geoData=await geocoder.forwardGeocode({
            query:req.body.campground.location,
            limit:1
        }).send()
        // console.log(geoData.body.features[0].geometry);
        // res.send("ok")
      const campground = new Campground(req.body.campground);
      campground.geometry=geoData.body.features[0].geometry;
//       console.log(campground.geometry);
       campground.author=req.user._id;
       campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));
       const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        campground.date= today.toDateString(); // "Sun Jun 14 2020"
        // console.log(campground.date)
//        console.log( campground.images);
       await campground.save();
       req.flash('success','Successfully made a new campground!');
       res.redirect(`campground/${campground._id}`);
}

module.exports.editCampground=async(req,res,next)=>{
        const {id}=req.params;
        // console.log(campground.author);
        // console.log(req.user._id);
       const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
      
        const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));//this will give us an array having images
       campground.images.push(...imgs);//spread operator will  take the data from array and push it in
        // console.log(req.body);
        await campground.save();
        if(req.body.deleteImages){
              for(let filename of req.body.deleteImages)
              {
                await cloudinary.uploader.destroy(filename);
              }
               await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
               }
        if(!campground)
        {
          req.flash('error','cannot find that campground');
          return res.redirect('/campground');
        }
        req.flash('success','successfully updated campground!')
        res.redirect(`/campground/${campground._id}`);
}

module.exports.showCampground=async(req,res,next)=>{
        const campgrounds=await Campground.findById(req.params.id).populate({
          path:'reviews',
             populate:{
              path:'author',
             }
        }).populate('author');
       
        if(!campgrounds)
        {
          req.flash('error','cannot find that campground');
          return res.redirect('/campground');
        }
        res.render('campgrounds/show',{campgrounds});
}
      
module.exports.deleteCampground=async(req,res,next)=>{
        const {id}=req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success','successfully deleted a campground')
        res.redirect('/campground');
}
      
module.exports.renderEditForm=async(req,res,next)=>{
        const campground=await Campground.findById(req.params.id);
        res.render('campgrounds/edit',{campground})
}

module.exports.searchCampground=async(req,res,next)=>{
   const {title}=req.query;
   const campground= await Campground.find({title: title})
//     console.log(campground);
   if(campground.length==0)
   {
     req.flash('error','cannot find that campground');
     return res.redirect('/campground');
   }
   else{
    res.redirect(`/campground/${campground[0]._id}`);}
}


