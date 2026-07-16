const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const transporter = nodemailer.createTransport({//createTransport=email sender object or we can say that this is email delivery person
    service:'gmail',//Send emails through Gmail
    auth:{ //Prove that you own the Gmail account.
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for visiting here.</p>
      `
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
exports.sendBookingCancelledEmail = async (email, name, eventName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "❌ Event Booking Cancelled",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2 style="color:#dc2626;">Booking Cancelled</h2>

          <p>Hello <b>${name}</b>,</p>

          <p>Your booking request for</p>

          <h3>${eventName}</h3>

          <p>has been <b style="color:red;">Cancelled</b> by the administrator.</p>

          <p>If you have any questions, please contact the event organizer.</p>

          <br>

          <p>Thank you,</p>
          <h3>EventBook Team</h3>

        </div>
      `
    });

  } catch (err) {
    console.log(err);
  }
};
const sendOTPEmail = async (userEmail, otp, type) => {//This sendOTPEmail function is designed to handle multiple OTP using type parameter 
    try {
        const title = type === 'account_verification' ? 'Verify your  Account' : ' Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };



