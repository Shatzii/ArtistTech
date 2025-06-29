import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('PWA Service Worker registered successfully');
      })
      .catch((registrationError) => {
        console.log('PWA Service Worker registration failed:', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
