"""Subprocess runner — single mockable boundary for all shell calls."""
import subprocess
from pathlib import Path

from ranzi_game.result import Ok, Err, Result


def run_command(
    cmd: list[str],
    cwd: Path | None = None,
    capture_output: bool = False,
) -> Result[subprocess.CompletedProcess[str]]:
    try:
        completed = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=capture_output,
            text=True,
        )
        if completed.returncode != 0:
            return Err(
                message=(
                    f"Command {cmd[0]!r} exited with code {completed.returncode}: "
                    f"{completed.stderr.strip() or '(no stderr)'}"
                ),
            )
        return Ok(value=completed)
    except FileNotFoundError as e:
        return Err(
            message=f"Command {cmd[0]!r} not found — is it installed and on PATH?",
            cause=e,
        )
    except OSError as e:
        return Err(
            message=f"run_command({cmd!r}) OS error: {e}",
            cause=e,
        )
