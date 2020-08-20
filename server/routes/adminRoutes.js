const express = require('express');
const router = express.Router();

const {
    signupController,
    loginController,
    getAllUser,
    deleteAdminController,
    editAdminController
} = require('../controllers/adminController');

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/', getAllUser);
router.patch('/:id', editAdminController);
router.delete('/:id', deleteAdminController);

module.exports = router;