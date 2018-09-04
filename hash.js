const bcrypt = require('bcrypt');
const {MD5}= require('crypto-js');
const jwt = require('jsonwebtoken');



// Tao random number, thong so thu nhat la so lan tao random
// bcrypt.genSalt(10,(err, salt)=>{
//     if (err) return next(err);
//     bcrypt.hash('the771991', salt, (err, hash)=>{
//         if (err) return next(err)
//         console.log(hash);
//     });
// })
// var user = {
//     id: 1,
//     token: MD5('password123').toString()
// }
// console.log(user);
let id = 10000;
const secret = "supersecret";

//const token = jwt.sign(id, secret);
const receivedToken = "eyJhbGciOiJIUzI1NiJ9.MTAwMDA.v46XZTowl3YeHvoQ486peBU7y_xLvf6N5nvTdo2WhsQ";
const decodeToken = jwt.decode(receivedToken, secret)
console.log(decodeToken)