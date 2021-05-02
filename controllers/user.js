const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Thing = require("../models/Thing");
var Cryptr = require('cryptr');

var cryptr = new Cryptr('myTotalySecretKey');

// var decstring = cryptr.decrypt(encstring);
// console.log('2 : '+ decstring);

exports.signup = (req, res, next) => {
  let regexPassword = /[\w.-]{8,16}/;
  if(regexPassword.test(req.body.password)){

    var emailEncrypted = cryptr.encrypt(req.body.email);
    
    console.log('Signup : ' + emailEncrypted);

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: emailEncrypted,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }
  else{
    res.status(400).json({ message: 'Un mot de passe doit contenir 8 caractères au minimum !'})
  }
};

exports.login = (req, res, next) => {

    User.find ()
      .then(user => {
        var emailDecrypt ="";
        var checkEmail = false;
        var password = '';
        var userID = '';

        for (let element of user){
          emailDecrypt = cryptr.decrypt(element.email);

          if (req.body.email == emailDecrypt) {
            checkEmail = true;
            password = element.password;
            userID = element._id;
            // console.log(checkEmail);
            // console.log(password);
            // console.log(userID);
          }
        }
        
        if (checkEmail == false) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: userID,
              token: jwt.sign(
                { userId: userID },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };