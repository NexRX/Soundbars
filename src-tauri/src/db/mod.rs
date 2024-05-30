pub mod note;

use crate::logic::error::{app_internal_error, internal_message};
use dirs_2::data_dir;
use human_errors::{system, system_with_internal};
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};
use std::{path::PathBuf, sync::OnceLock};
use tauri_plugin_sql::Migration;

static DB: OnceLock<Pool<Sqlite>> = OnceLock::new();

pub fn get_db_path() -> Result<String, human_errors::Error> {
    let mut db_path = PathBuf::from("sqlite://");
    db_path.push(data_dir().ok_or_else(|| {
        system(
            "We could not find your users data directory for storing things",
            "Try setting the $XDG_DATA_HOME or $HOME variable from a terminal.",
        )
    })?);

    db_path.push("/database.db");
    let db_path = db_path
        .to_str()
        .ok_or_else(|| app_internal_error!("Couldn't obtain a path reference to the database"))?;

    Ok(db_path.to_owned())
}

async fn get_db_connection() -> Result<Pool<Sqlite>, human_errors::Error> {
    let db_path = get_db_path()?;

    SqlitePoolOptions::new()
        .max_connections(10)
        .connect(&db_path)
        .await
        .map_err(|err| {
            system_with_internal(
                "Couldn't connect to the database",
                &format!("Try restarting the app or ensuring you have access to `{db_path}`"),
                err,
            )
        })
}

fn get_db_connection_sync() -> Result<Pool<sqlx::Sqlite>, human_errors::Error> {
    tauri::async_runtime::handle().block_on(get_db_connection())
}

fn init_database() -> sqlx::Pool<sqlx::Sqlite> {
    get_db_connection_sync().expect(&internal_message!(
        "Could not create a connection to the databse on request"
    ))
}

pub fn database() -> &'static sqlx::Pool<sqlx::Sqlite> {
    DB.get_or_init(init_database)
}

pub fn get_migrations() -> Vec<tauri_plugin_sql::Migration> {
    use tauri_plugin_sql::MigrationKind;
    const MIGATIONS: include_dir::Dir<'_> = include_dir::include_dir!("migrations");

    MIGATIONS
        .files()
        .map(|v| {
            let name = v
                .path()
                .file_name()
                .expect("Bad or missing filename in migrations")
                .to_str()
                .unwrap();

            let split = name.split('.').collect::<Vec<_>>();

            let (version, description) = split[0].split_at(
                split[0]
                    .find('_')
                    .expect("Missing character '_' in migration"),
            );

            Migration {
                version: version
                    .parse()
                    .expect("migration didn't start with a number"),
                description,
                kind: match split[1] {
                    "up" => MigrationKind::Up,
                    "down" => MigrationKind::Down,
                    _ => unreachable!("Bad migration type"),
                },
                sql: v
                    .contents_utf8()
                    .expect("Failed to create migration from file"),
            }
        })
        .collect()
}
