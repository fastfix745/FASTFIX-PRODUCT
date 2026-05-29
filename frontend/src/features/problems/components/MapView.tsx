import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Problem } from "@/features/problems/hooks/useProblems";

import { categoryConfig, severityConfig } from "@/features/problems/config/problems";

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

const FlyTo = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, Math.max(map.getZoom(), 16), { duration: 1.2 });
  }, [position, map]);
  return null;
};

const MapView = ({ problems, onSelectProblem, centerCity = "Fortaleza" }: MapViewProps) => {
  const center: [number, number] = cityCoords[centerCity] || cityCoords.Fortaleza;
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    if (!("geolocation" in navigator)) {
      toast.error("GPS indisponível", { description: "Seu navegador não suporta geolocalização." });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
        toast.success("Localização encontrada");
      },
      (err) => {
        setLocating(false);
        toast.error("Não foi possível obter sua localização", {
          description: err.code === 1 ? "Permita o acesso ao GPS nas configurações do navegador." : "Tente novamente.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };


  const validProblems = useMemo(
    () => problems.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)),
    [problems]
  );

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden isolate" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes fxPing { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(2);opacity:0} }
        .leaflet-container { background: hsl(var(--muted)); font-family: var(--font-body); position: relative; z-index: 0; }
        .leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 1 !important; }
        .leaflet-popup-pane { z-index: 5 !important; }
        .leaflet-control { z-index: 5 !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: var(--shadow-elegant); }
        .leaflet-popup-content { margin: 12px 14px; }
      `}</style>
      <MapContainer
        center={center}
        zoom={13}
        minZoom={3}
        maxZoom={19}
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        dragging
        worldCopyJump={false}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        style={{ width: "100%", height: "100%" }}
      >
        <Recenter center={center} />
        <FlyTo position={userPos} />
        {userPos && (
          <CircleMarker
            center={userPos}
            radius={9}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.85, weight: 3 }}
          >
            <Popup>Você está aqui</Popup>
          </CircleMarker>
        )}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap
          minZoom={3}
          maxZoom={19}
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

      <button
        type="button"
        onClick={handleLocate}
        disabled={locating}
        className="absolute top-4 right-4 z-[1000] w-11 h-11 rounded-full glass-card shadow-elegant flex items-center justify-center text-foreground hover:text-accent hover:scale-105 active:scale-95 transition disabled:opacity-70"
        aria-label="Minha localização"
        title="Minha localização"
      >
        {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Locate className="w-5 h-5" />}
      </button>


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
