const jwt = require('jsonwebtoken');
const authConfig = require ('../../config/auth.json');
const sessionsController = require('../controllers/sessionsController');

//This middleware won't allow any request that use him if token is invalid, token will be checked before every request made

module.exports = async (req, res, next) => {
    try {
          //Get Header from request
        const authHeader = req.headers.authorization;
        
        await sessionsController.checkActivity(authHeader);

        //If there's none, there's no token provided
        if(!authHeader)
            return res.status(401).send({ error: 'Token não encontrado' });

        //Split header due to "Bearer " that comes before the actual token
        const parts = authHeader.split(' ');

        //If there's less than 2 parts, token isn't correctly formatted
        if(!parts.split === 2)
            return res.status(401).send({ error: 'Token mal formatado'});

        const [scheme, token] = parts;

        //Check if Bearer is correctly formatted
        if(!/^Bearer$/i.test(scheme))
            return res.status(401).send({ error: 'Header mal formatado'});

        //Compares both tokens, if equal, allow the request to keep going
        jwt.verify(token, authConfig.secret, async (err, decoded) => {
            if(err){
                await sessionsController.logout(req,res);
                //return res.status(401).send({ error: 'Token Inválido' });
            }
            req.userId = decoded.id;
            return next();
        });
    } catch (error) {
        if (error.code == 10000) 
            return res.status(400).send({ error: error.name });
        return res.status(500).send({ error: 'Error ao verificar token' });
    }
};