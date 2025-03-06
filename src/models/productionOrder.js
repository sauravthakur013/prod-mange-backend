const mongoose = require('mongoose');

const productionOrderSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            // Function to generate a unique order ID (e.g., PROD-001, PROD-002)
            return 'PROD-' + String(Date.now()).slice(-3); // Simple example
        }
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure quantity is positive
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
    },
    status: {
        type: String,
        enum: ['Planned', 'In Production', 'Quality Check', 'Completed'],
        default: 'Planned',
    },
    materialsUsed: [{
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material', // Reference to Material model
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    }],
    workstationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workstation', // Reference to Workstation model
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
    },
}, {
    timestamps: true,
});

let ProductionOrder;

try {
  ProductionOrder = mongoose.model('ProductionOrder');
} catch (e) {
  ProductionOrder = mongoose.model('ProductionOrder', productionOrderSchema);
}

module.exports = ProductionOrder;