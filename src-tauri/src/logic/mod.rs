pub mod logging;
pub mod note_window;

macro_rules! error_msg {
    ($msg:literal) => {
        |error| {
            const MSG: &str = $msg;
            error!(?error, "{MSG}");
            MSG
        }
    };
}
pub(crate) use error_msg;