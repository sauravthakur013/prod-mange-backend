const ProductionOrder = require('../models/productionOrder');
const asyncHandler = require('express-async-handler');

// @desc    Get all production orders (with filtering)
// @route   GET /api/orders
// @access  Private
// const getProductionOrders = asyncHandler(async (req, res) => {
//     const { status, workstation } = req.query; // Get filters from query params

//     const filter = {};
//     if (status) filter.status = status;
//     if (workstation) filter.workstationId = workstation;

//     const orders = await ProductionOrder.find().populate('materialsUsed.materialId workstationId createdBy'); // Populate related data
//     if(orders){
//         res.status(200).json({
//             data: orders,
//             message: "sucess",
//             statusCode: 200
//         })
//     }else{
//         res.status(400);
//         throw new Error('Invalid order data');
//     }
// });
const getProductionOrders = asyncHandler(async (req, res) => {
    const { status, workstation } = req.query; // Get filters from query params

    const filter = {};
    if (status) filter.status = status;
    if (workstation) filter.workstationId = workstation;

    const orders = await ProductionOrder.find(filter)  // Apply the filter
        .populate('materialsUsed.materialId workstationId')
        .populate({
            path: 'createdBy',
            select: '-password' // Exclude the password field
        });

    if (orders) {
        const ordersWithoutPasswords = orders.map(order => {
            const orderObject = order.toObject(); // Convert Mongoose document to plain JavaScript object

            // Create a copy of the createdBy object, excluding the password
            if (orderObject.createdBy) {
                const { password, ...createdByWithoutPassword } = orderObject.createdBy;
                orderObject.createdBy = createdByWithoutPassword;
            }

            return orderObject;
        });


        res.status(200).json({
            data: ordersWithoutPasswords,
            message: "success", // Corrected typo
            statusCode: 200
        });
    } else {
        res.status(400);
        throw new Error('Invalid order data');
    }
});

const createProductionOrder = asyncHandler(async (req, res) => {
    const { productName, quantity, priority, materialsUsed, workstationId, startDate, endDate } = req.body;

    const order = await ProductionOrder.create({
        productName,
        quantity,
        priority,
        materialsUsed,
        workstationId,
        startDate,
        endDate,
        createdBy: req.user._id, // Get user ID from the authenticated user
    });



    if (order) {
        res.status(200).json({
            message: "Order Created",
            statusCode: 200,
        })
    } else {
        res.status(400);
        throw new Error('Invalid order data');
    }
});

// @desc    Update production order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateProductionOrderStatus = asyncHandler(async (req, res) => {
    const order = await ProductionOrder.findById(req.params.id);

    if (order) {
        order.status = req.params.status || order.status; // Update only status
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Delete a production order
// @route   DELETE /api/orders/:id
// @access  Private (Manager only)
const deleteProductionOrder = asyncHandler(async (req, res) => {
    const order = await ProductionOrder.findById(req.params.id);

    if (order) {
        await order.remove();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    getProductionOrders,
    createProductionOrder,
    updateProductionOrderStatus,
    deleteProductionOrder,
};