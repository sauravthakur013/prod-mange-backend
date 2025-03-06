const express = require('express');
const router = express.Router();
const { registerUser, authUser, getOperaters, updateOperaters } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // Add auth middleware



router.post('/register', registerUser);
router.post('/login', authUser);

router.route('/control-tower/operaters')
    .get(protect, getOperaters)

router.route('/update/operaters/:id')
    .get(protect, authorize(['Manager']), updateOperaters)

module.exports = router;