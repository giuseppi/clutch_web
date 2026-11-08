import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// The first render runs now, before the load event, so a reload mid-page finds the page tall
// enough to restore its scroll position.
const root = createRoot(document.getElementById("root")!);
flushSync(() => root.render(<App />));
