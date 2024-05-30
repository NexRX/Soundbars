import { type JSXElement } from "solid-js";

export default function SetupLayout(props: { children: JSXElement }) {
  return (
    <div class="w-full h-full flex flex-row text-zinc-800 bg-zinc-100 dark:text-zinc-100 dark:bg-zinc-800 overflow-x-auto">
      <nav class="min-w-16 bg-zinc-900 text-left">nav</nav>
      <main class="w-full h-full">{props.children}</main>
    </div>
  );
}
