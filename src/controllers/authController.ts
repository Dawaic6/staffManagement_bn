import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, department, title, status } = req.body;

    // Validate status
    if (status && !["Researcher", "Employee"].includes(status)) {
       res.status(400).json({ message: "Invalid status value. Must be 'Researcher' or 'Employee'." });
        return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser){
       res.status(400).json({ message: "User already exists" });
        return;
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      department,
      title,
      status,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) 
      { res.status(400).json({ message: "Invalid credentials" });
        return;
      }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      { 
         res.status(400).json({ message: "Invalid credentials" });
          return;
      }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, department: user.department },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)  res.status(404).json({ message: "User not found" });
    res.json(user);
    return;

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, role, department, title, status } = req.body;
    const updateFields: Partial<IUser> = { firstName, lastName, role, department, title, status };

    // Remove undefined fields
    Object.keys(updateFields).forEach(
      (key) => updateFields[key as keyof IUser] === undefined && delete updateFields[key as keyof IUser]
    );

    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select("-password");
    if (!user) res.status(404).json({ message: "User not found" });

    res.json(user);
     return;
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)  res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};