const bcrypt = require('bcrypt');


// Tao random number, thong so thu nhat la so lan tao random
bcrypt.genSalt(10,(err, salt)=>{
    if (err) return next(err);
    bcrypt.hash('the771991', salt, (err, hash)=>{
        if (err) return next(err)
        console.log(hash);
    });
})