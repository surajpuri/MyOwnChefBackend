const express = require('express');
const router = express.Router();

const {
    litemController,
    editLunch,
    deletelunchController,
    getAlllitem
} = require('../controllers/lunchController');

router.post('/litem', litemController);
router.patch('/:id',editLunch);
router.delete('/:id',deletelunchController);
router.get('/', getAlllitem);


module.exports = router;