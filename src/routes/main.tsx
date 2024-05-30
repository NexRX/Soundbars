import { useNavigate } from "@solidjs/router";
import MainLayout from "../layouts/main-layout";
import { commands } from "../bindings";

export default function Main() {
  const navigate = useNavigate();
  commands.isSetup().then((setup) => (setup ? {} : navigate("/setup")));

  return (
    <MainLayout>
      <div class="text-base flex flex-col justify-start items-center p-4 w-full h-full">
        {/*  In future this button should create a new note instantly on the desktop and put it above all (temp) the label name should just be "New Note N" where N is a number that isnt taken in record */}
        <button class="absolute top-1 right-1">Quick Note</button>
        <h1>My Notes</h1>
        <p class="text-neutral-500 m-auto text-center">
          You have no notes yet, goto "New Note" in the nav menu or clicking
          "Quick Note".
        </p>
      </div>
    </MainLayout>
  );
}
