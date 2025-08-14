"use client";

import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, RefreshCw } from "lucide-react";
import { useGoogleMaps } from "@/lib/googleMaps";
import { toast } from "sonner";

export default function LocationStatusCard() {
  const {
    pincode,
    coords,
    isServiceable,
    loading,
    fetchUserLocationPrecise,
  } = useLocation();

  const [statusChecked, setStatusChecked] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // ✅ Use Google Maps types
  const mapInstance = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);

  const ready = useGoogleMaps(["places", "maps"]);

  useEffect(() => {
    if (pincode && isServiceable !== null) {
      setStatusChecked(true);
    }
  }, [pincode, isServiceable]);

  const handleRefresh = async () => {
    try {
      toast("Rechecking your location...");
      await fetchUserLocationPrecise();
      setStatusChecked(true);
    } catch {
      toast.error("Failed to fetch your location");
    }
  };

  useEffect(() => {
    if (!ready || !mapRef.current || !coords || typeof window === "undefined") return;

    const g = window.google;

    if (!mapInstance.current) {
      mapInstance.current = new g.maps.Map(mapRef.current, {
        center: coords,
        zoom: 15,
        streetViewControl: false,
        mapTypeControl: false,
      });
    }

    if (!marker.current) {
      marker.current = new g.maps.Marker({
        position: coords,
        map: mapInstance.current,
      });
    } else {
      marker.current.setPosition(coords);
      mapInstance.current.setCenter(coords);
    }
  }, [ready, coords]);

  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 text-sm font-medium">
          <MapPin className="w-5 h-5 text-[#8BAD2B]" />
          <span>Your Delivery PIN:</span>
          <span className="font-semibold text-[#8BAD2B]">{pincode || "Not detected"}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
          className="text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
              Detecting…
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Use My Location
            </>
          )}
        </Button>
      </div>

      {statusChecked ? (
        isServiceable ? (
          <p className="text-green-600 text-sm font-medium">
            ✅ We deliver to this PIN code.
          </p>
        ) : (
          <p className="text-red-600 text-sm font-medium">
            Looks like!! 🙁 we are not available at your location yet.
            {/* <span>🚚 just wait we will be there soon!</span> */}
          </p>
        )
      ) : (
        <p className="text-gray-500 text-sm">Checking serviceability...</p>
      )}

      {ready && coords && (
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: 300,
            borderRadius: "10px",
            border: "1px solid #eee",
          }}
        />
      )}
    </div>
  );
}
