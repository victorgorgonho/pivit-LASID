require('dotenv').config({
    path: process.env.NODE_ENV == "test" ? ".env.test" : ".env"
});

const mongoose = require('mongoose');

//Connect to MongoDB 
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true,
});

mongoose.Promise = global.Promise;

module.exports = mongoose;

