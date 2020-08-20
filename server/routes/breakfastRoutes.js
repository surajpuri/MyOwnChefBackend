const express = require('express');
const router = express.Router();

const {
    bitemController,
    deletebreakfastController,
    editBreakfast,
    getAllbitem
} = require('../controllers/breakfastController');

router.post('/bitem', bitemController);
router.delete('/:id', deletebreakfastController);
router.patch('/:id', editBreakfast);
router.get('/', getAllbitem);


module.exports = router;