import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    toast({
      title: "Update available",
      description: "Reload to see the latest gallery content.",
      action:
        updateSW &&
        (
          <ToastAction altText="Reload app" onClick={() => updateSW(true)}>
            Reload
          </ToastAction>
        ),
    });
  },
  onOfflineReady() {
    toast({
      title: "Offline ready",
      description: "You can now browse cached items without a connection.",
    });
  },
});

createRoot(document.getElementById("root")!).render(<App />);
