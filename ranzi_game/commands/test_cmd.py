"""test command — run all test tiers or a specific tier."""
import sys
from pathlib import Path

from ranzi_game.result import Ok, Err, Result
from ranzi_game.runner import run_command


def _playwright_config_exists(project_root: Path) -> bool:
    return any(
        (project_root / name).exists()
        for name in ("playwright.config.ts", "playwright.config.js", "playwright.config.mjs")
    )


def _integration_tests_exist(project_root: Path) -> bool:
    """Return True if any *.integration.test.ts files exist under the project root."""
    return any(project_root.rglob("*.integration.test.ts"))


def _run_unit(project_root: Path) -> Result[None]:
    vitest_result = run_command(
        ["npx", "vitest", "run", "--exclude", "**/*.integration.test.ts"],
        cwd=project_root,
    )
    match vitest_result:
        case Err(message=msg, cause=cause):
            return Err(message=f"unit tier (vitest) failed: {msg}", cause=cause)
        case Ok(_):
            pass

    python_result = run_command(
        [sys.executable, "-m", "unittest", "discover", "tests/cli/"],
        cwd=project_root,
    )
    match python_result:
        case Err(message=msg, cause=cause):
            return Err(message=f"unit tier (python unittest) failed: {msg}", cause=cause)
        case Ok(_):
            return Ok(value=None)


def _run_integration(project_root: Path) -> Result[None]:
    if not _integration_tests_exist(project_root):
        print("[SKIP] Integration tests not configured")
        return Ok(value=None)
    result = run_command(
        ["npx", "vitest", "run", "**/*.integration.test.ts"],
        cwd=project_root,
    )
    match result:
        case Err(message=msg, cause=cause):
            return Err(message=f"integration tier failed: {msg}", cause=cause)
        case Ok(_):
            return Ok(value=None)


def _run_e2e(project_root: Path) -> Result[None]:
    if not _playwright_config_exists(project_root):
        print("[SKIP] E2E not configured")
        return Ok(value=None)
    result = run_command(["npx", "playwright", "test"], cwd=project_root)
    match result:
        case Err(message=msg, cause=cause):
            return Err(message=f"e2e tier failed: {msg}", cause=cause)
        case Ok(_):
            return Ok(value=None)


def execute(
    project_root: Path,
    unit: bool,
    integration: bool,
    e2e: bool,
) -> Result[None]:
    # If a specific flag is set, run only that tier
    if unit:
        return _run_unit(project_root)
    if integration:
        return _run_integration(project_root)
    if e2e:
        return _run_e2e(project_root)

    # No flags — run all tiers in order, fail fast
    unit_result = _run_unit(project_root)
    if isinstance(unit_result, Err):
        return unit_result

    integration_result = _run_integration(project_root)
    if isinstance(integration_result, Err):
        return integration_result

    return _run_e2e(project_root)
