"""run command — auto-discover games and launch via tauri dev."""
from pathlib import Path

from ranzi_game.result import Ok, Err, Result
from ranzi_game.runner import run_command


def discover_games(project_root: Path) -> list[str]:
    """Find game directories in apps/ or return ['default'] for root mode."""
    apps_dir = project_root / "apps"
    if not apps_dir.exists():
        return ["default"]
    games = sorted(
        d.name for d in apps_dir.iterdir()
        if d.is_dir() and not d.name.startswith(".")
    )
    return games if games else ["default"]


def _tauri_project_exists(project_root: Path) -> bool:
    """Return True if any tauri.conf.json / tauri.conf.json5 / Tauri.toml exists."""
    config_names = ("tauri.conf.json", "tauri.conf.json5", "Tauri.toml")
    return any(
        conf_file
        for name in config_names
        for conf_file in project_root.rglob(name)
    )


def tauri_config_for_game(project_root: Path, game: str) -> list[str]:
    if game == "default":
        return ["npx", "tauri", "dev"]
    
    app_root = project_root / "apps" / game
    config = app_root / "tauri.conf.json"
    if not config.exists():
        # Try src-tauri subdirectory
        src_tauri_config = app_root / "src-tauri" / "tauri.conf.json"
        if src_tauri_config.exists():
            config = src_tauri_config
            
    return ["npx", "tauri", "dev", "--config", str(config)]




def execute(project_root: Path, game: str | None) -> Result[None]:
    if not _tauri_project_exists(project_root):
        return Err(
            message=(
                "No Tauri project found. "
                "Expected a tauri.conf.json, tauri.conf.json5, or Tauri.toml in a subfolder."
            )
        )

    games = discover_games(project_root)

    if game is not None:
        if game not in games:
            valid = ", ".join(games)
            return Err(message=f"Unknown game {game!r}. Valid games: {valid}")
        selected = game
    elif len(games) == 1:
        selected = games[0]
    else:
        print("Available games:")
        for i, name in enumerate(games, start=1):
            print(f"  {i}. {name}")
        raw = input("Select a game (number): ").strip()
        try:
            idx = int(raw) - 1
            if idx < 0 or idx >= len(games):
                return Err(message=f"Invalid selection {raw!r}. Enter a number 1–{len(games)}.")
            selected = games[idx]
        except ValueError:
            return Err(message=f"Invalid selection {raw!r}. Enter a number.")

    app_root = project_root / "apps" / selected
    cmd = tauri_config_for_game(project_root, selected)
    result = run_command(cmd, cwd=app_root)
    match result:
        case Ok(_):
            return Ok(value=None)
        case Err(message=msg, cause=cause):
            return Err(message=f"Failed to launch {selected!r}: {msg}", cause=cause)

