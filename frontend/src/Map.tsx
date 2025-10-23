import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPOIs, addPOI, deletePOI } from "./api";
import { POI } from "./types";

export default function MapPage({ token }: { token: string }) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [markers, setMarkers] = useState<Map<number, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const m = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 4,
    });

    const bounds: L.LatLngBoundsLiteral = [[0, 0], [2048, 2048]];
    L.imageOverlay("/images/Map_Olympus.jpeg", bounds).addTo(m);
    m.fitBounds(bounds);

    mapRef.current = m;

    // Load existing POIs
    getPOIs().then(pois => {
      const newMarkers = new Map<number, L.Marker>();
      pois.forEach(poi => {
        const marker = L.marker([poi.y, poi.x])
          .addTo(m)
          .bindPopup(poi.name);
        newMarkers.set(poi.id, marker);
      });
      setMarkers(newMarkers);
    });
  }, []);

  // Add POI on left-click
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !token) return;

    const handleAdd = async (e: L.LeafletMouseEvent) => {
      const name = prompt("POI name?");
      if (!name) return;

      const x = e.latlng.lng;
      const y = e.latlng.lat;

      // Add to backend
      const newPOI: POI = await addPOI({ name, x, y } as POI, token);

      // Add marker to map
      const marker = L.marker([y, x]).addTo(m).bindPopup(name);
      setMarkers(prev => new Map(prev).set(newPOI.id, marker));
    };

    m.on("click", handleAdd);

    return () => {
      m.off("click", handleAdd);
    };
  }, [token]);

  // Delete POI on right-click
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !token) return;

    const handleDelete = async (e: L.LeafletMouseEvent) => {
      // Find nearest marker (simple distance check)
      let nearestId: number | null = null;
      let nearestDist = Infinity;

      markers.forEach((marker, id) => {
        const latlng = marker.getLatLng();
        const dist = m.distance(e.latlng, latlng);
        if (dist < nearestDist && dist < 20) { // 20 px threshold
          nearestDist = dist;
          nearestId = id;
        }
      });

      if (!nearestId) return;

      if (!confirm("Delete this POI?")) return;

      // Delete from backend
      await deletePOI(nearestId, token);

      // Remove from map and state
      const marker = markers.get(nearestId);
      if (marker) m.removeLayer(marker);
      setMarkers(prev => {
        const newMap = new Map(prev);
        newMap.delete(nearestId!);
        return newMap;
      });
    };

    m.on("contextmenu", handleDelete);

    return () => {
      m.off("contextmenu", handleDelete);
    };
  }, [markers, token]);

  return <div ref={mapContainerRef} style={{ height: "100vh" }} />;
}
