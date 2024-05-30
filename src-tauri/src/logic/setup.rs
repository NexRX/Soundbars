

#[tauri::command]
#[specta::specta]
pub fn is_setup(_handle: tauri::AppHandle) -> bool {
    true
}