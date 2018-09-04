const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const {User} = require('./models/user');

//DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth');
app.use(bodyParser.json());

//POST
app.post('/api/users',(req,res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save((err,doc)=>{
        if(err) return res.status(404).send(doc)
        user.generateToken((err, user)=>{
            if (err) send.status(404).res(err)
            res.header('x-token', user.token).send(user);
        })
    })
})
// kiem tra user da co hay chua
app.post('/api/user/login',(req,res)=>{
    User.findOne({'email':req.body.email},(err,user)=>{
        if (err) throw err;
        if (!user) res.json({message: "The user not found!"});
       //su dung method comparePassword trong user.js
        user.comparePassword(req.body.password, function(err, isMatch){
            if (err) throw err;
            if (!isMatch) return res.json({message:"The Password is not match!"});
            //Tao token cho user va luu vao header 
            user.generateToken((err, user)=>{
                res.header('x-token', user.token).send(user);
            })
        })
    })

})
//Middelware
let auth =(req,res,next)=>{
    //lay Token tu header
    const token = req.header('x-token');
    User.findByToken(token,(err,user)=>{
        if (err) throw err;
        if (!user) return res.status(404).send();
        //link user tu auth toi cac rout api
        req.user = user;
        next();
    })
}
//GET
app.get('/api/profile',auth, (req,res)=>{
    res.status(200).send(req.user);
})
//Port
const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`Started on Port ${port}`);
})
