const Thing = require("../models/Thing");
const fs = require("fs");


exports.likeThing = (req, res, next) => {
  let userId = req.body.userId;
  let like = req.body.like;
  let thingObject = {};
  let checkuserIdLikes = false;
  let checkuserIdDislikes = false;

  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      thingObject = thing;

      let usersLiked = thingObject.usersLiked;
      let usersDisliked = thingObject.usersDisliked;

      if (usersLiked.length == 0){
        //usersLiked = [];
      }
      else{
        for (let element of usersLiked) {
          if (userId == element) {
            checkuserIdLikes = true;
          }
        }
      }
      console.log('usersLiked :' + usersLiked);

      if (usersDisliked.length == 0){
        //usersDisliked = [];
      }
      else{
        for (let element of usersDisliked) {
          if (userId == element) {
            checkuserIdDislikes = true;
          }
        }
      }
      console.log('usersDisliked :' + usersLiked);

      console.log("le like vaut : " + like);


      if (like > 1) {
        console.log("erreure : le like est = " + like);
        res.status(400).json({ message: "erreur de like frontend // backend" });
      } 
      //---------------------New LIKE
      else if (like == 1 && checkuserIdLikes === false && checkuserIdDislikes === false) {
        console.log("j'aime pour la première fois !");
        usersLiked.push(userId);

        Thing.updateOne(
          { _id: req.params.id },
          {
            userId: thingObject.userId,
            name: thingObject.name,
            manufacturer: thingObject.manufacturer,
            description: thingObject.description,
            mainPepper: thingObject.mainPepper,
            imageUrl: thingObject.imageUrl,
            heat: thingObject.heat,
            likes: thingObject.likes + 1,
            usersLiked: usersLiked,
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "New LIKE !" }))
          .catch((error) => res.status(400).json({ error }));
        //---------------------Annuler un vote LIKE ou DISLIKE
      } else if (like == 0) {
        if (checkuserIdLikes == true) {
          //Annuler un LIKE
          console.log("Je ne l'aime plus !");

          for (let i in usersLiked) {
            if (usersLiked[i] == userId) {
              usersLiked.splice(i, 1);
            }
            i++;
          }

          Thing.updateOne(
            { _id: req.params.id },
            {
              userId: thingObject.userId,
              name: thingObject.name,
              manufacturer: thingObject.manufacturer,
              description: thingObject.description,
              mainPepper: thingObject.mainPepper,
              imageUrl: thingObject.imageUrl,
              heat: thingObject.heat,
              likes: thingObject.likes - 1,
              usersLiked: usersLiked,
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: "Annuler LIKE" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (checkuserIdDislikes == true) {
          //Annuler un DISLIKE
          console.log("Elle n'est pas si mauvaise");

          for (let i in usersDisliked) {
            if (usersDisliked[i] == userId) {
              usersDisliked.splice(i, 1);
            }
            i++;
          }

          Thing.updateOne(
            { _id: req.params.id },
            {
              userId: thingObject.userId,
              name: thingObject.name,
              manufacturer: thingObject.manufacturer,
              description: thingObject.description,
              mainPepper: thingObject.mainPepper,
              imageUrl: thingObject.imageUrl,
              heat: thingObject.heat,
              dislikes: thingObject.dislikes - 1,
              usersDisliked: usersDisliked,
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: "Annuler DISLIKE" }))
            .catch((error) => res.status(400).json({ error }));
        }
        //---------------------New DISLIKE
      } else if ( like == -1 && checkuserIdDislikes === false && checkuserIdLikes === false ) {
        console.log("je n'aime pas !");
        usersDisliked.push(userId);

        Thing.updateOne(
          { _id: req.params.id },
          {
            userId: thingObject.userId,
            name: thingObject.name,
            manufacturer: thingObject.manufacturer,
            description: thingObject.description,
            mainPepper: thingObject.mainPepper,
            imageUrl: thingObject.imageUrl,
            heat: thingObject.heat,
            dislikes: thingObject.dislikes + 1,
            usersDisliked: usersDisliked,
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "Nouveau DISLIKE" }))
          .catch((error) => res.status(400).json({ error }));
      } 
      //------------------------CODE EN + // Déjà Géré côté Front-End--------------------------//
      //---------------------Before LIKE // Now DISLIKE
      else if ( like == -1 && checkuserIdDislikes === false && checkuserIdLikes === true ) {
        usersDisliked.push(userId);

        for (let i in usersLiked) {
          if (usersLiked[i] == userId) {
            usersLiked.splice(i, 1);
          }
          i++;
        }

        Thing.updateOne(
          { _id: req.params.id },
          {
            userId: thingObject.userId,
            name: thingObject.name,
            manufacturer: thingObject.manufacturer,
            description: thingObject.description,
            mainPepper: thingObject.mainPepper,
            imageUrl: thingObject.imageUrl,
            heat: thingObject.heat,
            likes: thingObject.likes - 1,
            dislikes: thingObject.dislikes + 1,
            usersLiked: usersLiked,
            usersDisliked: usersDisliked,
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "DISLIKE : -1 // LIKE : +1" }))
          .catch((error) => res.status(400).json({ error }));
        //---------------------STOP 2 x DISLIKE
      } else if (like == -1 && checkuserIdDislikes === true) {
        console.log("vous pouvez disliker une seule fois !");
        res.status(200).json({ message: "vous pouvez disliker une seule fois !" });
        //---------------------STOP 2 x LIKE
      } else if (like == 1 && checkuserIdLikes === true) {
        console.log("vous pouvez liker une seule fois !");
        res.status(200).json({ message: "vous pouvez liker une seule fois !" });
        //---------------------Before DISLIKE // Now LIKE
      } else if ( like == 1 && checkuserIdLikes === false && checkuserIdDislikes === true ) {
        console.log("je n'aimais pas mais du coup je l'aime bien");
        usersLiked.push(userId);

        for (let i in usersDisliked) {
          if (usersDisliked[i] == userId) {
            usersDisliked.splice(i, 1);
          }
          i++;
        }

        Thing.updateOne(
          { _id: req.params.id },
          {
            userId: thingObject.userId,
            name: thingObject.name,
            manufacturer: thingObject.manufacturer,
            description: thingObject.description,
            mainPepper: thingObject.mainPepper,
            imageUrl: thingObject.imageUrl,
            heat: thingObject.heat,
            likes: thingObject.likes + 1,
            dislikes: thingObject.dislikes - 1,
            usersLiked: usersLiked,
            usersDisliked: usersDisliked,
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "LIKE : -1 // DISLIKE : +1" }))
          .catch((error) => res.status(400).json({ error }));
      } 
      else {
        res.status(500).json({ error });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
