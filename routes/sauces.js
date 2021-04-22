const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauces");
const likeCtrl = require("../controllers/like");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//routes Like
router.post("/:id/like", auth, multer, likeCtrl.likeThing);

//routes Sauces
router.post("/", auth, multer, saucesCtrl.createThing);
router.put("/:id", auth, multer, saucesCtrl.modifyThing);
router.delete("/:id", auth, saucesCtrl.deleteThing);
router.get("/:id", auth, saucesCtrl.getOneThing);
router.get("/", auth, saucesCtrl.getAllThings);

module.exports = router;
