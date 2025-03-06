const Material = require('./../models/material');
const asyncHandler = require('express-async-handler');
const WorkStations = require('./../models/workStation')

// @desc    Update material stock levels
// @route   PUT /api/materials/:id
// @access  Private
const updateMaterialStock = asyncHandler(async (req, res) => {
    const material = await Material.findById(req.params.id);
    if (material) {
        material.currentStock = req.body.currentStock || material.currentStock;
        const updatedMaterial = await material.save();
        res.json(updatedMaterial);
    } else {
        res.status(404);
        throw new Error('Material not found');
    }
});

const getMaterialStock = asyncHandler(async (req, res) => {
    const allMaterial = await Material.find();
    res.status(200).json({
        statusCode: 200,
        data: allMaterial,
        message: "All material recevied"
    });
});

const getWorkStation = asyncHandler(async (req, res) => {
    const workStations = await WorkStations.find();
    res.status(200).json({
        statusCode: 200,
        data: workStations,
        message: "All WorkStations Recevied"
    });
});

module.exports = { updateMaterialStock, getMaterialStock, getWorkStation };