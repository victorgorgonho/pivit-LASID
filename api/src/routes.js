const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

//Importing middleware
const authMiddleware = require('./app/middlewares/auth');

//Importing controllers
const usersController = require('./app/controllers/usersController');
const sessionsController = require('./app/controllers/sessionsController');
const imagesController = require('./app/controllers/imagesController');
const exerciseController = require('./app/controllers/exerciseController');

//Importing scripts
const reCAPTCHA = require('./app/controllers/scripts/reCAPTCHA-v3');

const routes = express.Router(); 

//reCAPTCHA-v3
routes.post('/captcha/send', reCAPTCHA.handleSend);

//Authenticate
routes.post('/users/register',usersController.register);
routes.post('/users/authenticate',usersController.auth);
routes.post('/users/forgot_password',usersController.forgot);
routes.post('/users/reset_password',usersController.reset);

routes.use(authMiddleware);

//CRUD de User
routes.get('/users/',usersController.index);
routes.get('/users/:id',usersController.show);
routes.put('/users/:id',usersController.update);
routes.delete('/users/:id',usersController.destroy);

//CRUD de Session
routes.post('/sessions/logout',sessionsController.logout);
routes.get('/sessions/',sessionsController.index);
routes.put('/sessions/:id',sessionsController.update);
routes.delete('/sessions/:id',sessionsController.destroy);

//CRUD de images
routes.post('/posts/', multer(multerConfig).single('file'),imagesController.store);
routes.post('/posts/native', imagesController.storeNative);
routes.post('/posts/search', imagesController.find);
routes.get('/posts/', imagesController.index);
routes.delete('/posts/:id', imagesController.destroy);

//CRUD de exercícios
routes.post('/exercises/', exerciseController.store);
routes.post('/exercises/filter/user', exerciseController.filterUser);
routes.post('/exercises/filter/date', exerciseController.filterDate);
routes.get('/exercises/', exerciseController.index);
routes.put('/exercises/:id', exerciseController.update);
routes.delete('/exercises/:id', exerciseController.destroy);

module.exports = routes;
