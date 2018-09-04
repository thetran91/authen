const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    }
});
//.pre thuc hien 1 dieu gi do truoc khi lam gi do o day la truoc khi save, khong duoc su dung arrow function
userSchema.pre('save', function(next){
    var user = this;

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

const User = mongoose.model('User', userSchema);
module.exports = {User}
