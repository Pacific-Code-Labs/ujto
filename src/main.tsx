import { createRoot } from "react-dom/client";
import App from "./App";
import { initContent, refreshContent } from "@/repositories/content.repository";
import { initBrand } from "@/services/seo.service";
import "./index.css";

// Render at once (last published copy seen, else the bundle), then refresh in the background
// and re-render only when the published content changed.
initContent();
initBrand();
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
void refreshContent().then((changed) => {
  if (!changed) return;
  initBrand();
  root.render(<App key="published" />);
});
