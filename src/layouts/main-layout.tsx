import { type JSX, type JSXElement, splitProps, createSignal } from "solid-js";
import {
  RiDocumentStickyNoteFill,
  RiSystemMenuFoldFill,
  RiSystemMenuUnfoldFill,
  RiSystemInformationFill
} from "solid-icons/ri";
import { useNavigate } from "@solidjs/router";

export default function MainLayout(props: { children: JSXElement }) {
  const [navOpen, setNavOpen] = createSignal(true);
  const navigate = useNavigate();

  return (
    <div class="w-full h-full flex flex-row text-zinc-800 bg-zinc-100 dark:text-zinc-100 dark:bg-zinc-800 overflow-x-auto">
      <nav
        class="min-w-16 bg-zinc-900 text-left"
        classList={{
          "min-w-[120px] *:pl-4 [&>*:not(:first-child)]:justify-start":
            navOpen(),
        }}
      >
        <NavButton
          icon={
            navOpen() ? <RiSystemMenuFoldFill /> : <RiSystemMenuUnfoldFill />
          }
          icon-only={true}
          onclick={() => {
            setNavOpen((v) => !v);
            console.log(!navOpen());
          }}
          // class="mb-4"
        />
        <NavButton
          icon={<RiDocumentStickyNoteFill />}
          icon-only={!navOpen()}
          onclick={() => navigate("/")}
        >
          Notes
        </NavButton>
        <NavButton
          icon={<RINoteAddIcon />}
          icon-only={!navOpen()}
          onclick={() => navigate("/new/note")}
        >
          New Note
        </NavButton>
        <NavButton
          icon={<RiSystemInformationFill />}
          icon-only={!navOpen()}
          onclick={() => navigate("/about")}
        >
          About
        </NavButton>
      </nav>
      <main class="w-full h-full">{props.children}</main>
    </div>
  );
}

interface NavButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
  "icon-only": boolean;
}

function NavButton(props: NavButtonProps) {
  const [split, spread] = splitProps(props, [
    "children",
    "icon",
    "icon-only",
    "class",
    "classList",
  ]);
  return (
    <button
      class="w-full no-default hover:bg-[#ffc131] hover:text-zinc-800 active:shadow-xl active:shadow-orange-400/40 flex justify-center items-center gap-1 p-2 [&:not(:last-child)]:border-b border-slate-200/20"
      classList={{
        [split.class ?? ""]: !!split.class,
        "[&>*:not(:first-child)]:hidden text-2xl": split["icon-only"] === true,
        ...(split.classList ?? {}),
      }}
      {...spread}
    >
      {split.icon}
      <span>{split.children}</span>
    </button>
  );
}

function RINoteAddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      stroke-width="0"
      color="currentColor"
      fill="currentColor"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      style="overflow: visible;"
    >
      <path d="M4 1V4H1V6H4V9H6V6H9V4H6V1H4ZM11 5C11 8.31371 8.31371 11 5 11C4.29873 11 3.62556 10.8797 3 10.6586V20.0066C3 20.5551 3.44694 21 3.99826 21H14V15C14 14.45 14.45 14 15 14H21V3.9985C21 3.44749 20.5552 3 20.0066 3H10.6586C10.8797 3.62556 11 4.29873 11 5ZM21 16L16 20.997V16H21Z"></path>
    </svg>
  );
}
