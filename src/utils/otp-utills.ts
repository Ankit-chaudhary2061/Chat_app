import crypto from "crypto"
import bcrypt from "bcrypt"
import { sendmail } from "./sendmail-utills";
import { otpVerfication } from "./email-utills";





export const createOtp = (length = 6) : string =>{
    let otp = ''
    for (let i = 0; i < length; i ++ ){
    otp += crypto.randomInt(0, 10);

    }
    return otp
}

export const resendOtp = async (user: any): Promise<void> => {
  try {
    const newOtp = createOtp();
    const hashedOtp = await bcrypt.hash(newOtp, 12);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;

    await user.save();

    await sendmail({
      to: user.email,
      subject: "Your New OTP Code",
      html: otpVerfication(user, newOtp),
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    throw new Error("Failed to resend OTP");
  }
};