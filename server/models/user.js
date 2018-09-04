const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;

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
    let token = jwt.sign(user._id.toHexString(),'supersecret');
    //luu token vao user
    user.token = token;
    user.save((err,user)=>{
        if(err) return cb(err);
        cb(null, user);
    })
}

const User = mongoose.model('User', userSchema);
module.exports = {User}
