"use client";

import * as React from "react";

type LoaderOptions = {
  apiKey: string;
  libraries?: string[]; // e.g. ["places"]
  id?: string; // stable id on the script tag
};

// Minimal, safe shapes so we don't need `any`
type GoogleNamespace = { maps?: unknown };
type GoogleWindow = Window & { google?: GoogleNamespace };

let loadingPromise: Promise<void> | null = null;

export function useGoogleMapsLoader({
  apiKey,
  libraries = ["places"],
  id = "google-maps-script",
}: LoaderOptions) {
  const [ready, setReady] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean((window as GoogleWindow).google?.maps);
  });

  React.useEffect(() => {
    if (!apiKey) return;
    if (typeof window === "undefined") return;

    // If already there, mark ready
    if ((window as GoogleWindow).google?.maps) {
      setReady(true);
      return;
    }

    // If a tag with our id exists, hook to it
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      existing.addEventListener("error", () => setReady(false));
      return;
    }

    // Ensure only one concurrent load
    if (!loadingPromise) {
      loadingPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.id = id;
        script.async = true;
        script.defer = true;
        const libs = libraries.length ? `&libraries=${libraries.join(",")}` : "";
        // add loading=async per Google guidance
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${libs}&language=en&region=IN&loading=async`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
      });
    }

    loadingPromise
      .then(() => setReady(true))
      .catch(() => setReady(false));
  }, [apiKey, libraries, id]);

  return ready;
}
