import { useState } from "react";
import { toast } from "sonner";

export const useCityDetection = () => {
  const [city, setCity] = useState("");
  const [detectingCity, setDetectingCity] = useState(false);

  const detectCity = async () => {
    if (!("geolocation" in navigator)) {
      toast.error("GPS indisponível", { description: "Seu navegador não suporta geolocalização." });
      return;
    }
    setDetectingCity(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      );
      const { latitude, longitude } = pos.coords;
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`,
        { headers: { Accept: "application/json" } }
      );
      const data = await resp.json();
      const a = data?.address ?? {};
      const detected = a.city || a.town || a.village || a.municipality || a.county || "";
      if (!detected) throw new Error("Cidade não identificada");
      setCity(detected);
      toast.success("Localização detectada", { description: detected });
    } catch (err) {
      const e = err as GeolocationPositionError | Error;
      const denied = "code" in e && e.code === 1;
      toast.error("Não foi possível detectar sua cidade", {
        description: denied ? "Permita o acesso ao GPS no navegador." : "Tente novamente.",
      });
    } finally {
      setDetectingCity(false);
    }
  };

  return { city, setCity, detectingCity, detectCity };
};
