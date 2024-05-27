import { useParams } from "@solidjs/router";

export default function Note() {
  const { name } = useParams();

  return (
    <div>
      <h1>{name}</h1>
      <a href="https://tauri.app" target="_blank">
        <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
      </a>
    </div>
  );
}
