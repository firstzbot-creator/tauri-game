"""Unit tests for ranzi_game.commands.run_cmd."""
import subprocess
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from ranzi_game.result import Ok, Err
from ranzi_game.commands.run_cmd import discover_games, tauri_config_for_game


class TestDiscoverGames(unittest.TestCase):
    def test_returns_default_when_apps_dir_does_not_exist(self) -> None:
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            result = discover_games(root)
        self.assertEqual(result, ["default"])

    def test_returns_sorted_game_names_from_apps_subdir(self) -> None:
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            apps = root / "apps"
            apps.mkdir()
            (apps / "zebra-game").mkdir()
            (apps / "alpha-game").mkdir()
            result = discover_games(root)
        self.assertEqual(result, ["alpha-game", "zebra-game"])

    def test_ignores_hidden_directories(self) -> None:
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            apps = root / "apps"
            apps.mkdir()
            (apps / "my-game").mkdir()
            (apps / ".hidden").mkdir()
            result = discover_games(root)
        self.assertNotIn(".hidden", result)
        self.assertIn("my-game", result)

    def test_returns_default_when_apps_dir_is_empty(self) -> None:
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            apps = root / "apps"
            apps.mkdir()
            result = discover_games(root)
        self.assertEqual(result, ["default"])


class TestTauriConfigForGame(unittest.TestCase):
    def test_returns_bare_tauri_dev_for_default(self) -> None:
        with TemporaryDirectory() as tmp:
            cmd = tauri_config_for_game(Path(tmp), "default")
        self.assertEqual(cmd, ["npx", "tauri", "dev"])

    def test_returns_config_path_for_named_game(self) -> None:
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            cmd = tauri_config_for_game(root, "my-game")
        self.assertIn("--config", cmd)
        self.assertTrue(any("my-game" in part for part in cmd))
        self.assertTrue(any("tauri.conf.json" in part for part in cmd))


class TestRunCmdExecute(unittest.TestCase):
    def test_single_game_launches_without_prompting(self) -> None:
        from ranzi_game.commands.run_cmd import execute

        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            called_cmds: list[list[str]] = []

            def fake_run(cmd: list[str], **kwargs: object) -> Ok[subprocess.CompletedProcess[str]]:
                called_cmds.append(cmd)
                return Ok(
                    value=subprocess.CompletedProcess(
                        args=cmd, returncode=0, stdout="", stderr=""
                    )
                )

            with (
                patch("ranzi_game.commands.run_cmd.run_command", side_effect=fake_run),
                patch("ranzi_game.commands.run_cmd._tauri_project_exists", return_value=True),
            ):
                result = execute(project_root=root, game=None)

        self.assertIsInstance(result, Ok)
        self.assertEqual(len(called_cmds), 1)

    def test_unknown_game_returns_err_listing_valid_names(self) -> None:
        from ranzi_game.commands.run_cmd import execute

        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            apps = root / "apps"
            apps.mkdir()
            (apps / "game-one").mkdir()
            (apps / "game-two").mkdir()

            with patch("ranzi_game.commands.run_cmd._tauri_project_exists", return_value=True):
                result = execute(project_root=root, game="nonexistent-game")

        self.assertIsInstance(result, Err)
        self.assertIn("nonexistent-game", result.message)
        self.assertIn("game-one", result.message)
        self.assertIn("game-two", result.message)


    def test_returns_err_when_no_tauri_project_exists(self) -> None:
        from ranzi_game.commands.run_cmd import execute

        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            # no tauri.conf.json anywhere — should fail before calling run_command
            with patch("ranzi_game.commands.run_cmd.run_command") as mock_run:
                result = execute(project_root=root, game=None)

        self.assertIsInstance(result, Err)
        self.assertIn("tauri", result.message.lower())
        mock_run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
