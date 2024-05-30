use serde::Serialize;
use serde::Deserialize;
use crate::db::note::Note;
use crate::logic::error::error_msg;

#[tauri::command]
#[specta::specta]
pub async fn create_note_window(handle: tauri::AppHandle, note: Note) -> Result<(), String> {
    // let label = alphanumeric_label(&note.name);
    // let path = format!("note/{label}");
    // debug!(name = note.name, label, "Creating a new sticky note window");

    // let window =
    //     tauri::WebviewWindowBuilder::new(&handle, format!("note-{label}"), tauri::WebviewUrl::App(path.into()))
    //         .transparent(true)
    //         .build()
    //         .map_err(error_msg!("error while creating sticky note window"))?;

    // window
    //     .set_title(&format!("Note {}", note.name))
    //     .map_err(error_msg!("error while setting sticky note window's title"))?;

    // window
    //     .set_decorations(false)
    //     .map_err(error_msg!("error while setting sticky note as undecorated"))?;

    Ok(())
}

#[inline]
fn alphanumeric_label(name: &str) -> String {
    name.chars()
        .map(|c| {
            if c.is_alphanumeric() || matches!(c, '-' | '_') {
                c.to_string()
            } else if c == ' ' {
                '_'.to_string()
            } else {
                let code = c as u32;
                format!("-u{code}-")
            }
        })
        .collect()
}
