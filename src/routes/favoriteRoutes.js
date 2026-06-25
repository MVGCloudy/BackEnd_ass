const express = require('express');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:id', favoriteController.removeFavorite);

module.exports = router;
