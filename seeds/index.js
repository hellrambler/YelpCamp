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
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1649014048485-590f93c42936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MDk0MTA5OQ&ixlib=rb-1.2.1&q=80&w=1080',
                    filename: 'YelpCamp/o8nfalc2txwllk1ulvfg',
                }, 
                {
                    url: 'https://images.unsplash.com/photo-1650483434929-4b79e841d8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MDk0MTE0MQ&ixlib=rb-1.2.1&q=80&w=1080',
                    filename: 'YelpCamp/o8nfalc2txwllk1ulvfg',
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