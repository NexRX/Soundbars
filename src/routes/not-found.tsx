// import "../App.css";
import { useLocation } from "@solidjs/router"

export default function NotFound() {
  const location = useLocation();
  return (
    <div class="flex flex-col items-center align-middle justify-center h-dvh w-dvw">
      <h1 class="text-2xl font-bold">Tauri didn't find that app page!</h1>

      <div class="row">
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
      </div>

      <div>
        Your app location is `{location.pathname}`
      </div>
    </div>
  );
}
