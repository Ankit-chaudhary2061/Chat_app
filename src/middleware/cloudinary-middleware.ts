import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ---------- Cloudinary Configuration ----------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------- Multer Cloudinary Storage ----------
export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const filename = file.originalname.split(".")[0];

    return {
      folder: "chat-system",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${Date.now()}-${filename}`, 
    };
  },
});

// ---------- Delete Image Utility ----------
export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};