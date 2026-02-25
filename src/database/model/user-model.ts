import mongoose from "mongoose";
import { UserRole } from "../../types/user-types";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User
    },

    active: {
      type: Boolean,
      default: false
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    phoneNumber: {
      type: Number,
      required: false
    },

    profileImage: {
      type: {
        url: {
          type: String,
          required: true
        },
        public_id: {
          type: String,
          required: false
        }
      },
      required: false,
      default: null
    },

    otp: {
      type: String,
      select: false
    },

    otpExpires: {
      type: Date
    },

    bio: {
      type: String,
      default: ""
    },

    nativeLanguage: {
      type: String,
      default: ""
    },

    learningLanguage: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      default: ""
    },

    isOnBoarded: {
      type: Boolean,
      default: false
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;