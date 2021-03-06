const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;
const config = require('./../config/config').get(process.env.NODE_ENV);
const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    token:{
        type: String,
        require: true
    }
});
//.pre thuc hien 1 dieu gi do truoc khi lam gi do o day la truoc khi save, khong duoc su dung arrow function
userSchema.pre('save', function(next){
    var user = this; // acees to the user

    if (user.isModified('password')){
        bcrypt.genSalt(SALT_I,function(err, salt){
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }   

});
userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    })

}
userSchema.methods.generateToken = function(cb){
    //truy cap vao du lieu nguoi dung
    let user = this;
    //tao token cho nguoi dung
    let token = jwt.sign(user._id.toHexString(),config.SECRET);
    //luu token vao user
    user.token = token;
    user.save((err,user)=>{
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token,cb){
    const user = this;
    jwt.verify(token, config.SECRET,(err, decode)=>{
        user.findOne({'_id':decode,'token':token},(err, user)=>{
            if(err) return cb(err);
            cb(null, user);
        })
    });

}
userSchema.methods.deleteToken = function(token, cb){
    const user = this;
    user.update({$unset:{token:1}}, (err,user)=>{
        if(err) return cb(err);
        cb(null, user);
    })
}
const User = mongoose.model('User', userSchema);
module.exports = {User}
