import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not set in .env");
}

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // 1️⃣ Try reading from cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2️⃣ If not found, check header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// // src/middleware/auth.ts

// export const protect = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.cookies?.[COOKIE_NAME];
//     if (!token) return res.status(401).json({ message: "Not authenticated" });

//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: string;
//       iat: number;
//       exp: number;
//     };
//     req.user = { id: decoded.id };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid/expired token" });
//   }
// };
