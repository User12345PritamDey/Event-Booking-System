const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================
// Booking Confirmation Email
// ==========================

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎉 Booking Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2 style="color:#16a34a;">Booking Confirmed</h2>

          <p>Hello <b>${userName}</b>,</p>

          <p>Your booking for</p>

          <h3>${eventTitle}</h3>

          <p>has been <b style="color:green;">Confirmed</b>.</p>

          <p>We look forward to seeing you at the event.</p>

          <br>

          <p>Thank you,</p>
          <h3>EventBook Team</h3>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Booking confirmation email sent to", userEmail);
  } catch (error) {
    console.error("Error sending booking email:", error);
  }
};

// ==========================
// Booking Cancelled Email
// ==========================

const sendBookingCancelledEmail = async (
  email,
  name,
  eventName
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "❌ Event Booking Cancelled",
      html: `
        <div style="font-family:Arial;padding:20px">

          <h2 style="color:#dc2626;">
            Booking Cancelled
          </h2>

          <p>Hello <b>${name}</b>,</p>

          <p>Your booking for</p>

          <h3>${eventName}</h3>

          <p>
            has been
            <b style="color:red;"> Cancelled </b>.
          </p>

          <p>
            If you have any questions,
            please contact the event organizer.
          </p>

          <br>

          <p>Thank you,</p>

          <h3>EventBook Team</h3>

        </div>
      `,
    });

    console.log("Booking cancelled email sent to", email);
  } catch (err) {
    console.log("Error sending cancelled email:", err);
  }
};

// ==========================
// OTP Email
// ==========================

const sendOTPEmail = async (
  userEmail,
  otp,
  type
) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify Your Account"
        : "Booking Verification OTP";

    const msg =
      type === "account_verification"
        ? "Please use the OTP below to verify your account."
        : "Please use the OTP below to verify your event booking.";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: title,
      html: `
        <div style="font-family:Arial;text-align:center;padding:20px">

          <h2>${title}</h2>

          <p>${msg}</p>

          <div
            style="
              margin:20px auto;
              padding:15px;
              font-size:28px;
              font-weight:bold;
              background:#f4f4f4;
              width:max-content;
              letter-spacing:6px;
              border-radius:10px;
            "
          >
            ${otp}
          </div>

          <p style="color:#666;">
            OTP is valid for only
            <b>5 minutes</b>.
          </p>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

// ==========================
// Export
// ==========================

module.exports = {
  sendBookingEmail,
  sendBookingCancelledEmail,
  sendOTPEmail,
};