import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import App from "./App";
import "./styles/site.css";
history.scrollRestoration = "manual";
if (!location.hash) window.scrollTo(0, 0);
document.fonts.ready.then(() =>
  document.documentElement.classList.add("fonts-ready"),
);
createRoot(document.getElementById("root")).render(<App />);
