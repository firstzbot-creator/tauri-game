"""Unit tests for ranzi_game.commands.test_cmd."""
import subprocess
import unittest
from pathlib import Path
from unittest.mock import MagicMock, call, patch

from ranzi_game.result import Ok, Err


def _ok_process(cmd: list[str]) -> Ok[subprocess.CompletedProcess[str]]:
    return Ok(
        value=subprocess.CompletedProcess(args=cmd, returncode=0, stdout="", stderr="")
    )


def _err_process(cmd: list[str], msg: str) -> Err:
    return Err(message=msg)


class TestTestCmdAllTiers(unittest.TestCase):
    def test_no_flags_runs_unit_integration_e2e_in_order(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")
        calls: list[str] = []

        def fake_run(cmd: list[str], **kwargs: object) -> Ok[subprocess.CompletedProcess[str]]:
            calls.append(" ".join(cmd))
            return _ok_process(cmd)

        with (
            patch("ranzi_game.commands.test_cmd.run_command", side_effect=fake_run),
            patch("ranzi_game.commands.test_cmd._playwright_config_exists", return_value=True),
            patch("ranzi_game.commands.test_cmd._integration_tests_exist", return_value=True),
        ):
            result = execute(project_root=root, unit=False, integration=False, e2e=False)

        self.assertIsInstance(result, Ok)
        # unit tier must appear before integration, integration before e2e
        # unit vitest uses --exclude; integration vitest uses **/*.integration.test.ts positionally
        unit_idx = next(i for i, c in enumerate(calls) if "vitest" in c and "--exclude" in c)
        integration_idx = next(i for i, c in enumerate(calls) if "**/*.integration.test.ts" in c and "--exclude" not in c)
        e2e_idx = next(i for i, c in enumerate(calls) if "playwright" in c)
        self.assertLess(unit_idx, integration_idx)
        self.assertLess(integration_idx, e2e_idx)

    def test_no_flags_fails_fast_on_unit_tier_failure(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")
        call_count = 0

        def fake_run(cmd: list[str], **kwargs: object) -> Err | Ok[subprocess.CompletedProcess[str]]:
            nonlocal call_count
            call_count += 1
            if "vitest" in cmd:
                return _err_process(cmd, "unit tests failed")
            return _ok_process(cmd)

        with patch("ranzi_game.commands.test_cmd.run_command", side_effect=fake_run):
            result = execute(project_root=root, unit=False, integration=False, e2e=False)

        self.assertIsInstance(result, Err)
        self.assertIn("unit", result.message.lower())


class TestTestCmdUnitFlag(unittest.TestCase):
    def test_unit_flag_runs_vitest_unit_and_python_unittest_only(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")
        called_cmds: list[list[str]] = []

        def fake_run(cmd: list[str], **kwargs: object) -> Ok[subprocess.CompletedProcess[str]]:
            called_cmds.append(cmd)
            return _ok_process(cmd)

        with patch("ranzi_game.commands.test_cmd.run_command", side_effect=fake_run):
            result = execute(project_root=root, unit=True, integration=False, e2e=False)

        self.assertIsInstance(result, Ok)
        flat = [" ".join(c) for c in called_cmds]
        # must call vitest (unit) and python unittest discover
        self.assertTrue(any("vitest" in c for c in flat))
        self.assertTrue(any("unittest" in c for c in flat))
        # must NOT call integration vitest
        self.assertFalse(any("**/*.integration.test.ts" in c and "--exclude" not in c for c in flat))
        self.assertFalse(any("playwright" in c for c in flat))


class TestTestCmdIntegrationFlag(unittest.TestCase):
    def test_integration_flag_runs_only_integration_vitest(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")
        called_cmds: list[list[str]] = []

        def fake_run(cmd: list[str], **kwargs: object) -> Ok[subprocess.CompletedProcess[str]]:
            called_cmds.append(cmd)
            return _ok_process(cmd)

        with (
            patch("ranzi_game.commands.test_cmd.run_command", side_effect=fake_run),
            patch("ranzi_game.commands.test_cmd._integration_tests_exist", return_value=True),
        ):
            result = execute(project_root=root, unit=False, integration=True, e2e=False)

        self.assertIsInstance(result, Ok)
        flat = [" ".join(c) for c in called_cmds]
        # integration vitest uses **/*.integration.test.ts
        self.assertTrue(any("**/*.integration.test.ts" in c and "--exclude" not in c for c in flat))
        self.assertFalse(any("playwright" in c for c in flat))
        # must not call unit vitest (which uses --exclude)
        self.assertFalse(any("--exclude" in c for c in flat))

    def test_integration_skips_gracefully_when_no_integration_files_exist(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")
        with (
            patch("ranzi_game.commands.test_cmd.run_command") as mock_run,
            patch("ranzi_game.commands.test_cmd._integration_tests_exist", return_value=False),
        ):
            result = execute(project_root=root, unit=False, integration=True, e2e=False)

        self.assertIsInstance(result, Ok)
        mock_run.assert_not_called()


class TestTestCmdE2EFlag(unittest.TestCase):
    def test_e2e_skips_gracefully_when_playwright_config_absent(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")
        with (
            patch("ranzi_game.commands.test_cmd.run_command") as mock_run,
            patch(
                "ranzi_game.commands.test_cmd._playwright_config_exists",
                return_value=False,
            ),
        ):
            result = execute(project_root=root, unit=False, integration=False, e2e=True)

        self.assertIsInstance(result, Ok)
        mock_run.assert_not_called()

    def test_e2e_calls_playwright_when_config_exists(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")
        called_cmds: list[list[str]] = []

        def fake_run(cmd: list[str], **kwargs: object) -> Ok[subprocess.CompletedProcess[str]]:
            called_cmds.append(cmd)
            return _ok_process(cmd)

        with (
            patch("ranzi_game.commands.test_cmd.run_command", side_effect=fake_run),
            patch(
                "ranzi_game.commands.test_cmd._playwright_config_exists",
                return_value=True,
            ),
        ):
            result = execute(project_root=root, unit=False, integration=False, e2e=True)

        self.assertIsInstance(result, Ok)
        flat = [" ".join(c) for c in called_cmds]
        self.assertTrue(any("playwright" in c for c in flat))

    def test_any_tier_failure_stops_and_returns_err_with_tier_name(self) -> None:
        from ranzi_game.commands.test_cmd import execute

        root = Path("/tmp/project")

        def fake_run(cmd: list[str], **kwargs: object) -> Err | Ok[subprocess.CompletedProcess[str]]:
            if "integration" in " ".join(cmd):
                return _err_process(cmd, "integration tests failed")
            return _ok_process(cmd)

        with (
            patch("ranzi_game.commands.test_cmd.run_command", side_effect=fake_run),
            patch("ranzi_game.commands.test_cmd._playwright_config_exists", return_value=True),
            patch("ranzi_game.commands.test_cmd._integration_tests_exist", return_value=True),
        ):
            result = execute(project_root=root, unit=False, integration=False, e2e=False)

        self.assertIsInstance(result, Err)
        self.assertIn("integration", result.message.lower())


if __name__ == "__main__":
    unittest.main()
