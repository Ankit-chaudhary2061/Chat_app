import { Router } from "express";
import multer from "multer";
import { storage } from "../middleware/cloudinary-middleware"; 
import AuthController from "../controller/AuthController/auth-controller";

const router = Router();

// ---------- Multer Upload ----------
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// -------------------- Routes --------------------

// Register User (with optional profile image)
router.post("/register", upload.fields([{ name: "profileImage", maxCount: 1 }]), AuthController.register);

// Login User
router.post("/login", AuthController.loginUser);

// OTP Verification
router.post("/otp-verification", AuthController.otpVerification);

// Resend OTP
router.post("/resend-otp", AuthController.resendOtp);

// Get All Users
router.get("/users", AuthController.getAllUser);

// Get User By ID
router.get("/users/:id", AuthController.getUserById);

// Delete User By ID
router.delete("/users/:id", AuthController.deleteUserById);

// Forgot password
router.post("/forgot-password", AuthController.forgotPassword);

// Reset password
router.post("/reset-password", AuthController.resetPassword);

export default router;