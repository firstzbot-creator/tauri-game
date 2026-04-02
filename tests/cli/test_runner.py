"""Unit tests for ranzi_game.runner — all subprocess calls mocked."""
import subprocess
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

from ranzi_game.result import Ok, Err
from ranzi_game.runner import run_command


class TestRunCommandSuccess(unittest.TestCase):
    def test_returns_ok_when_subprocess_exits_zero(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["echo", "hi"], returncode=0, stdout="hi\n", stderr=""
        )
        with patch("subprocess.run", return_value=completed):
            result = run_command(["echo", "hi"], cwd=Path("/tmp"))
        self.assertIsInstance(result, Ok)
        self.assertEqual(result.value.returncode, 0)

    def test_returns_err_when_subprocess_exits_nonzero(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["false"], returncode=1, stdout="", stderr="something failed"
        )
        with patch("subprocess.run", return_value=completed):
            result = run_command(["false"])
        self.assertIsInstance(result, Err)
        self.assertIn("1", result.message)
        self.assertIn("something failed", result.message)

    def test_returns_err_on_file_not_found(self) -> None:
        with patch("subprocess.run", side_effect=FileNotFoundError("no such file")):
            result = run_command(["nonexistent-tool"])
        self.assertIsInstance(result, Err)
        self.assertIn("not found", result.message)
        self.assertIsInstance(result.cause, FileNotFoundError)

    def test_returns_err_on_os_error(self) -> None:
        with patch("subprocess.run", side_effect=OSError("permission denied")):
            result = run_command(["restricted-cmd"])
        self.assertIsInstance(result, Err)
        self.assertIn("OS error", result.message)
        self.assertIsInstance(result.cause, OSError)

    def test_nonzero_with_empty_stderr_shows_no_stderr_message(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["cmd"], returncode=2, stdout="", stderr=""
        )
        with patch("subprocess.run", return_value=completed):
            result = run_command(["cmd"])
        self.assertIsInstance(result, Err)
        self.assertIn("(no stderr)", result.message)


if __name__ == "__main__":
    unittest.main()
