pub mod logging;
pub mod note_window;
pub mod error;
pub mod setup;


#[tauri::command]
#[specta::specta]
pub fn get_max_dt() -> i64 {
    chrono::NaiveDateTime::MAX.and_utc().timestamp()
}