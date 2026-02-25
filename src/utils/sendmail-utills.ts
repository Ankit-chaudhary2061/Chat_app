import nodemailer from "nodemailer";

interface IAttachment {
  filename: string;
  path?: string;
  content?: Buffer | string;
  contentType?: string;
}

interface IMailOption {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: IAttachment[];
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendmail = async (mailOption: IMailOption) => {
  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Auth System" <${process.env.SMTP_USER}>`,
      to: mailOption.to,
      subject: mailOption.subject,
      html: mailOption.html,
      attachments: mailOption.attachments,
    };

   await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${mailOption.to}`);
  } catch (error) {
    console.error(" Email sending failed:", error);
    throw error;
  }
};