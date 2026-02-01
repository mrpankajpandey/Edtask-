import { sendMail } from "./mail"
import {
  signupOtpTemplate,
  forgotPasswordOtpTemplate,
} from "./emailTemplates"

export async function sendOtpMail(
  email: string,
  name: string,
  otp: string,
  type: "signup" | "forgot"
) {
  const subject =
    type === "signup"
      ? "Verify your email - EduTask"
      : "Reset your password - EduTask"

  const html =
    type === "signup"
      ? signupOtpTemplate(name, otp)
      : forgotPasswordOtpTemplate(name, otp)

  await sendMail({
    to: email,
    subject,
    html,
  })
}
