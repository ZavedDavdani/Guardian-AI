import { useEffect, useRef } from "react";
import L, { LayerGroup, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getSeverityColor } from "../../shared/severity";
import type { Incident } from "../../shared/types";

interface LiveMapProps {
  incidents: Incident[];
}


const HYDERABAD_CENTER: [number, number] = [17.4374, 78.4482];

const COLOR_MAP: Record<"red" | "yellow" | "green", string> = {
  red: "#dc2626",
  yellow: "#d97706",
  green: "#16a34a",
};

export default function LiveMap({
  incidents = [],
}: LiveMapProps): React.ReactElement {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markersLayer = useRef<LayerGroup | null>(null);

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    mapInstance.current = L.map(mapRef.current, {
      zoomControl: true,
    }).setView(HYDERABAD_CENTER, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    markersLayer.current = L.layerGroup().addTo(mapInstance.current);
  }, []);

  useEffect(() => {
    if (!markersLayer.current) return;

    markersLayer.current.clearLayers();

    incidents.forEach((inc) => {
      const lat = inc.latitude ?? HYDERABAD_CENTER[0];
      const lng = inc.longitude ?? HYDERABAD_CENTER[1];

      const color =
        COLOR_MAP[getSeverityColor(inc.urgency) as "red" | "yellow" | "green"];

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            background:${color};
            color:white;
            font-family:'JetBrains Mono', monospace;
            font-weight:700;
            font-size:12px;
            width:34px;
            height:34px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 0 0 6px ${color}33;
          ">
            ${inc.victim_count || "!"}
          </div>
        `,
        iconSize: [34, 34],
      });

      L.marker([lat, lng], { icon }).addTo(markersLayer.current!);
    });
  }, [incidents]);

  return (
    <div className="panel" style={{ flex: 2, minWidth: "320px" }}>
      <div className="panel-header">
        <h3>Live Map — Hyderabad</h3>
      </div>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />
    </div>
  );
}