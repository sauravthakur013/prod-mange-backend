const ProductionOrder = require("../models/productionOrder");
const Material = require("../models/material");
const asyncHandler = require("express-async-handler");

const getAnalyticsOverview = asyncHandler(async (req, res) => {
  const totalProducts = await ProductionOrder.countDocuments({});
  const productStatusCounts = await ProductionOrder.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: "$count",
      },
    },
  ]);

  const productStatusObject = productStatusCounts.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {});

  const materialUsage = await ProductionOrder.aggregate([
    { $unwind: "$materialsUsed" },
    {
      $lookup: {
        from: "materials",
        localField: "materialsUsed.materialId",
        foreignField: "_id",
        as: "materialInfo",
      },
    },
    { $unwind: "$materialInfo" },
    {
      $group: {
        _id: "$materialInfo.name",
        totalQuantity: { $sum: "$materialsUsed.quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: "$totalQuantity",
      },
    },
    {
      $sort: {
        value: -1,
      },
    },
  ]);

  const workstationUsage = await ProductionOrder.aggregate([
    {
      $lookup: {
        from: "workstations",
        localField: "workstationId",
        foreignField: "_id",
        as: "workstationInfo",
      },
    },
    { $unwind: "$workstationInfo" },
    {
      $group: {
        _id: "$workstationInfo.name",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: "$count",
      },
    },
    {
      $sort: {
        value: -1,
      },
    },
  ]);

  res.json({
    data: {
      totalProducts,
      productStatusCounts: productStatusObject,
      materialUsage,
      workstationUsage,
    },
    statusCode: 200,
    message: "Analytics overview received",
  });
});

module.exports = { getAnalyticsOverview };
