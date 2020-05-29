require('dotenv').config({
    path: process.env.NODE_ENV == "test" ? ".env.test" : ".env"
});

const express = require ('express');
const bodyParser = require ('body-parser');
const routes = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

//Create an Express application to manage URLs and routes

class AppController {
    constructor () {
        this.express = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(cors());
        this.express.use(bodyParser.json({limit:'50mb'}));
        this.express.use(bodyParser.urlencoded({extended : false }));
        this.express.use(morgan('dev'));
    }

    routes(){
        this.express.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
        this.express.use(routes);
    }
}

module.exports = new AppController();