import { Request, Response } from "express";
import User from "../../database/model/user-model";
import { createOtp, resendOtp } from "../../utils/otp-utills";
import bcrypt from "bcrypt";
import { sendmail } from "../../utils/sendmail-utills";
import { otpVerfication, welcomeUser } from "../../utils/email-utills";
import { signAccessToken } from "../../utils/jwt-utills";
import { deleteFromCloudinary } from "../../middleware/cloudinary-middleware";
import crypto from "crypto";

interface IExpressFile {
  profileImage?: Express.Multer.File[];
}

class AuthController {
//   static async register(req: Request, res: Response) {
//     try {
//       const { email, username, password } = req.body;

//       // ---------- Validation ----------
//       if (!email || !username || !password) {
//         return res.status(400).json({
//           message: "All fields are required",
//           status: false,
//         });
//       }

//       // ---------- Existing User Check ----------
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(409).json({
//           message: "User already exists",
//           status: false,
//         });
//       }

//       // ---------- OTP & Password ----------
//       const otp = createOtp();
//       const hashedPassword = await bcrypt.hash(password, 12);
//       const hashedOtp = await bcrypt.hash(otp, 12);
//       const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

//       // ---------- Profile Image ----------
//       const files = req.files as IExpressFile;

//       const profileImage = files?.profileImage?.[0]
//         ? {
//             url: files.profileImage[0].path,
//             public_id: files.profileImage[0].filename,
//           }
//         : null;

//       // ---------- Create User ----------
//       const user = await User.create({
//         username,
//         email,
//         password: hashedPassword,
//         otp: hashedOtp,
//         otpExpires,
//         profileImage,
//       });
//       // ---------- Send OTP Email ----------
//       await sendmail({
//         to: user.email,
//         subject: "Verify Your Email - OTP Code",
//         html: otpVerfication(
//           { username: user.username, email: user.email },
//           otp
//         ),
//       });

//       // ---------- Send Welcome Email ----------
//       await sendmail({
//         to: user.email,
//         subject: "Welcome to Chat System ",
//         html: welcomeUser(user.username),
//       });
//       await user.save()
//       res.status(201).json({
//         message: "Registration successful. OTP sent.",
//         status: true,
//         data: user,
//       });
//     } catch (error : any) {
//       console.error("Register Error:", error);

//       res.status(500).json({
//         message: "Internal server error",
//         status: false,
//         stack:error.stack
        
//       });
//     }
//   }
static async register(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;

    // ---------- Validation ----------
    if (!email || !username || !password) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

    // ---------- Existing User Check ----------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        status: false,
      });
    }

    // ---------- OTP & Password ----------
    const otp = createOtp();
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedOtp = await bcrypt.hash(otp, 12);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // ---------- Profile Image ----------
    const files = req.files as IExpressFile;

    let profileImage;

    if (files?.profileImage?.[0]) {
      // User uploaded image
      profileImage = {
        url: files.profileImage[0].path,
        public_id: files.profileImage[0].filename,
      };
    } else {
      // Assign random avatar
      const idx = Math.floor(Math.random() * 100) + 1;
      profileImage = {
        url: `https://avatars.dicebear.com/api/avataaars/${idx}.svg`,
        public_id: null,
      };
    }

    // ---------- Create User ----------
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires,
      profileImage,
    });

    // ---------- Send OTP Email ----------
    await sendmail({
      to: user.email,
      subject: "Verify Your Email - OTP Code",
      html: otpVerfication({ username: user.username, email: user.email }, otp),
    });

    // ---------- Send Welcome Email ----------
    await sendmail({
      to: user.email,
      subject: "Welcome to Chat System",
      html: welcomeUser(user.username),
    });

    res.status(201).json({
      message: "Registration successful. OTP sent.",
      status: true,
      data: user,
    });

  } catch (error: any) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: "Internal server error",
      status: false,
      stack: error.stack,
      fullStack:error
    });
  }
}
 static async loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // ---------- Validation ----------
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: false,
      });
    }

    // ---------- Find User ----------
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: false,
      });
    }

    // ---------- Email Verification Check ----------
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
        status: false,
      });
    }

    // ---------- Password Check ----------
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: false,
      });
    }


    const access_token = signAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // ---------- Set Cookie ----------
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      status: true,
      access_token,
      user,
    });
  } catch (error: any) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
}
static async otpVerification(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

 
    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

 
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    
    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

   
    const otpMatched = await bcrypt.compare(otp, user.otp);

    if (!otpMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

  
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
static async resendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;

  
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

   
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Account is already verified",
      });
    }

  
    await resendOtp(user);

    return res.status(200).json({
      success: true,
      message: "New OTP has been sent to your email",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
static async getAllUser(req: Request, res: Response) {
  try {
    const users = await User.find().select("-password -otp -otpExpires");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });

  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id).select("-password -otp -otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error("Get User By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async deleteUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // ---------- Validation ----------
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ---------- Find User ----------
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ---------- Delete Profile Image (Cloudinary) ----------
    if (user.profileImage?.public_id) {
      await deleteFromCloudinary(user.profileImage.public_id);
    }

    // ---------- Delete User ----------
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async logout(req: Request, res: Response) {
  try {
    
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async resetPassword(req: Request, res: Response) {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check token expiry
    if (!user.resetPasswordToken || !user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    // Compare token
    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
console.log("DB Token:", user.resetPasswordToken);
console.log("Request Token:", token);
    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

static async forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenHash = await bcrypt.hash(resetToken, 12); // store hash
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = resetTokenExpires;

    await user.save();

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}?email=${user.email}`;
    await sendmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hi ${user.username},</p>
        <p>Click the link below to reset your password. The link is valid for 15 minutes.</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email ",
      token :resetToken
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

}

export default AuthController;