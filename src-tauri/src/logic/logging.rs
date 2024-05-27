use core::fmt;

use tracing::{Event, Level, Subscriber};
use tracing_subscriber::{
    fmt::{format, FmtContext, FormatEvent, FormatFields, FormattedFields},
    registry::LookupSpan,
};

struct CustomFormat;

impl<S, N> FormatEvent<S, N> for CustomFormat
where
    S: Subscriber + for<'a> LookupSpan<'a>,
    N: for<'a> FormatFields<'a> + 'static,
{
    fn format_event(
        &self,
        ctx: &FmtContext<'_, S, N>,
        mut writer: format::Writer<'_>,
        event: &Event<'_>,
    ) -> fmt::Result {
        use colored::Colorize;

        // Format values from the event's's metadata:
        let metadata = event.metadata();

        let colored_level = match *metadata.level() {
            Level::TRACE => Level::TRACE.to_string().dimmed().bold(),
            Level::DEBUG => Level::DEBUG.to_string().blue().bold(),
            Level::INFO => Level::INFO.to_string().green().bold(),
            Level::WARN => Level::WARN.to_string().yellow().bold(),
            Level::ERROR => Level::ERROR.to_string().red().bold(),
        };

        let now = chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Micros, true);

        write!(
            &mut writer,
            "[{}][{}][{}{}]: ",
            now.dimmed(),
            colored_level,
            metadata.target().cyan().underline(),
            metadata
                .line()
                .map_or_else(|| String::from("::_"), |v| format!(":{v}"))
                .cyan()
                .underline()
        )?;

        // Format all the spans in the event's span context.
        if let Some(scope) = ctx.event_scope() {
            for span in scope.from_root() {
                write!(writer, "{}", span.name())?;

                // `FormattedFields` is a formatted representation of the span's
                // fields, which is stored in its extensions by the `fmt` layer's
                // `new_span` method. The fields will have been formatted
                // by the same field formatter that's provided to the event
                // formatter in the `FmtContext`.
                let ext = span.extensions();
                let fields = &ext
                    .get::<FormattedFields<N>>()
                    .expect("will never be `None`");

                // Skip formatting the fields if the span had no fields.
                if !fields.is_empty() {
                    write!(writer, "{{{}}}", fields)?;
                }
                write!(writer, ": ")?;
            }
        }

        // Write fields on the event
        ctx.field_format().format_fields(writer.by_ref(), event)?;

        writeln!(writer)
    }
}

pub fn setup_logging() {
    use std::str::FromStr;
    use tracing::metadata::LevelFilter;
    use tracing_subscriber::{filter::Directive, EnvFilter};

    println!("🪵 Setting up logging...");
    macro_rules! create_directive {
        ($target:expr, $level:expr) => {
            Directive::from_str(&format!("{}={}", $target, $level))
                .expect("All logging directives must be valid")
        };
    }

    let self_logs = create_directive!(env!("CARGO_PKG_NAME"), LevelFilter::DEBUG);

    let filter = EnvFilter::builder()
        .with_default_directive(LevelFilter::ERROR.into())
        .parse("")
        .expect("Login setup must be valid")
        .add_directive(self_logs);

    tracing_subscriber::fmt()
        .with_env_filter(filter)
        .event_format(CustomFormat)
        .init();
}
