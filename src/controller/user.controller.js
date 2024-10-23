import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import GenerateToken from "../config/jwtProvider.js";

export const register = async (req, res) => {
  const { fullName, number, email, password, role, about } = req.body;

  try {
    // Ensure all required fields are present
    if (!fullName || !number || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password before saving it
    const saltRounds = 10; // Use 10 rounds for salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const newUser = new User({
      fullName,
      number,
      email,
      password: hashedPassword, // Store the hashed password
      role, // By default, it will be 'candidate' as per your model
      about, // Optional field if provided in the request
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // payload
    const payload = {
      id: savedUser._id,
    };

    // Generate JWT token
    const token = GenerateToken(payload);

    // Respond with the newly created user (don't send the password back)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        number: savedUser.number,
        role: savedUser.role,
        avatar: savedUser.avatar,
        about: savedUser.about,
        createdAt: savedUser.createdAt,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    // Check if email, password, and role are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User Not Found with this email or password" });
    }
    // Check if password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "User Not Found with this email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // Send the token and user details as a response
    res
      .status(200)
      .cookie(
        "token",
        token,
        { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
      )
      .json({
        message: "User logged in successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          number: user.number,
          password: user.password,
          role: user.role,
          avatar: user.avatar,
          about: user.about,
          createdAt: user.createdAt,
        },
        token: token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, number, email, password, about } = req.body;
    if (!fullName || !number || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = fullName;
    user.number = number;
    user.email = email;
    user.password = password;
    user.about = about;

    const updatedUser = await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        number: updatedUser.number,
        password: updatedUser.password,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        about: updatedUser.about,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", "", { maxAge: 0 })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
