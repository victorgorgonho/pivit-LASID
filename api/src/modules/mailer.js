const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
var Handlebars = require("handlebars");

const {host, port, user, pass} = require('../config/mail.json');

const  transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
});

const handlebarOptions = {
    viewEngine: {
        handlebars: Handlebars,
        extname: ".handlebars",
        partialsDir: './src/resources/mail/',
        layoutsDir: './src/resources/mail/',
        defaultLayout: undefined,
        helpers: undefined,
        compilerOptions: undefined,
    },
    viewPath:path.resolve('./src/resources/mail'),
    extName:'.html',
};
  
transport.use('compile', hbs(handlebarOptions));

module.exports = transport;