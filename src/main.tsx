import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { initGA } from "@/lib/analytics";
import { AppProvider } from "@/providers/AppProvider";
import { router } from "@/router";

import "./index.css";

initGA();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
