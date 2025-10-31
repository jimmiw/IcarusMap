import { useState } from "react";

export default function AddPOIPopup({
  x,
  y,
  onCancel,
  onSubmit,
}: {
  x: number;
  y: number;
  onCancel: () => void;
  onSubmit: (name: string, poitype_id: number, location_id: number, active: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [poitype_id, setPOITypeId] = useState(0);
  const [location_id, setLocationId] = useState(0);
  const [active, setActive] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        padding: "1rem",
        background: "white",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        zIndex: 1000,
        width: 250,
      }}
    >
      <h3>Add POI</h3>
      <div style={{ marginBottom: 8 }}>
        <label>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Type</label>
        <select
          value={poitype_id}
          onChange={e => setPOITypeId(parseInt(e.target.value))}
          style={{ width: "100%" }}
        >
          <option value="13">Base</option>
          <option value="14">Outpost</option>
          <option value="1">Iron</option>
        </select>
      </div>
        <div style={{ marginBottom: 8 }}>
        <label>Location ID</label>
        <input
          type="number"
          value={location_id}
          onChange={e => setLocationId(parseInt(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={active}
            onChange={e => setActive(e.target.checked)}
          />
          Active?
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => onSubmit(name, poitype_id, location_id, active)}>Add</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
