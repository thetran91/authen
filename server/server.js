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
        res.status(200).send(doc)
    })
})
// kiem tra user da co hay chua
app.post('/api/user/login',(req,res)=>{
    User.findOne({'email':req.body.email},(err, user)=>{
        if (!user) res.json({message: "The user not found!"});
        bcrypt.compare(req.body.password, user.password, (err,isMatch)=>{
            if (err) throw err;
            if (!isMatch) res.json({message: "Incorrect Password!"});
            res.status(200).send(isMatch);
        })
    })

})


//Port
const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`Started on Port ${port}`);
})