const express = require('express');
const router = express.Router();
const {
    getProductionOrders,
    createProductionOrder,
    updateProductionOrderStatus,
    deleteProductionOrder,
} = require('../controllers/productionOrderController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // Add auth middleware

router.route('/')
    .get( protect, getProductionOrders )
    .post( protect, authorize(['Manager']), createProductionOrder ); //Protect GET and POST routes

router.route('/:id/status/:status')
    .get(protect, updateProductionOrderStatus); //Protect PUT route

router.route('/:id').
    delete(protect, authorize(['Manager']), deleteProductionOrder); //Protect DELETE route

module.exports = router;