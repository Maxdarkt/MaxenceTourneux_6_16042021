const express = require('express');
const router = express.Router();
const multer = require('multer');
const saucesCtrl = require('../controllers/sauces');

router.post('/', multer().any(), saucesCtrl.createThing);
router.put('/:id', multer().any(), saucesCtrl.modifyThing);
router.delete('/:id', multer().any(), saucesCtrl.deleteThing);
router.get('/:id', saucesCtrl.getOneThing);
router.get('/', saucesCtrl.getAllThings);
  
module.exports = router;