// src/context/LocationContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface LocationContextType {
  // data
  pincode: string | null;
  locationId: number | null;
  areaName: string | null;
  isServiceable: boolean | null; // null = unknown, true/false = validated
  loading: boolean;
  error: string | null;
  coords?: { lat: number; lng: number };

  // actions
  validatePincode: (pin: string) => Promise<void>;
  fetchUserLocation: () => Promise<void>;
  fetchUserLocationPrecise: () => Promise<void>;
  setPincode: React.Dispatch<React.SetStateAction<string | null>>;
  setAreaName: React.Dispatch<React.SetStateAction<string | null>>;
  setManualPincode: (pin: string) => void;
  clearLocationCache: () => void;
}

const LocationContext = createContext<LocationContextType | null>(null);

// --- Config ---
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "") || null;
const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// --- Helpers ---
async function safeJsonFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Non-JSON (${res.status}) from ${url}: ${text.slice(0, 140)}`
    );
  }
  const data = await res.json();
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || "Request failed";
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  return data;
}

// Minimal geocode types to avoid `any`
type GeocodeComponent = { long_name: string; types?: string[] };
type GeocodeResult = {
  geometry?: { location: { lat: number; lng: number } };
  address_components?: GeocodeComponent[];
};
type GeocodeResponse = { status: string; results?: GeocodeResult[] };

type Cached = {
  pincode?: string | null;
  areaName?: string | null;
  coords?: { lat: number; lng: number } | null;
  result?: {
    location_id?: number | null;
    is_serviceable?: boolean | null;
  } | null;
  ts?: number; // epoch ms
};

const CACHE_KEY = "cf_location_v3";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function loadCache(): Cached | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (!parsed.ts || Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(data: Cached) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, ts: Date.now() }));
  } catch {}
}

export const LocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pincode, setPincode] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [areaName, setAreaName] = useState<string | null>(null);
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearLocationCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {}
    setError(null);
    setPincode(null);
    setAreaName(null);
    setLocationId(null);
    setIsServiceable(null);
    setCoords(undefined);
  };

  // Reverse geocode → prefer postal_code
  const reverseGeocode = async (
    lat: number,
    lng: number
  ): Promise<{ pin: string | null; area: string | null }> => {
    if (!GOOGLE_KEY) return { pin: null, area: null };

    const postalUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=postal_code&region=in&language=en&key=${GOOGLE_KEY}`;

    try {
      let res = await fetch(postalUrl);
      let data = (await res.json()) as GeocodeResponse;

      if (data.status !== "OK" || !data.results?.length) {
        const fallbackUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&region=in&language=en&key=${GOOGLE_KEY}`;
        res = await fetch(fallbackUrl);
        data = (await res.json()) as GeocodeResponse;
        if (data.status !== "OK") return { pin: null, area: null };
      }

      for (const r of data.results || []) {
        const comps = r.address_components || [];
        const pin =
          comps.find((c) => (c.types || []).includes("postal_code"))
            ?.long_name || null;
        if (pin) return { pin, area: null };
      }

      return { pin: null, area: null };
    } catch {
      return { pin: null, area: null };
    }
  };

  const setManualPincode = (pin: string) => {
    setPincode(pin);
    saveCache({ pincode: pin, areaName, coords, result: null });
  };

  // Validate with backend (if configured)
  const validatePincode = async (pin: string): Promise<void> => {
    setError(null);
    if (!pin || pin.length < 6) {
      setIsServiceable(null);
      setError("Invalid pincode");
      return;
    }
    setPincode(pin);

    if (!API_BASE) {
      setLocationId(null);
      setIsServiceable(null);
      saveCache({ pincode: pin, areaName, coords, result: null });
      return;
    }

    try {
      setLoading(true);
      const data = await safeJsonFetch(`${API_BASE}/api/location/validate/${pin}`);
      setLocationId(data?.location_id ?? null);
      if (data?.area_name) setAreaName(data.area_name);
      setIsServiceable(Boolean(data?.is_serviceable));
      saveCache({
        pincode: pin,
        areaName: data?.area_name ?? areaName,
        coords,
        result: {
          location_id: data?.location_id ?? null,
          is_serviceable: Boolean(data?.is_serviceable),
        },
      });
    } catch (err) {
      console.warn("Pincode validation error:", (err as Error).message);
      setIsServiceable(false); // conservative fallback
      setLocationId(null);
      setError("We couldn't validate your area right now.");
    } finally {
      setLoading(false);
    }
  };

  // Standard GPS (fast)
  const fetchUserLocation = async (): Promise<void> => {
    setError(null);
    const isLocalhost =
      typeof window !== "undefined" &&
      (location.hostname === "localhost" || location.hostname === "127.0.0.1");
    if (typeof window !== "undefined" && !window.isSecureContext && !isLocalhost) {
      setError("Please use HTTPS to allow location access.");
      return;
    }
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation not supported on this device.");
      return;
    }

    setLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: false,
            timeout: 12000,
            maximumAge: 60_000,
          }
        )
      );
      const { latitude: lat, longitude: lng } = pos.coords;
      setCoords({ lat, lng });

      const { pin, area } = await reverseGeocode(lat, lng);
      if (!pin) {
        setError("Couldn't detect your pincode. You can enter it manually.");
        return;
      }
      setPincode(pin);
      if (area) setAreaName(area);
      await validatePincode(pin);
    } catch (e: unknown) {
      const code = (e as { code?: number })?.code;
      const msg =
        code === 1
          ? "Location permission denied."
          : code === 2
          ? "Location unavailable."
          : code === 3
          ? "Location request timed out."
          : "Couldn't fetch your location.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Precise GPS (slower, more accurate)
  const fetchUserLocationPrecise = async (): Promise<void> => {
    setError(null);
    const isLocalhost =
      typeof window !== "undefined" &&
      (location.hostname === "localhost" || location.hostname === "127.0.0.1");
    if (typeof window !== "undefined" && !window.isSecureContext && !isLocalhost) {
      setError("Please use HTTPS to allow location access.");
      return;
    }
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation not supported on this device.");
      return;
    }

    setLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          }
        )
      );
      const { latitude: lat, longitude: lng } = pos.coords;
      setCoords({ lat, lng });

      const { pin, area } = await reverseGeocode(lat, lng);
      if (!pin) {
        setError("Couldn't detect your pincode. You can enter it manually.");
        return;
      }
      setPincode(pin);
      if (area) setAreaName(area);
      await validatePincode(pin);
    } catch {
      setError("Couldn't fetch precise location.");
    } finally {
      setLoading(false);
    }
  };

  // Warm cache (no auto GPS)
  useEffect(() => {
    try {
      const cached = loadCache();
      if (!cached) return;
      if (cached.pincode) setPincode(cached.pincode);
      if (cached.areaName) setAreaName(cached.areaName);
      if (cached.coords) setCoords(cached.coords);
      if (cached.result) {
        setLocationId(cached.result.location_id ?? null);
        setIsServiceable(
          typeof cached.result.is_serviceable === "boolean"
            ? cached.result.is_serviceable
            : null
        );
      }
    } catch {}
  }, []);

  return (
    <LocationContext.Provider
      value={{
        pincode,
        locationId,
        areaName,
        isServiceable,
        loading,
        error,
        coords,
        validatePincode,
        fetchUserLocation,
        fetchUserLocationPrecise,
        setPincode,
        setAreaName,
        setManualPincode,
        clearLocationCache,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
};
