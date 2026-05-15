import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Problem } from "@/hooks/useProblems";
import { categoryConfig, severityConfig } from "@/lib/problems";

interface MapViewProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  centerCity?: string;
}

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

const cityCoords: Record<string, [number, number]> = {
  Fortaleza: [-3.7327, -38.5267],
  Caucaia: [-3.7361, -38.6531],
  "Juazeiro do Norte": [-7.2128, -39.3151],
  Sobral: [-3.6886, -40.3496],
  Maracanaú: [-3.8767, -38.6256],
  Crato: [-7.2342, -39.4096],
};

function makeIcon(color: string, count: number, resolved: boolean) {
  const html = `
    <div style="position:relative;display:flex;flex-direction:column;align-items:center">
      ${!resolved ? `<div style="position:absolute;width:36px;height:36px;border-radius:50%;background:${color};opacity:0.25;animation:fxPing 2s infinite"></div>` : ""}
      <div style="position:relative;width:32px;height:32px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:11px;font-family:Inter">${count}</div>
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${color};margin-top:-2px"></div>
    </div>`;
  return L.divIcon({ html, className: "fastfix-pin", iconSize: [32, 40], iconAnchor: [16, 40] });
}

const Recenter = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
};

const MapView = ({ problems, onSelectProblem, centerCity = "Fortaleza" }: MapViewProps) => {
  const center: [number, number] = cityCoords[centerCity] || cityCoords.Fortaleza;

  const validProblems = useMemo(
    () => problems.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)),
    [problems]
  );

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <style>{`
        @keyframes fxPing { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(2);opacity:0} }
        .leaflet-container { background: hsl(var(--muted)); font-family: var(--font-body); }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: var(--shadow-elegant); }
        .leaflet-popup-content { margin: 12px 14px; }
      `}</style>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        dragging
        style={{ width: "100%", height: "100%" }}
      >
        <Recenter center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validProblems.map((p) => {
          const color = severityColors[p.severity] || "#94a3b8";
          const icon = makeIcon(color, p.upvotes, p.status === "resolved");
          const cat = categoryConfig[p.category];
          return (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {severityConfig[p.severity].label} · {cat.label}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: 14, marginTop: 4, color: "hsl(var(--foreground))" }}>{p.title}</p>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>📍 {p.address}</p>
                  <button
                    onClick={() => onSelectProblem(p)}
                    style={{
                      marginTop: 8, width: "100%", padding: "6px 10px", borderRadius: 8,
                      background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))",
                      fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
                    }}
                  >
                    Ver detalhes ({p.upvotes} apoios)
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] glass-card rounded-lg p-3 shadow-elegant">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Severidade</p>
        <div className="flex gap-3">
          {Object.entries(severityColors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-muted-foreground capitalize">
                {severityConfig[key as keyof typeof severityConfig]?.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
