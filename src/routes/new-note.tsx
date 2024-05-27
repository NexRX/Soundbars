import MainLayout from "../layouts/main-layout";
import { commands } from "../bindings";
import { createStore } from "solid-js/store";
import { match, P } from "ts-pattern";
import * as v from "valibot";
import { ErrorBoundary, Show } from "solid-js";

const NoteSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty("Please give your note a name."),
    v.maxLength(300, "Note names must be less than 300 characters")
  ),
  color: v.pipe(v.string(), v.nonEmpty("Please style your note with a color.")),
  content: v.string(),
});

type Note = v.InferOutput<typeof NoteSchema>;
type NoteDraft = Partial<Note>;
type NoteProblems = { general?: string } & NoteDraft;

export default function NewNote() {
  const [draft, setDraft] = createStore<NoteDraft>({});
  const [problems, setProblems] = createStore<NoteProblems>({});

  return (
    <MainLayout>
      <div class="m-auto min-w-[460px] w-[575px] max-w-full h-full flex flex-col justify-start items-center p-4 gap-6">
        <h1>New note</h1>
        <ErrorBoundary
          fallback={(err, reset) => (
            <div onClick={reset}>Error: {err.toString()}</div>
          )}
        >
          <Show when={problems.general}>
            {(msg) => <Problem message={msg()} />}
          </Show>
          <NoteField
            key="name"
            description="This will be the name that is displayed in menus and windows"
            placeholder="My Note"
            error={problems.name}
          />
          <NoteField
            key="color"
            description="Pick a base colour theme your sticky note around"
            placeholder="#FFFFFF"
          />
          <div class="w-full">
            <textarea
              name="content"
              class="w-full min-h-32"
              placeholder="Your note here. You can change this later..."
              onInput={(v) => setDraft("content", v.currentTarget.value)}
            />
            <Show when={problems.content}>
              {(msg) => <Problem message={msg()} />}
            </Show>
          </div>
          <button
            onClick={() => {
              setProblems({});
              const result = v.safeParse(NoteSchema, draft);

              if (!result.success) {
                console.debug("Invalidated note draft", result.issues);

                result.issues.forEach((issue) => {
                  match(issue.path?.[0])
                    .with(
                      { key: P.union("name", "color", "content") },
                      (path) => setProblems(path.key, issue.message)
                    )
                    .otherwise(() => {
                      if (problems.general) return;
                      setProblems("general", issue.message);
                    });
                });

                return;
              }

              commands.createNoteWindow(result.output);
            }}
          >
            Create
          </button>
        </ErrorBoundary>
      </div>
    </MainLayout>
  );

  function NoteField(props: {
    key: keyof Note;
    description: string;
    placeholder: string;
    error?: string;
  }) {
    return (
      <div class="border-b pb-3 border-neutral-500/30">
        <div class="w-full flex justify-between items-center align-middle gap-9">
          <label for={`field-${props.key}`}>
            <b>{capitalize(props.key)}</b>
            <p class="text-sm text-neutral-500 italic pt-2">
              {props.description}
            </p>
          </label>

          <input
            id={`field-${props.key}`}
            name={props.key}
            type="text"
            placeholder={props.placeholder}
            autocomplete="off"
            onInput={(v) => setDraft(props.key, v.currentTarget.value)}
          />
        </div>
        <Show when={problems[props.key]}>
          {(msg) => <Problem message={msg()} />}
        </Show>
      </div>
    );
  }
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Problem(props: { message: string }) {
  return (
    <div class="px-2 py-[2px] bg-red-700/80 rounded-md w-full mt-2">
      {props.message}
    </div>
  );
}
