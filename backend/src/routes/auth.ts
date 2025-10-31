import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { db } from "../db";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash]);
  res.sendStatus(201);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
  const user = (rows as any)[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d"
  });
  res.json({ token });
});

export default router;
