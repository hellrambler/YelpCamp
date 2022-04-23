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
    for (let i = 0; i < 50; i++) {
        const randomCity = sample(cities);
        const randomPlace = sample(places);
        const randomDesc = sample(descriptors);
        const randomPrice = 10 + Math.floor(Math.random() * 200);
        await new Campground({
            title: `${randomDesc} ${randomPlace}`,
            location: `${randomCity.city}, ${randomCity.state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Foster Creativity, Independence, & Intellect Through Artmaking, Fun, & Lots Of Fresh Air.",
            price: randomPrice
        }).save();
    }
}

seedDB()
    .then(() => mongoose.connection.close());