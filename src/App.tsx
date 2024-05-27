import { Show, Suspense, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { Spinner, SpinnerType } from "solid-spinner";

import "./App.css";
import NotFound from "./routes/not-found";

export default function App() {
  return (
    <Router
      root={(props) => (
        <Suspense fallback={Loading()}>
          <>
            <DebugTools />
            {props.children}
          </>
        </Suspense>
      )}
    >
      <Route path="/" component={lazy(() => import("./routes/main"))} />
      <Route
        path="/note/:name"
        component={lazy(() => import("./routes/note"))}
      />
      <Route path="/new/note" component={lazy(() => import("./routes/new-note"))} />
      <Route path="/about" component={lazy(() => import("./routes/about"))} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

function Loading() {
  return (
    <div class="flex flex-col h-dvh w-dvw justify-center items-center align-middle relative">
      <h1 class="font-bold text-4xl text-cyan-400 drop-shadow-md">StickyNow</h1>
      <a href="https://tauri.app" target="_blank">
        <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
      </a>
      <Spinner
        type={SpinnerType.rings}
        color="orange"
        class="absolute max-w-96 max-h-96 h-full w-full -z-10"
      />
    </div>
  );
}

function DebugTools() {
  return (
    <Show when={false}>
      <div class="absolute right-1 top-1">hi</div>
    </Show>
  );
}
