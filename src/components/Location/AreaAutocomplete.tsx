"use client";

import React from "react";
import { useLocation } from "@/context/LocationContext";
import { Loader2, MapPin } from "lucide-react";
import { useGoogleMaps } from "@/lib/googleMaps";

function extractArea(
  components: google.maps.GeocoderAddressComponent[]
): string | null {
  const pickOrder = [
    "sublocality_level_2",
    "sublocality_level_1",
    "sublocality",
    "neighborhood",
    "administrative_area_level_5",
    "administrative_area_level_4",
    "administrative_area_level_3",
    "locality",
    "postal_town",
  ];
  const map: Record<string, string> = {};
  components.forEach((c) =>
    (c.types || []).forEach((t) => {
      if (!map[t]) map[t] = c.long_name;
    })
  );
  for (const k of pickOrder) if (map[k]) return map[k];
  return map["administrative_area_level_2"] || map["locality"] || null;
}

export default function AreaAutocomplete({
  placeholder = "Enter area, apartment or pincode…",
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { validatePincode, setAreaName } = useLocation();

  // ✅ single global loader (no duplicate scripts)
  const ready = useGoogleMaps(["places", "maps"])

  React.useEffect(() => {
    if (!ready || !inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["address_components", "name"],
        componentRestrictions: { country: "in" },
        types: ["geocode"],
      }
    );

    const handler = () => {
      const place = autocomplete.getPlace();
      const comps =
        (place.address_components ||
          []) as google.maps.GeocoderAddressComponent[];
      const pin =
        comps.find((c) => c.types.includes("postal_code"))?.long_name || "";
      const area = extractArea(comps) || place.name || "";

      if (area) setAreaName(area);
      if (pin) validatePincode(pin);
    };

    autocomplete.addListener("place_changed", handler);
    return () => {
      window.google?.maps?.event?.clearInstanceListeners(autocomplete);
    };
  }, [ready, setAreaName, validatePincode]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          aria-label="Enter area or pincode"
        />
        {!ready && (
          <span className="absolute right-2 top-2.5 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </span>
        )}
      </div>
      <MapPin className="w-4 h-4 text-green-600 shrink-0" />
    </div>
  );
}
