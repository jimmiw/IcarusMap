
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: "../.env.local" });
}

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import poiRoutes from "./routes/pois";

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: [frontendUrl], // or "*" for testing
  credentials: true
}));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/pois", poiRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));
