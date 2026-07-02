import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import "../cockpit/index.css";

const CockpitApp = lazy(() => import("../cockpit/App.jsx"));

export const Route = createFileRoute("/")({
  component: Index,
});

function Fallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--cream, #f5efe6)",
        color: "var(--ink-500, #6b6b6b)",
        fontFamily: "var(--font-display, system-ui)",
        fontWeight: 600,
      }}
    >
      Carico il cockpit…
    </div>
  );
}

function Index() {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <CockpitApp />
      </Suspense>
    </ClientOnly>
  );
}
