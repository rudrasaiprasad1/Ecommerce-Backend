// src/routes/auth.ts
import express, { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { protect, AuthRequest } from "../middleware/auth";
import User from "../Models/User";
import rateLimit from "express-rate-limit";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

// helper to sign & send cookie
function signSendToken(res: Response, userId: string) {
  const options: SignOptions = {
    expiresIn: parseExpireToMs(JWT_EXPIRES_IN),
  };
  const token = jwt.sign({ id: userId }, JWT_SECRET, options);
  const isProd = process.env.NODE_ENV === "production";

  // cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: isProd, // only send over https in prod
    sameSite: isProd ? ("strict" as const) : ("lax" as const),
    maxAge: parseExpireToMs(JWT_EXPIRES_IN),
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);
  return token;
}

// convert simple "7d" "1h" to ms for cookie maxAge
function parseExpireToMs(exp: string) {
  const num = parseInt(exp.replace(/\D/g, "")) || 7;
  if (exp.includes("d")) return num * 24 * 60 * 60 * 1000;
  if (exp.includes("h")) return num * 60 * 60 * 1000;
  if (exp.includes("m")) return num * 60 * 1000;
  return num * 1000;
}

// ✅ 1. Add rate limiter here
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP
  message: "Too many login/register attempts, please try again later.",
});

// ✅ 2. Apply it only to /login and /register routes
router.use(["/login", "/register"], authLimiter);

/**
 * POST /api/auth/register
 * body: { name, email, password }
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });
    signSendToken(res, user.id);

    res.status(201).json({
      message: "Registered",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user =
      (await User.findOne({ email }).select("+password")) ||
      (await User.findOne({ email }));
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // compare
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signSendToken(res, user.id);
    res.json({
      message: "Logged in",
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", async (_req: Request, res: Response) => {
  // clear cookie by setting a short expiration
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

/**
 * GET /api/auth/me
 * protected route
 */
router.get("/me", protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
