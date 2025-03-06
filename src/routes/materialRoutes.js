const express = require('express');
const router = express.Router();
const { updateMaterialStock, getMaterialStock, getWorkStation } = require('../controllers/materialController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/:id').put(protect, updateMaterialStock); //Protect PUT route
router.route('/:id').get(protect, getMaterialStock); 
router.route('/workStation/:id').get(protect, getWorkStation); 

module.exports = router;