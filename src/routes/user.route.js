import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  getUserProfile,
  getAllUsers,
} from "../controller/user.controller.js";
const router = express.Router();
import isAuthenticated from "../middleware/authenticate.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/update-profile", isAuthenticated, updateProfile);
router.get("/get-user-profile", isAuthenticated, getUserProfile);
router.get("/get-all-user-profile", isAuthenticated, getAllUsers);

export default router;
