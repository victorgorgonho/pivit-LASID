const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    cpf:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        select:false,
    },
    image_url:{
        type: String,
        default: 'https://lasid.s3.amazonaws.com/no_user.png',
    },
    address_city:{
        type: String,
        required:true,
    },
    address_state:{
        type: String,
        required:true,
    },
    address_country:{
        type: String,
        required:true,
    },
    address_zipcode:{
        type: String,
        required:true,
    },
    userType:{
        type: String,
        default: 'common'
    },
    passwordResetToken:{
        type: String,
        select: false,
    },
    passwordResetExpires:{
        select: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

//Hash to encrypt password in a way that if someone ever access database, won't be able to steal password
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;