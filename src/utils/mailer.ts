import nodemailer from "nodemailer";

export const sendResetCode = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FMEA System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Password Reset Code",
    text: `Your reset code is: ${code}`,
  });
};
