import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const root = ReactDOM.createRoot(document.getElementById("root"));

if (convexUrl) {
  const convex = new ConvexReactClient(convexUrl);

  root.render(
    <React.StrictMode>
      <ConvexProvider client={convex}>
        <App convexReady />
      </ConvexProvider>
    </React.StrictMode>,
  );
} else {
  root.render(
    <React.StrictMode>
      <App convexReady={false} />
    </React.StrictMode>,
  );
}
