const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,validateReview,isReviewAuthor,reviewAuth,storeReturnTo}=require('../middleware.js')
const Reviews=require('../controllers/reviews')

  

router.post('/',isLoggedIn,validateReview,catchAsync(Reviews.createReview));

router.delete('/:reviewId',isReviewAuthor,catchAsync(Reviews.deleteReview));


module.exports=router;