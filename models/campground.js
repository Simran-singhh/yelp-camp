const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;
const opts={toJSON:{virtuals:true}};
const ImageSchema=new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_200');
})

const campgroundSchema=new Schema({
    title:String,
    images:[ImageSchema],
    geometry:{
        type:   {
            type:String,
             enum:['Point']
         },
         coordinates:{
             type:[Number]
         }
    },
    price:Number,
    description :String,
    location:String,
    date:String,
    author:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
},opts)

campgroundSchema.virtual('properties.popupMarkup').get(function(){
    return `<strong><a href="/campground/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})

campgroundSchema.post('findOneAndDelete',async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('campground',campgroundSchema);