import { createSignal } from "solid-js";
import logo from "../assets/logo.svg";
import { commands } from "../bindings";
import MainLayout from "../layouts/main-layout";

export default function Main() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  return (
    <MainLayout>
      <div class="text-base flex flex-col items-center justify-center h-full w-full text-center p-4 gap-2">
        <h1>Welcome to StickyNow!</h1>

        <div class="flex flex-row *:*:w-16 gap-6 py-6">
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo vite" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank">
            <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
          </a>
          <a href="https://solidjs.com" target="_blank">
            <img src={logo} class="logo solid" alt="Solid logo" />
          </a>
        </div>

        <p>This app was made namely made with the great technologies Tauri, Vite, and Solid! Click their logos to learn more.</p>

        <form
          class="row"
          onSubmit={(e) => {
            e.preventDefault();
            commands.greet(name()).then(setGreetMsg);
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>

        <p>{greetMsg()}</p>
      </div>
    </MainLayout>
  );
}
