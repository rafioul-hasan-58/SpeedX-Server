"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTemplates = void 0;
exports.AuthTemplates = {
    otp: (otp, formattedDate) => `
  <div style="max-width: 600px; margin: 0 auto; background-color: #000721; color: #333; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">
    
    <!-- Header -->
    <div style="padding: 24px 24px 0;">
      <table style="width: 100%;">
        <tr>
          <td>
            <img src="https://res.cloudinary.com/shariful10/image/upload/v1749700233/yldrmw7kojhei2lddt8k.png"
              alt="logo"
              style="height: 40px;" />
          </td>
          <td style="text-align: right; color: #999; font-size: 13px;">${formattedDate}</td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px;">
      
      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; width: 64px; height: 64px; background-color: #0ea5e9; border-radius: 50%; line-height: 64px; font-size: 28px; text-align: center;">
          ✉️
        </div>
      </div>

      <!-- Title -->
      <h2 style="text-align: center; color: #ffffff; margin: 0 0 8px; font-size: 22px;">
        Verify Your Email
      </h2>
      <p style="text-align: center; color: #94a3b8; font-size: 14px; margin: 0 0 32px;">
        Use the code below to complete your verification. This code expires in <strong style="color: #0ea5e9;">10 minutes</strong>.
      </p>

      <!-- OTP Box -->
      <div style="background-color: #0f1f4b; border: 1px solid #1e3a8a; border-radius: 12px; padding: 28px 24px; text-align: center; margin-bottom: 28px;">
        <p style="color: #94a3b8; font-size: 13px; margin: 0 0 12px; letter-spacing: 1px; text-transform: uppercase;">
          Your verification code
        </p>
        <div style="display: inline-block;">
          <span style="font-size: 40px; font-weight: bold; color: #ffffff; letter-spacing: 12px;">${otp}</span>
        </div>
        <div style="margin-top: 16px; height: 3px; background: linear-gradient(to right, #0ea5e9, #38bdf8); border-radius: 2px;"></div>
      </div>

      <!-- Warning -->
      <div style="background-color: #1e1a0f; border: 1px solid #854d0e; border-radius: 8px; padding: 14px 16px; margin-bottom: 28px;">
        <p style="color: #fbbf24; font-size: 13px; margin: 0;">
          ⚠️ &nbsp;Never share this code with anyone. SpeedX will never ask for your OTP.
        </p>
      </div>

      <!-- Info -->
      <p style="text-align: center; color: #64748b; font-size: 13px; margin: 0;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #1e3a8a; padding: 16px 24px; text-align: center;">
      <p style="color: #475569; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} SpeedX. All rights reserved.
      </p>
    </div>

  </div>
  `,
    resetPassword: (resetLink, formattedDate) => `
  <div style="max-width: 600px; margin: 0 auto; background-color: #000721; color: #333; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">

    <!-- Header -->
    <div style="padding: 24px 24px 0;">
      <table style="width: 100%;">
        <tr>
          <td>
            <img src="https://res.cloudinary.com/shariful10/image/upload/v1749700233/yldrmw7kojhei2lddt8k.png"
              alt="logo"
              style="height: 40px;" />
          </td>
          <td style="text-align: right; color: #999; font-size: 13px;">${formattedDate}</td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px;">

      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; width: 64px; height: 64px; background-color: #0ea5e9; border-radius: 50%; line-height: 64px; font-size: 28px; text-align: center;">
          🔒
        </div>
      </div>

      <!-- Title -->
      <h2 style="text-align: center; color: #ffffff; margin: 0 0 8px; font-size: 22px;">
        Reset Your Password
      </h2>
      <p style="text-align: center; color: #94a3b8; font-size: 14px; margin: 0 0 32px;">
        Click the button below to reset your password. This link expires in <strong style="color: #0ea5e9;">10 minutes</strong>.
      </p>

      <!-- Button -->
      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${resetLink}"
          style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold; padding: 14px 36px; border-radius: 8px;">
          Reset Password
        </a>
      </div>

      <!-- Link fallback -->
      <div style="background-color: #0f1f4b; border: 1px solid #1e3a8a; border-radius: 8px; padding: 14px 16px; margin-bottom: 28px;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px;">Or copy this link:</p>
        <p style="color: #38bdf8; font-size: 12px; margin: 0; word-break: break-all;">${resetLink}</p>
      </div>

      <!-- Warning -->
      <div style="background-color: #1e1a0f; border: 1px solid #854d0e; border-radius: 8px; padding: 14px 16px; margin-bottom: 28px;">
        <p style="color: #fbbf24; font-size: 13px; margin: 0;">
          ⚠️ &nbsp;If you didn't request a password reset, please ignore this email or contact support.
        </p>
      </div>

      <p style="text-align: center; color: #64748b; font-size: 13px; margin: 0;">
        This link will expire in 10 minutes for your security.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #1e3a8a; padding: 16px 24px; text-align: center;">
      <p style="color: #475569; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} SpeedX. All rights reserved.
      </p>
    </div>

  </div>
  `,
};
