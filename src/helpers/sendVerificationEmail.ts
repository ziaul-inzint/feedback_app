import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Feedback App | Verification Code",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    return { success: true, message: "Verification email sent succefully" };
  } catch (error) {
    console.log("Error sending email", error);
    return { success: false, message: "Failed to send email" };
  }
};
