"""Component detection and installation logic for `ranzi-game init`."""
from dataclasses import dataclass
from pathlib import Path

from ranzi_game.result import Ok, Err, Result
from ranzi_game.runner import run_command


@dataclass(frozen=True)
class Component:
    name: str
    check_cmd: list[str]
    install_cmd: list[str] | None  # None = manual install required
    install_note: str | None = None  # shown when install_cmd is None


COMPONENTS: list[Component] = [
    Component(
        name="node",
        check_cmd=["node", "--version"],
        install_cmd=None,
        install_note="Install Node.js 20+ from https://nodejs.org",
    ),
    Component(
        name="npm",
        check_cmd=["npm", "--version"],
        install_cmd=None,
        install_note="Bundled with Node.js — reinstall Node.js",
    ),
    Component(
        name="rustup",
        check_cmd=["rustup", "--version"],
        install_cmd=None,
        install_note="Install via https://rustup.rs",
    ),
    Component(
        name="cargo",
        check_cmd=["cargo", "--version"],
        install_cmd=None,
        install_note="Bundled with rustup — run: rustup install stable",
    ),
    Component(
        name="tauri-cli",
        check_cmd=["npx", "--yes", "@tauri-apps/cli", "--version"],
        install_cmd=["npm", "install", "-D", "@tauri-apps/cli"],
        install_note=None,
    ),
    Component(
        name="typescript",
        check_cmd=["npx", "--yes", "tsc", "--version"],
        install_cmd=["npm", "install", "-D", "typescript"],
        install_note=None,
    ),
]


def check_component(component: Component, project_root: Path) -> Result[str]:
    """Returns Ok(version_string) if present, Err if missing."""
    result = run_command(component.check_cmd, cwd=project_root, capture_output=True)
    match result:
        case Ok(value=completed):
            return Ok(value=completed.stdout.strip() or "(installed)")
        case Err() as err:
            return err


def install_component(component: Component, project_root: Path) -> Result[None]:
    """Attempt installation. Returns Err with message if impossible."""
    if component.install_cmd is None:
        note = component.install_note or f"Install {component.name} manually"
        return Err(message=f"{component.name}: {note}")
    result = run_command(component.install_cmd, cwd=project_root)
    match result:
        case Ok(_):
            return Ok(value=None)
        case Err(message=msg, cause=cause):
            return Err(
                message=f"install {component.name!r} failed: {msg}",
                cause=cause,
            )
