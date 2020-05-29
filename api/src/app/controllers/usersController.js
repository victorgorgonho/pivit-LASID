const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const User = require('../models/user');
const sessionsController = require('./sessionsController');
const authConfig = require('../../config/auth');
const ValidationData = require('./scripts/validationData');

//Get user ID and make a unique token based on a Secret key hide in /config
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn : 86400
    });
}

module.exports = {

    async register(req,res){

        try {
            const { userTypeID,cpf,email,address_zipcode } = req.body;

            ValidationData.validateCPF(cpf);
            await ValidationData.validateEmail(email);
            
            const address = await ValidationData.getAddress(address_zipcode);
            const {uf:address_state, localidade:address_city} = address.data;
            const body = Object.assign(req.body, {address_state,address_city}); 
            
            if( (!address_state) || (!address_city)){
                return res.status(400).send({ error: 'Endereço inválido' });
            }
            const user = await User.create(body);
            user.password = undefined;

            const session = {
                token : `Bearer ${generateToken({id:user.id})}`,
                active : true,
                userId : user.id,
                userEmail : email,
            }

            await sessionsController.store(session);
            return res.send({
                user,
                token: session.token,
            });
        } catch (error) {
            if (error.code == 11000) {   
                return res.status(409).send({ error: 'CPF ou Email já cadastrado' });
            }else if (error.code == 10000) {   
                return res.status(400).send({ error: error.name });
            }else if (error.name == "ValidationError") {
                return res.status(400).send({ error: 'Informações incompletas' });
            }else{
                console.log(error);
                return res.status(500).send({ error: 'Ocorreu um erro ao cadastrar usuário, tente novamente' });
            }
        }

    },
    async auth(req,res){
        try {
            const {email, password } = req.body;
            const user = await User.findOne({ email }).select('+password');

            if(!user)
                return res.status(404).send({error: 'Usuário não encontrado'});

            //Compare typed password with the real password stored on MongoDB
            if(!await bcrypt.compare(password, user.password))
                return res.status(400).send({error: 'Senha errada'});

            //Hide password from user, then it won't be sent as response
            user.password = undefined;

            await sessionsController.deactivate(email);
            const session = {
                token : `Bearer ${generateToken({id:user.id})}`,
                actionsHistory : [0],
                active : true,
                userId : user.id,
                userEmail : email,
            }

            await sessionsController.store(session);
            return res.send({
                user, 
                token: session.token
            });
        } catch(error) {
            if (error.code == 10000) 
                return res.status(400).send({ error: error.name });
            
            return res.status(500).send({error : 'Falha ao autenticar usuário'});
        }
        
    },
    async forgot(req,res){    
        const {email} = req.body;

        try {
            const user = await User.findOne({email});
            
            if(!user)
                return res.status(404).send({error: 'Usuário não encontrado'});

            //Generate a random token to be used to reset password
            const token = crypto.randomBytes(20).toString('hex');

            //Gives 1 hour before token expires
            const now = new Date();
            now.setHours(now.getHours()+1);
            
            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });
            
            mailer.sendMail({
                to: email,
                from: 'josegorgonho@eng.ci.ufpb.br',
                subject: 'LASID - Recureração de senha',
                template: 'auth/forgot_password',
                context: {token},
            }, (error) =>{
                if(error)
                    return res.status(500).send({error: 'Error ao enviar email se recuperação'})
                
                return res.send();
            });
            
        } catch (error) {
            res.status(500).send({error: 'Ocorreu um error, tente novamente em alguns segundos'});
        }
    },
    async reset(req,res){
        const {email ,token, password} = req.body;

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires');

            if(!user)
                return res.status(404).send({error: 'Usuário não encontrado'});

            if(token !== user.passwordResetToken)
                return res.status(400).send({error: "Token inválido"});
            
            const now = new Date();

            if( now > user.passwordResetExpires)
                return res.status(400).send({error: 'Token não é mais válido, tente novamente'});

            if(!password){
                return res.status(400).send({error: "Senha inválida"});
            }
            //If it gets here, password will be reset, because token and user are valid and not expired
            user.password = password;

            await user.save();
            res.send();
        } catch (error) {
            return res.status(500).send({error: 'Falha ao mudar senha, tente novamente'});
        }
    },

    async index(req,res){
        try {
            const users = await User.find({}, {passwordResetExpires: 0, __v: 0, data: 0});

            await sessionsController.storeHistoryBack({ actionID: 8, token: req.headers.authorization });
        
            if (users.length == 0) {
                return res.send('Não há usuários cadastrados');
            } else {
                return res.json(users);
            }
        } catch (error) {
            return res.status(500).send({ error: 'Falha ao listar usuários' });
        }
    },
    async show(req,res){
        try {
            const user = await User.findById(req.params.id);
            
            if(user == null){
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }
            
            return res.json(user);
        } catch (error) {
            if (error.name == "CastError"){
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }else{
                return res.status(500).send({ error: 'Falha ao mostrar usuário' });
            }
        }
    },
    async update(req,res){
        try {
            const { userTypeID,cpf,email,address_zipcode } = req.body;

            ValidationData.validateCPF(cpf);
            ValidationData.validateEmail(email);
            
            const address = await ValidationData.getAddress(address_zipcode);
            const {uf:address_state,localidade:address_city} = address.data;
            const body = Object.assign(req.body, {address_state,address_city}); 

            if( (!address_state) || (!address_city)){
                return res.status(400).send({ error: 'Endereço inválido' });
            }
            
            const user = await User.findByIdAndUpdate(req.params.id,body,{new:true});

            if(user == null){
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }
            
            await sessionsController.storeHistoryBack({ actionID: 10, token: req.headers.authorization });
            return res.json(user);
        } catch (error) {
            if (error.code == 11000) {   
                return res.status(409).send({ error: 'CPF ou Email já cadastrado' });
            }else if (error.name == "CastError"){
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }else if (error.code == 10000) {   
                return res.status(400).send({ error: error.name });
            }else{
                return res.status(500).send({ error: 'Falha ao atualizar informações do usuário' });
            }
        }
        
    },
    async destroy(req,res){
        try {
            const user = await User.findByIdAndRemove(req.params.id);
            
            if(user == null){
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }

            await sessionsController.storeHistoryBack({ actionID: 9, token: req.headers.authorization });
            return res.send('Removido');
        } catch (error) {
            if (error.name == "CastError"){
                return res.status(404).send({ error: 'Usuário não encontrado' });
            }else{
                return res.status(500).send({ error: 'Falha ao deletar usuário' });
            }
        }

    }
};