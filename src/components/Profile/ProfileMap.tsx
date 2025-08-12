"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/context/LocationContext";
import { useGoogleMaps } from "@/lib/googleMaps";

// ---------- minimal local types ----------
type LatLng = { lat: number; lng: number };
type MapMouseEvent = { latLng: { lat: () => number; lng: () => number } };

type MapOptions = {
  center: LatLng;
  zoom: number;
  streetViewControl?: boolean;
  mapTypeControl?: boolean;
  mapId?: string;
};
type MapInstance = {
  setCenter: (pos: LatLng) => void;
  setZoom: (z: number) => void;
  addListener: (ev: "click", handler: (e: MapMouseEvent) => void) => void;
};

type ClassicMarker = {
  setPosition: (pos: LatLng) => void;
  addListener: (ev: "dragend", handler: (e: MapMouseEvent) => void) => void;
};
type AdvancedMarker = {
  position: LatLng;
  addListener: (ev: "dragend", handler: (e: MapMouseEvent) => void) => void;
};
type MarkerLike = ClassicMarker | AdvancedMarker;

type MapsModule = {
  Map: new (div: HTMLElement, opts: MapOptions) => MapInstance;
  Marker: new (opts: { map: MapInstance | null; position: LatLng; draggable?: boolean }) => ClassicMarker;
};
type MarkerModule = {
  AdvancedMarkerElement: new (opts: {
    map: MapInstance | null;
    position: LatLng;
    gmpDraggable?: boolean;
  }) => AdvancedMarker;
};

type GoogleWindow = Window & {
  google?: {
    maps?: {
      importLibrary: (name: "maps" | "marker") => Promise<unknown>;
      Marker?: MapsModule["Marker"];
    };
  };
};
// ----------------------------------------

type Address = {
  address_id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  floor_no?: string;
  landmark?: string;
};

const KOLKATA: LatLng = { lat: 22.5726, lng: 88.3639 };

function joinAddress(a: Address) {
  return [a.address_line1, a.address_line2, a.landmark, a.city, a.state, a.pincode, "India"]
    .filter(Boolean)
    .join(", ");
}

async function checkPin(pin: string) {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
  if (!base) return { is_serviceable: null as boolean | null };
  try {
    const res = await fetch(`${base}/api/location/validate/${pin}`);
    if (!res.ok) return { is_serviceable: null };
    const data = await res.json();
    return { is_serviceable: Boolean(data?.is_serviceable) };
  } catch {
    return { is_serviceable: null };
  }
}

type GeocodeComponent = { long_name: string; types: string[] };
type GeocodeResult = {
  geometry?: { location: LatLng };
  address_components?: GeocodeComponent[];
};
type GeocodeResponse = { status: string; results?: GeocodeResult[] };

function isAdvanced(m: MarkerLike): m is AdvancedMarker {
  return "position" in m;
}
function isClassic(m: MarkerLike): m is ClassicMarker {
  return "setPosition" in m;
}

export default function ProfileLocationMap() {
  const mapDivRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<MapInstance | null>(null);
  const markerRef = React.useRef<MarkerLike | null>(null);

  const ready = useGoogleMaps(["places"]);
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || undefined; // optional

  // only used when user explicitly clicks “Use my current location”
  const { fetchUserLocationPrecise } = useLocation();

  const [defaultAddr, setDefaultAddr] = React.useState<Address | null>(null);
  const [loadingAddr, setLoadingAddr] = React.useState(true);
  const [pinStatus, setPinStatus] = React.useState<"unknown" | "yes" | "no">("unknown");

  // place marker using Advanced Marker when mapId exists; else classic Marker
  const reverseGeocodeAndCheck = React.useCallback(async (lat: number, lng: number) => {
    try {
      const u = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&region=in&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      const r = await fetch(u);
      const data: GeocodeResponse = await r.json();
      if (data.status !== "OK" || !data.results?.length) return;

      const best =
        data.results.find((res) =>
          (res.address_components || []).some((c) => c.types?.includes("postal_code"))
        ) || data.results[0];

      const pin =
        (best.address_components || []).find((c) => c.types?.includes("postal_code"))
          ?.long_name || "";

      if (!pin) {
        setPinStatus("unknown");
        return;
      }
      const res = await checkPin(pin);
      setPinStatus(res.is_serviceable === null ? "unknown" : res.is_serviceable ? "yes" : "no");
    } catch {
      setPinStatus("unknown");
    }
  }, []);

  const placeOrMoveMarker = React.useCallback(
    async (pos: LatLng) => {
      const g = (window as GoogleWindow).google;
      if (!mapRef.current || !g?.maps) return;

      if (markerRef.current) {
        if (isAdvanced(markerRef.current)) {
          markerRef.current.position = pos;
        } else if (isClassic(markerRef.current)) {
          markerRef.current.setPosition(pos);
        }
        return;
      }

      if (mapId) {
        const markerLib = (await g.maps.importLibrary("marker")) as unknown as MarkerModule;
        const { AdvancedMarkerElement } = markerLib;
        const adv = new AdvancedMarkerElement({
          map: mapRef.current,
          position: pos,
          gmpDraggable: true,
        });
        adv.addListener("dragend", async (ev: MapMouseEvent) => {
          const p = { lat: ev.latLng.lat(), lng: ev.latLng.lng() };
          await reverseGeocodeAndCheck(p.lat, p.lng);
        });
        markerRef.current = adv;
      } else {
        // classic Marker fallback – no Map ID required
        const mapsLib = (await g.maps.importLibrary("maps")) as unknown as MapsModule;
        const classic = new mapsLib.Marker({
          map: mapRef.current,
          position: pos,
          draggable: true,
        });
        classic.addListener("dragend", async (ev: MapMouseEvent) => {
          const p = { lat: ev.latLng.lat(), lng: ev.latLng.lng() };
          await reverseGeocodeAndCheck(p.lat, p.lng);
        });
        markerRef.current = classic;
      }
    },
    [mapId, reverseGeocodeAndCheck]
  );

  // init map once
  React.useEffect(() => {
    if (!ready || !mapDivRef.current || mapRef.current) return;

    (async () => {
      const g = (window as GoogleWindow).google;
      if (!g?.maps) return;

      const mapsLib = (await g.maps.importLibrary("maps")) as unknown as MapsModule;
      const { Map } = mapsLib;
      const el = mapDivRef.current!; // non-null (we checked above)
      const map = new Map(el, {
        center: KOLKATA,
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: false,
        ...(mapId ? { mapId } : {}),
      });
      mapRef.current = map;

      // click to place/move marker
      map.addListener("click", async (e: MapMouseEvent) => {
        const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        await placeOrMoveMarker(pos);
        await reverseGeocodeAndCheck(pos.lat, pos.lng);
      });
    })();
  }, [ready, mapId, placeOrMoveMarker, reverseGeocodeAndCheck]);

  // load default address and center map – no global writes to LocationContext
  React.useEffect(() => {
    if (!ready) return;

    (async () => {
      setLoadingAddr(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/addresses`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const list: Address[] = await res.json();
        const def = (list || []).find((a) => a.is_default) || null;
        setDefaultAddr(def);

        if (!mapRef.current) return;

        if (def) {
          const u = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            joinAddress(def)
          )}&region=in&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
          const r = await fetch(u);
          const data: GeocodeResponse = await r.json();
          if (data.status === "OK" && data.results?.length) {
            const best = data.results[0] as GeocodeResult;
            const loc = best.geometry?.location;
            if (loc) {
              mapRef.current.setCenter(loc);
              mapRef.current.setZoom(16);
              await placeOrMoveMarker(loc);

              const pin =
                (best.address_components || []).find((c) =>
                  (c.types || []).includes("postal_code")
                )?.long_name || "";
              if (pin) {
                const resp = await checkPin(pin);
                setPinStatus(resp.is_serviceable === null ? "unknown" : resp.is_serviceable ? "yes" : "no");
              }
              return;
            }
          }
        }

        // fallback center
        mapRef.current.setCenter(KOLKATA);
        mapRef.current.setZoom(12);
        await placeOrMoveMarker(KOLKATA);
        setPinStatus("unknown");
      } catch {
        if (mapRef.current) {
          mapRef.current.setCenter(KOLKATA);
          mapRef.current.setZoom(12);
          await placeOrMoveMarker(KOLKATA);
        }
        setPinStatus("unknown");
      } finally {
        setLoadingAddr(false);
      }
    })();
  }, [ready, placeOrMoveMarker]);

  async function centerOnDefault() {
    if (!defaultAddr || !mapRef.current) return;
    const u = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      joinAddress(defaultAddr)
    )}&region=in&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const r = await fetch(u);
    const data: GeocodeResponse = await r.json();
    if (data.status !== "OK" || !data.results?.length) return;
    const loc = data.results[0]?.geometry?.location;
    if (!loc) return;
    mapRef.current.setCenter(loc);
    mapRef.current.setZoom(16);
    await placeOrMoveMarker(loc);

    const pin =
      (data.results[0]?.address_components || []).find((c) =>
        (c.types || []).includes("postal_code")
      )?.long_name || "";
    if (pin) {
      const resp = await checkPin(pin);
      setPinStatus(resp.is_serviceable === null ? "unknown" : resp.is_serviceable ? "yes" : "no");
    }
  }

  async function useMyLocation() {
    try {
      await fetchUserLocationPrecise(); // calls into your context
      await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        })
      ).then(async (pos) => {
        const loc: LatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!mapRef.current) return;
        mapRef.current.setCenter(loc);
        mapRef.current.setZoom(16);
        await placeOrMoveMarker(loc);
        await reverseGeocodeAndCheck(loc.lat, loc.lng);
      });
    } catch {
      /* context will handle user feedback */
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 border-b">
        <div className="text-sm">
          {loadingAddr ? (
            <span className="text-gray-500">Loading default address…</span>
          ) : defaultAddr ? (
            <>
              Default PIN <span className="font-medium">{defaultAddr.pincode}</span> •{" "}
              {pinStatus === "unknown" ? (
                <span className="text-gray-600">checking…</span>
              ) : pinStatus === "yes" ? (
                <span className="text-green-600">serviceable</span>
              ) : (
                <span className="text-red-600">not serviceable</span>
              )}
            </>
          ) : (
            <span className="text-gray-600">
              No default address set. Pick on the map or use current location.
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={useMyLocation}>
            Use my current location
          </Button>
          <Button variant="outline" onClick={centerOnDefault} disabled={!defaultAddr}>
            Center on default
          </Button>
        </div>
      </div>

      {!ready ? (
        <div className="p-4 text-sm">Loading map…</div>
      ) : (
        <div ref={mapDivRef} style={{ width: "100%", height: 380 }} />
      )}
    </div>
  );
}
