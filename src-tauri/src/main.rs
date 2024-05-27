// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[macro_use]
extern crate tracing;

mod logic;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let invoke_handler = {
        let builder = tauri_specta::ts::builder().commands(tauri_specta::collect_commands![
            greet,
            logic::note_window::create_note_window
        ]);

        #[cfg(debug_assertions)] // <- Only export on non-release builds
        let builder = builder.path("../src/bindings.ts");

        builder
            .build()
            .expect("error while creating tauri bindings")
    };

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(invoke_handler)
        .build(tauri::generate_context!())
        .expect("error while creating tauri application");

    app.run(|_, _| {});
}

#[ctor::ctor]
fn setup() {
    logic::logging::setup_logging()
}
