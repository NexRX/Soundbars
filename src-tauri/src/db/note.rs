use std::marker::PhantomData;

use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use welds::WeldsModel;

pub trait NoteState: Default {}
macro_rules! note_state {
    ($name:ident) => {
        #[derive(Default, specta::Type)]
        pub struct $name;
        impl NoteState for $name {}
    };
}

note_state!(Parsed);
note_state!(Unparsed);

#[derive(Debug, Default, WeldsModel, Serialize, Deserialize, specta::Type)]
#[welds(schema = "note", table = "note")]
pub struct Note<T: NoteState = Unparsed> {
    #[welds(primary_key)]
    pub label: String,
    pub title: String,
    pub content: String,
    pub created: NaiveDateTime,
    pub updated: NaiveDateTime,
    // Enable Properties
    pub archived: bool,
    pub binned: bool,
    // Display Properties
    pub style_base: String,
    pub style_custom: String,
    pub position_x: i32,
    pub position_y: i32,
    pub width: i32,
    pub height: i32,
    pub hide_utill: Option<NaiveDateTime>,
    pub hide_reason: Option<String>,
    pub hide_method: Option<NoteHideMethod>,
    // Non-DB
    #[welds(ignore)]
    state: PhantomData<T>,
}

#[derive(Clone, Debug, Default, Deserialize, PartialEq, Serialize, sqlx::Type, specta::Type)]
pub enum NoteHideMethod {
    #[default]
    Collapse,
    Invisible,
}

impl Note {
    pub fn parse_label(label: String) -> String {
        label
            .chars()
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
}

impl Note<Unparsed> {
    pub fn into_parsed(self) -> Note<Parsed> {
        Note::<Parsed> {
            label: Self::parse_label(self.label),
            title: self.title,
            content: self.content,
            created: self.created,
            updated: self.updated,
            archived: self.archived,
            binned: self.binned,
            style_base: self.style_base,
            style_custom: self.style_custom,
            position_x: self.position_x,
            position_y: self.position_y,
            width: self.width,
            height: self.height,
            hide_utill: self.hide_utill,
            hide_reason: self.hide_reason,
            hide_method: self.hide_method,
            state: PhantomData,
        }
    }
}
