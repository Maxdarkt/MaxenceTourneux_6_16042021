const Thing = require("../models/Thing");
const fs = require('fs');

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : [],
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet créé !'}))
    .catch((error) => res.status(400).json({ error }));
};

function createThingObject(req, res){

}

exports.modifyThing = async(req, res, next) => {

  if(!req.file){
    const thingObject = req.body;
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error })); 
  }else{
    Thing.findOne({_id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images')[1];
        fs.unlink(`images${filename}`, (error)=> {
          if(error){
            throw error;
          }
          const thingObject =     
          {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          }
          Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error })); 
        })
      })        
      .catch(error => res.status(400).json({ error }));
  }
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({_id: req.params.id })
  .then(thing => {
    const filename = thing.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, ()=> {
      Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Objet supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
    })
  })
  .catch(error => res.status(500).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};