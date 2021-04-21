const Thing = require("../models/Thing");
const fs = require("fs");

exports.likeThing = (req, res, next) => {
  let userId = req.body.userId;
  let like = req.body.like;
  let thingObject;
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
        thingObject = thing;
        console.log(thingObject);
        res.status(200).json({ message: "Objet trouvé !" })})
    .catch((error) => res.status(400).json({ error }));
  console.log(like);
  console.log(userId);
  console.log(req.body);

  if (like == 1) {
    Thing.updateOne(
      { _id: req.params.id },
      {
        ...thingObject,
        _id: req.params.id,
        likes: thingObject.likes + 1,
        usersLiked: userId,
      }
    )
      .then(() => res.status(200).json({ message: "Objet modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (like == 0) {
    if (thingObject.likes == 1) {
      Thing.updateOne(
        { _id: req.params.id },
        {
          ...thingObject,
          _id: req.params.id,
          likes: thingObject.likes -1,
          dislikes : thingObject.likes +1,
          usersLiked: '',
          usersDisLiked : userId,
        }
      )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    } else if (thingObject.dislikes == -1) {
        Thing.updateOne(
            { _id: req.params.id },
            {
              ...thingObject,
              _id: req.params.id,
              likes: thingObject.likes +1,
              dislikes : thingObject.likes -1,
              usersLiked: userId,
              usersDisLiked : '',
            }
          )
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
    }
  } else if (like == -1) {
        Thing.updateOne(
          { _id: req.params.id },
          {
            ...thingObject,
            _id: req.params.id,
            dislikes: thingObject.likes +1,
            usersDisLiked: userId,
          }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(500).json({ error });
  }
};
