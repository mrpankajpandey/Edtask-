import User from "@/models/User";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { type NextAuthOptions } from "next-auth";
import connectDB from "@/lib/db";
import { generateOtp } from "@/lib/otp";
import Otp from "@/models/Otp";
import { otpType } from "@/enums/OtpType";
import { sendOtpMail } from "@/lib/sendOtpMail";
import { userRoles } from "@/enums/Roles";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({
          email: credentials.email,
          provider: "credentials",
        }).select("+password");

        if (!user) throw new Error("User not found");

        if (!user.isVerified) {
          const otp = generateOtp();
          await Otp.deleteMany({ email: user.email, type: otpType.SIGNUP });
          await Otp.create({
            email: user.email,
            otp,
            type: otpType.SIGNUP,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          });

          // const mail = signupEmail(user.name, user.email, otp);
          await sendOtpMail(user.email, user.name, otp, "signup");

          throw new Error("User is not verified");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || null,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 36 * 60 * 60,
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            provider: "google",
            role: userRoles.STUDENT,
          });
        }
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.phone = existingUser.phone || null;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone || undefined;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as userRoles;
        session.user.phone = token.phone || undefined;
      }
      return session;
    },
  },
};
