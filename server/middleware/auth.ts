import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import { db } from "../db.js";
import { users } from "@shared/schema";

// Passport LocalStrategy — checks username/password against users table
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      if (!user) {
        return done(null, false, { message: "Usuario no encontrado" });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Contrasena incorrecta" });
      }
      return done(null, { id: user.id, username: user.username });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) {
      return done(null, false);
    }
    done(null, { id: user.id, username: user.username });
  } catch (err) {
    done(err);
  }
});

// Middleware that requires authentication — returns 401 if not logged in
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "No autenticado" });
}

export default passport;
