const {User} = require('./../models/user');

let auth =(req,res,next)=>{
    //lay Token tu header
    const token = req.header('x-token');
    User.findByToken(token,(err,user)=>{
        if (err) throw err;
        if (!user) return res.status(404).send();
        //link user tu auth toi cac rout api
        req.token = token;
        req.user = user;

        next();
    })
};
module.exports = {auth}