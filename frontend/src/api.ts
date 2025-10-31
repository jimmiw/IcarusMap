import { POI } from "./types";

const API_URL = "http://localhost:3001/api";

export async function getPOIs(): Promise<POI[]> {
  const res = await fetch(`${API_URL}/pois`);
  return res.json();
}

export async function addPOI(poi: Omit<POI, "id">, token: string) {
  const res = await fetch(`${API_URL}/pois`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(poi)
  });

  return res.json();
}

export async function deletePOI(id: number, token: string) {
  const res = await fetch(`${API_URL}/pois/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// TODO: add updatePOI function
// TODO: add getLocations function
// TODO: add getPOITypes function