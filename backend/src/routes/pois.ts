import { Router } from "express";
import { db } from "../db";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (_, res) => {
  const [rows] = await db.execute("SELECT * FROM pois");
  res.json(rows);
});

router.post("/", auth, async (req: AuthRequest, res) => {
  const { name, x, y, poitype_id, location_id, active } = req.body;
  const row = await db.execute("INSERT INTO pois (name, x, y, user_id, poitype_id, location_id, active) VALUES (?, ?, ?, ?, ?, ?, ?)", [
    name,
    x,
    y,
    req.user!.id,
    poitype_id,
    location_id,
    active
  ]);

  res.status(201).json({ id: (row[0] as any).insertId, name, x, y, poitype_id, location_id, active });
});

// Delete a POI by id
router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.execute("DELETE FROM pois WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete POI" });
  }
});

export default router;
