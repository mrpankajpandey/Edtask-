export const signupOtpTemplate = (name: string, otp: string) => `
  <div style="font-family: Arial; padding: 20px">
    <h2>Welcome to EduTask 👋</h2>

    <p>Hi <b>${name}</b>,</p>

    <p>Your OTP for email verification is:</p>

    <h1 style="letter-spacing: 4px">${otp}</h1>

    <p>This OTP is valid for 10 minutes.</p>

    <p>If you did not create an account, please ignore this email.</p>

    <br />
    <p>— EduTask Team</p>
  </div>
`

export const forgotPasswordOtpTemplate = (name: string, otp: string) => `
  <div style="font-family: Arial; padding: 20px">
    <h2>Password Reset Request 🔐</h2>

    <p>Hi <b>${name}</b>,</p>

    <p>We received a request to reset your password.</p>

    <p>Your OTP is:</p>

    <h1 style="letter-spacing: 4px">${otp}</h1>

    <p>This OTP is valid for 10 minutes.</p>

    <p>If you did not request this, you can safely ignore this email.</p>

    <br />
    <p>— EduTask Team</p>
  </div>
`
