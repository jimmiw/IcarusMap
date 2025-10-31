import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPOIs, addPOI, deletePOI } from "./api";
import { POI } from "./types";
import AddPOIPopup from "./AddPOIPopup";

export default function MapPage({ token }: { token: string }) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [markers, setMarkers] = useState<Map<number, L.Marker>>(new Map());
  const [pois, setPois] = useState<POI[]>([]);
  const [pendingPOI, setPendingPOI] = useState<{ x: number; y: number } | null>(
    null
  );

  // Initialize map with current POIs
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const m = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 4,
    });

    const bounds: L.LatLngBoundsLiteral = [
      [0, 0],
      [2048, 2048],
    ];
    L.imageOverlay("/images/Map_Olympus.jpeg", bounds).addTo(m);
    m.fitBounds(bounds);

    mapRef.current = m;

    // Load existing POIs on map load
    getPOIs().then((pois) => {
      setPois(pois);
      pois.forEach((poi) => {
        addPOIMarker(poi);
        // const marker = L.marker([poi.y, poi.x]).addTo(m).bindPopup(`<div><strong>${poi.name}</strong><br/>Type: ${poi.poitype_id}</div>`);
        // setMarkers((prev) => new Map(prev).set(poi.id, marker));
      });
      //   const newMarkers = new Map<number, L.Marker>();
      //   pois.forEach(poi => {
      //     const marker = L.marker([poi.y, poi.x])
      //       .addTo(m)
      //       .bindPopup(poi.name);
      //     newMarkers.set(poi.id, marker);
      //   });
      //   setMarkers(newMarkers);
    });
  }, []);

  // Add POI on left-click
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !token) return;

    const handleAdd = async (e: L.LeafletMouseEvent) => {
      setPendingPOI({ x: e.latlng.lng, y: e.latlng.lat });
      //   const name = prompt("POI name?");
      //   if (!name) return;

      //   const x = e.latlng.lng;
      //   const y = e.latlng.lat;

      //   // Add to backend
      //   const newPOI: POI = await addPOI({ name, x, y } as POI, token);

      //   // Add marker to map
      //   const marker = L.marker([y, x]).addTo(m).bindPopup(name);
      //   setMarkers(prev => new Map(prev).set(newPOI.id, marker));
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

    const handleDelete = async (event: L.LeafletMouseEvent) => {
      // Find nearest marker (simple distance check)
      let nearestId: number | null = null;
      let nearestDist = Infinity;

      // finds the closest marker to the right-click location
      markers.forEach((marker, id) => {
        const latlng = marker.getLatLng();
        const dist = m.distance(event.latlng, latlng);
        if (dist < nearestDist && dist < 40) {
          // 20 px threshold
          nearestDist = dist;
          nearestId = id;
        }
      });

      if (!nearestId) return;

      if (!confirm("Delete this POI?")) return;

      // Delete POI from backend
      await deletePOI(nearestId, token);

      // Remove from map and state
      const marker = markers.get(nearestId);
      if (marker)
        m.removeLayer(marker);

      setMarkers((prev) => {
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


  // handles adding new POIs to the map after form submission
  async function handleAddPOI(
    name: string,
    poitype_id: number,
    location_id: number,
    active: boolean
  ) {
    const m = mapRef.current;
    if (!pendingPOI || !m || !token) return;
    
    // calls backend to add POI
    const newPOI: POI = await addPOI(
      {
        name,
        poitype_id,
        location_id,
        active,
        x: pendingPOI.x,
        y: pendingPOI.y,
      } as POI,
      token
    );

    setPois([...pois, newPOI]);

    // Add POI marker to map
    addPOIMarker(newPOI);

    // resetting pending POI to null to close the popup
    setPendingPOI(null);
  }

  // adds a POI marker to the map
  function addPOIMarker(poi: POI) {
    const m = mapRef.current;
    if (!m) return;

    console.log("Adding POI marker:", poi);
    const marker = L.marker([poi.y, poi.x])
      .addTo(m)
      .bindPopup(`<div><strong>${poi.name}</strong><br/>Type: ${poi.poitype_id}<br/>Loc: ${poi.location_id}</div>`);

    // Add POI marker to the map
    setMarkers((prev) => new Map(prev).set(poi.id, marker));
  }

  return (
    <>
      <div ref={mapContainerRef} style={{ height: "100vh" }} />
      {pendingPOI && (
        <AddPOIPopup
          x={pendingPOI.x}
          y={pendingPOI.y}
          onCancel={() => setPendingPOI(null)}
          onSubmit={handleAddPOI}
        />
      )}
    </>
  );
}
