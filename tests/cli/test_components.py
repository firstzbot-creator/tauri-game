"""Unit tests for ranzi_game.components — run_command is mocked."""
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

from ranzi_game.components import Component, check_component, install_component
from ranzi_game.result import Ok, Err


def _make_component(
    name: str = "test-tool",
    check_cmd: list[str] | None = None,
    install_cmd: list[str] | None = None,
    install_note: str | None = None,
) -> Component:
    return Component(
        name=name,
        check_cmd=check_cmd or ["test-tool", "--version"],
        install_cmd=install_cmd,
        install_note=install_note,
    )


class TestCheckComponent(unittest.TestCase):
    def test_returns_ok_with_version_when_command_succeeds(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["node", "--version"], returncode=0, stdout="v20.0.0", stderr=""
        )
        ok_result: Ok[subprocess.CompletedProcess[str]] = Ok(value=completed)
        with patch("ranzi_game.components.run_command", return_value=ok_result):
            result = check_component(_make_component(), Path("/tmp"))
        self.assertIsInstance(result, Ok)
        self.assertEqual(result.value, "v20.0.0")

    def test_returns_ok_with_installed_fallback_when_stdout_is_empty(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["node", "--version"], returncode=0, stdout="", stderr=""
        )
        ok_result: Ok[subprocess.CompletedProcess[str]] = Ok(value=completed)
        with patch("ranzi_game.components.run_command", return_value=ok_result):
            result = check_component(_make_component(), Path("/tmp"))
        self.assertIsInstance(result, Ok)
        self.assertEqual(result.value, "(installed)")

    def test_returns_err_when_run_command_returns_err(self) -> None:
        err_result = Err(message="node not found")
        with patch("ranzi_game.components.run_command", return_value=err_result):
            result = check_component(_make_component(), Path("/tmp"))
        self.assertIsInstance(result, Err)
        self.assertIn("not found", result.message)


class TestInstallComponent(unittest.TestCase):
    def test_returns_err_with_note_when_install_cmd_is_none(self) -> None:
        comp = _make_component(
            name="node",
            install_cmd=None,
            install_note="Install Node.js from https://nodejs.org",
        )
        result = install_component(comp, Path("/tmp"))
        self.assertIsInstance(result, Err)
        self.assertIn("node", result.message)
        self.assertIn("Install Node.js", result.message)

    def test_returns_err_with_default_note_when_no_note_and_no_install_cmd(
        self,
    ) -> None:
        comp = _make_component(name="mystery-tool", install_cmd=None, install_note=None)
        result = install_component(comp, Path("/tmp"))
        self.assertIsInstance(result, Err)
        self.assertIn("mystery-tool", result.message)

    def test_returns_ok_when_install_succeeds(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["npm", "install", "-D", "typescript"],
            returncode=0,
            stdout="",
            stderr="",
        )
        ok_result: Ok[subprocess.CompletedProcess[str]] = Ok(value=completed)
        comp = _make_component(
            name="typescript",
            install_cmd=["npm", "install", "-D", "typescript"],
        )
        with patch("ranzi_game.components.run_command", return_value=ok_result):
            result = install_component(comp, Path("/tmp"))
        self.assertIsInstance(result, Ok)

    def test_propagates_err_from_run_command_with_context(self) -> None:
        err_result = Err(message="npm failed: network error")
        comp = _make_component(
            name="typescript",
            install_cmd=["npm", "install", "-D", "typescript"],
        )
        with patch("ranzi_game.components.run_command", return_value=err_result):
            result = install_component(comp, Path("/tmp"))
        self.assertIsInstance(result, Err)
        self.assertIn("typescript", result.message)
        self.assertIn("npm failed", result.message)


if __name__ == "__main__":
    unittest.main()
