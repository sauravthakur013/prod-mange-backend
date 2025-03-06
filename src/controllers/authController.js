const User = require("../models/user");
const asyncHandler = require("express-async-handler"); //Handles errors
const generateToken = require("../utils/generateToken.js");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, department } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
    department,
  });

  if (user) {
    res.status(201).json({
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        // token: generateToken(user._id),
      },
      message: "User registered successfully",
      stateCode: 201,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.cookie("jwt", generateToken(user._id), {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("user", user._id, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(user._id),
        allowForStatusChange: user.allowForStatusChange,
      },
      message: "User logged in successfully",
      stateCode: 200,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getOperaters = asyncHandler(async (req, res) => {
  const operaters = await User.find({ role: "Operator" });
  if (operaters) {
    const dataTosend = operaters.map((operator) => {
      const { password, updatedAt, __v, role, ...operatorData } =
        operator.toObject(); // Use .toObject() to get a plain JavaScript object
      return operatorData;
    });
    res.status(200).json({
      stateCode: 200,
      message: "success",
      data: dataTosend,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const updateOperaters = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    // Find the user first to get the current value of allowForStatusChange
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentStatus = user.allowForStatusChange;

    // Toggle the boolean value
    const newStatus = !currentStatus;

    // Update the user document
    const update = await User.updateOne(
      { _id: userId },
      { allowForStatusChange: newStatus }
    );

    if (update.modifiedCount === 0) {
      return res.status(400).json({ message: "User update failed" }); // or a more specific message if needed
    }

    res
      .status(200)
      .json({
        message: "allowForStatusChange updated successfully",
        newStatus: newStatus,
      });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = { registerUser, authUser, getOperaters, updateOperaters };
