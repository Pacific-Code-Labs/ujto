import { createRoot } from "react-dom/client";
import App from "./App";
import { initContent } from "@/repositories/content.repository";
import { initBrand } from "@/services/seo.service";
import "./index.css";

// Published content first (bounded wait; the prerendered HTML stays visible meanwhile), then render.
void initContent().finally(() => {
  initBrand();
  createRoot(document.getElementById("root")!).render(<App />);
});
