use human_errors::{detailed_message, system_with_internal};

pub fn app_error(internal_message: &str) -> human_errors::Error {
    system_with_internal(
        "An application error occured",
        "Please raise an issue on github at https://github.com/NexRX/StickyNow/issues for support in getting this fixed",
        detailed_message(internal_message)
    )
}

macro_rules! internal_message {
    ($msg:literal) => {
        format!("{}:{}: {}", std::module_path!(), std::line!(), $msg)
    };
}
pub(crate) use internal_message;

macro_rules! app_internal_error {
    ($msg:literal) => {
        crate::logic::error::app_error(&crate::logic::error::internal_message!($msg))
    };
}
pub(crate) use app_internal_error;

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