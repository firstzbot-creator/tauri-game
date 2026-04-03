// Prevents additional console window on Windows in release, do not remove!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct CatState {
    position: Position,
    equipped_hat: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Position {
    x: i32,
    y: i32,
}


struct AppStore(Mutex<HashMap<String, CatState>>);


#[tauri::command]
fn save_game_state(
    game_id: String,
    state: CatState,
    app_store: State<'_, AppStore>,
) -> Result<(), String> {
    let mut store = app_store.0.lock().unwrap();
    store.insert(game_id, state);
    Ok(())
}

#[tauri::command]
fn load_game_state(
    game_id: String,
    app_store: State<'_, AppStore>,
) -> Result<CatState, String> {
    let store = app_store.0.lock().unwrap();
    match store.get(&game_id) {
        Some(state) => Ok(state.clone()),
        None => Err(format!("State not found for game_id: {}", game_id)),
    }
}



fn main() {
    tauri::Builder::default()
        .manage(AppStore(Mutex::new(HashMap::new())))
        .invoke_handler(tauri::generate_handler![
            save_game_state,
            load_game_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
