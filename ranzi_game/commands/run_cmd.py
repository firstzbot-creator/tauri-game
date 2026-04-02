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


def tauri_config_for_game(project_root: Path, game: str) -> list[str]:
    if game == "default":
        return ["npx", "tauri", "dev"]
    config = project_root / "apps" / game / "tauri.conf.json"
    return ["npx", "tauri", "dev", "--config", str(config)]


def execute(project_root: Path, game: str | None) -> Result[None]:
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

    cmd = tauri_config_for_game(project_root, selected)
    result = run_command(cmd, cwd=project_root)
    match result:
        case Ok(_):
            return Ok(value=None)
        case Err(message=msg, cause=cause):
            return Err(message=f"Failed to launch {selected!r}: {msg}", cause=cause)
