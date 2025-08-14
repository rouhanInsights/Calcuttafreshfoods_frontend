// lib/googleMaps.ts
"use client";
import { useEffect, useState } from "react";
import { Library, Loader } from "@googlemaps/js-api-loader";
// use a module-level constant so the default array is STABLE across renders
export const DEFAULT_LIBS = ["places"] as const;

let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(libraries: ReadonlyArray<string> = DEFAULT_LIBS) {
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
      return;
    }

    // Already available?
    if (window.google?.maps) {
      resolve(window.google);
      return;
    }

    const id = "gmaps-js";
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    const libsParam = libraries.length
      ? `&libraries=${Array.from(libraries).join(",")}`
      : "";
    // add loading=async to follow Google’s guidance
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}${libsParam}&language=en&region=IN&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return loaderPromise;
}

export function useGoogleMaps(libraries: string[] = []) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: libraries as Library[], // ✅ Fix: Type assertion
    });

    loader
      .load()
      .then(() => setReady(true))
      .catch((err) => {
        console.error("Google Maps failed to load", err);
        setReady(false);
      });
  }, [libraries]);

  return ready;
}
