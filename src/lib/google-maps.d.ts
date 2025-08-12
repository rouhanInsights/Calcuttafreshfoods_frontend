// Ensures TS knows window.google exists after the script loads
export {};

declare global {
  interface Window {
    google: typeof google;
  }
}
