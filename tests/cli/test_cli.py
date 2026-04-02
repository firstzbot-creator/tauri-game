"""Unit tests for ranzi_game.cli — argparse dispatch and help output."""
import sys
import unittest
from io import StringIO
from pathlib import Path
from unittest.mock import patch, MagicMock

from ranzi_game.result import Ok, Err


class TestHelpExitsZero(unittest.TestCase):
    def test_help_exits_zero(self) -> None:
        from ranzi_game.cli import main

        with self.assertRaises(SystemExit) as cm:
            with patch("sys.argv", ["ranzi-game", "--help"]):
                with patch("sys.stdout", new_callable=StringIO):
                    main()
        self.assertEqual(cm.exception.code, 0)

    def test_help_output_contains_all_three_commands(self) -> None:
        from ranzi_game.cli import main

        buf = StringIO()
        with self.assertRaises(SystemExit):
            with patch("sys.argv", ["ranzi-game", "--help"]):
                with patch("sys.stdout", buf):
                    main()
        output = buf.getvalue()
        self.assertIn("init", output)
        self.assertIn("test", output)
        self.assertIn("run", output)


class TestMissingCommandExitsNonZero(unittest.TestCase):
    def test_missing_command_exits_nonzero(self) -> None:
        from ranzi_game.cli import main

        with self.assertRaises(SystemExit) as cm:
            with patch("sys.argv", ["ranzi-game"]):
                with patch("sys.stderr", new_callable=StringIO):
                    main()
        self.assertNotEqual(cm.exception.code, 0)


class TestInitDispatch(unittest.TestCase):
    def test_init_dispatches_to_init_execute(self) -> None:
        from ranzi_game.cli import main

        mock_execute = MagicMock(return_value=Ok(value=None))
        with (
            patch("sys.argv", ["ranzi-game", "init"]),
            patch("ranzi_game.commands.init_cmd.execute", mock_execute),
        ):
            with patch("sys.exit") as mock_exit:
                main()
        mock_execute.assert_called_once()
        mock_exit.assert_called_with(0)


class TestTestUnitFlagDispatch(unittest.TestCase):
    def test_test_unit_passes_correct_flags(self) -> None:
        from ranzi_game.cli import main

        mock_execute = MagicMock(return_value=Ok(value=None))
        with (
            patch("sys.argv", ["ranzi-game", "test", "--unit"]),
            patch("ranzi_game.commands.test_cmd.execute", mock_execute),
        ):
            with patch("sys.exit"):
                main()

        _, kwargs = mock_execute.call_args
        self.assertTrue(kwargs["unit"])
        self.assertFalse(kwargs["integration"])
        self.assertFalse(kwargs["e2e"])


if __name__ == "__main__":
    unittest.main()
