import MainLayout from "../layouts/main-layout";

export default function Main() {
  return (
    <MainLayout>
      <div class="text-base flex flex-col justify-start items-center p-4 w-full h-full">
        {/*  In future this button should create a new note instantly on the desktop and put it above all (temp) the label name should just be "New Note N" where N is a number that isnt taken in record */}
        <button class="absolute top-1 right-1">Quick Note</button>
        <h1>My Notes</h1>
      </div>
    </MainLayout>
  );
}
