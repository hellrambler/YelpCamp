const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");

//connect to mongodb
async function connect() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

connect()
    .then(()=> console.log("Successfully connected"))
    .catch(err => console.log(err));

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const randomCity = sample(cities);
        const randomPlace = sample(places);
        const randomDesc = sample(descriptors);
        const randomPrice = 10 + Math.floor(Math.random() * 200);
        await new Campground({
            title: `${randomDesc} ${randomPlace}`,
            location: `${randomCity.city}, ${randomCity.state}`,
            geometry : {
                 type : "Point", 
                 coordinates : [ randomCity.longitude, randomCity.latitude ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/wenyu-ma/image/upload/v1651104875/YelpCamp/1_dezqvl.jpg',
                    filename: 'YelpCamp/1_dezqvl',
                }, 
                {
                    url: 'https://res.cloudinary.com/wenyu-ma/image/upload/v1651104875/YelpCamp/2_swyvjk.jpg',
                    filename: 'YelpCamp/2_swyvjk',
                },
                {
                    url: 'https://res.cloudinary.com/wenyu-ma/image/upload/v1651104875/YelpCamp/3_jgch81.jpg',
                    filename: 'YelpCamp/3_jgch81',
                }
            ],
            description: "Foster Creativity, Independence, & Intellect Through Artmaking, Fun, & Lots Of Fresh Air.",
            price: randomPrice,
            author: "62648f3f4624d22633053e35"
        }).save();
    }
}

seedDB()
    .then(() => mongoose.connection.close());