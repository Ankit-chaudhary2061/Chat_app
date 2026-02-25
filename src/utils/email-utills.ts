export const otpVerfication = (user:{username : string; eamil:string}, otp:string)=>{
const html = `
  <div style="margin:0; padding:0; background-color:#f4f6fb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">
          <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" 
            style="background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 5px 15px rgba(0,0,0,0.08);">
            
            <tr>
              <td align="center">
                <h1 style="margin:0; color:#1f2937;"> Email Verification</h1>
                <p style="color:#6b7280; font-size:15px; margin:10px 0 20px;">
                  Hello <b>${user.username}</b>, verify your email using the OTP below.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center">
                <div style="
                  font-size:32px;
                  font-weight:700;
                  letter-spacing:6px;
                  color:#2563eb;
                  background:#eef2ff;
                  padding:15px 25px;
                  border-radius:10px;
                  display:inline-block;
                  margin:20px 0;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td align="center">
                <p style="color:#6b7280; font-size:14px; margin:0;">
                  This OTP is valid for <b>5 minutes</b>.
                </p>
                <p style="color:#9ca3af; font-size:13px; margin:10px 0 0;">
                  If you did not request this, please ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <hr style="border:none; border-top:1px solid #e5e7eb; margin:25px 0;" />
              </td>
            </tr>

            <tr>
              <td align="center">
                <p style="font-size:12px; color:#9ca3af; margin:0;">
                  © 2026 Auth System · All rights reserved
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  return html;
}

export const welcomeUser = (username: string) => {
  const html = `
  <div style="
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  ">
    
    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 20px;
      text-align: center;
      color: #ffffff;
    ">
      <h1 style="margin: 0; font-size: 24px;">Welcome to Chat System </h1>
    </div>

    <!-- Body -->
    <div style="padding: 24px; color: #374151;">
      <h2 style="margin-top: 0;">Hi ${username}, </h2>

      <p style="line-height: 1.6;">
        We're excited to have you on board!  
        Your account has been successfully created and you're now part of our growing community.
      </p>

      <p style="line-height: 1.6;">
        Start chatting, exploring, and connecting with people around the world.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="
          display: inline-block;
          padding: 12px 28px;
          background: #4f46e5;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        ">
          Get Started
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        If you didn’t create this account, please ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="
      background: #f9fafb;
      padding: 15px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
    ">
      © ${new Date().getFullYear()} Chat System. All rights reserved.
    </div>

  </div>
  `;

  return html;
};