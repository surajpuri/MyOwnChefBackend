const express = require('express');
const router = express.Router();

const {
    signupController,
    loginController,
    getAllUser,
    editUserController,
    deleteUserController
} = require('../controllers/userControllers');

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/', getAllUser);
router.patch('/:id', editUserController);
router.delete('/:id', deleteUserController);

module.exports = router;