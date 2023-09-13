const Campground=require('../models/campground');
const Review=require('../models/review');

module.exports.createReview=async(req,res,next)=>{
    const {id}=req.params;
    const campgrounds=await Campground.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campgrounds.reviews.push(review);
    await review.save();
    await campgrounds.save();
    req.flash('success','created new review')
    res.redirect(`/campground/${id}`)
}

module.exports.deleteReview= async(req,res,next)=>{
    const{id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully deleted a review')
    res.redirect(`/campground/${id}`);
  
}
