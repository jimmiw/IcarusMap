
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import poiRoutes from "./routes/pois";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/pois", poiRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));
