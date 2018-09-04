const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const {User} = require('./models/user');
const {auth} = require('./middleware/auth');
const config = require('./config/config').get(process.env.NODE_ENV)
//DB
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);
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

//GET
app.get('/api/profile',auth, (req,res)=>{
    res.status(200).send(req.user);
})
//DELETE
app.delete('/api/logout',auth,(req,res)=>{
    //check user are logging in now bang middleware auth!
    req.user.deleteToken(req.token, (err, user)=>{
        if (err) res.status(404).send(err);
        res.status(200).send()

    }); //thong tin user da duoc set trng file auth.js

})
//Port
//const port = process.env.port || 3000;
app.listen(config.PORT, ()=>{
    console.log(`Started on Port ${config.PORT}`);
})
