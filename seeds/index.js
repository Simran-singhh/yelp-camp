const mongoose=require('mongoose');
const cities=require('./cities');
const {descriptors,places}=require('./seedHelpers');
const Campground=require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Database connected ");
});

const sample=(arr)=>arr[Math.floor(Math.random()*arr.length)];
const timeElapsed = Date.now();
const today = new Date(timeElapsed);

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++)
    { const random=Math.floor(Math.random()*1000)
      const prices=Math.floor(Math.random()*20)+10;
      const camp=new Campground({
        author:'64f01163cc8ad88c947b2e4a',
        location:`${cities[random].city},${cities[random].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        images:[
          {
            url: 'https://res.cloudinary.com/dsy92oebs/image/upload/v1693700249/Yelpcamp/vzbrrtyli5yxhu0ihyfk.jpg',
            filename: 'Yelpcamp/vzbrrtyli5yxhu0ihyfk',
           
          }
        ],
        geometry:{ type: 'Point', coordinates: [cities[random].longitude,cities[random].latitude ]},
        price:prices,
        date: today.toDateString(),
        description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    })
    await camp.save();
    }
}
     
seedDB().then(()=>{
  mongoose.connection.close();
});


