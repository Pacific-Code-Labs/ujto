import { createRoot } from "react-dom/client";
import App from "./App";
import { initBrand } from "@/services/seo.service";
import "./index.css";

initBrand();

createRoot(document.getElementById("root")!).render(<App />);
