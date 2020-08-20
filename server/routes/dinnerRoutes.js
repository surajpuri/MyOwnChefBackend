const express = require('express');
const router = express.Router();

const {
    ditemController,
    deletedinnerController,
    editDinner,
    getAllditem
} = require('../controllers/dinnerController');

router.post('/ditem', ditemController);
router.delete('/:id', deletedinnerController);
router.patch('/:id', editDinner);
router.get('/', getAllditem);


module.exports = router;