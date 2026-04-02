"""Unit tests for ranzi_game.commands.init_cmd."""
import unittest
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from ranzi_game.result import Ok, Err
from ranzi_game.components import Component


def _make_component(
    name: str,
    install_cmd: list[str] | None = None,
    install_note: str | None = None,
) -> Component:
    return Component(
        name=name,
        check_cmd=[name, "--version"],
        install_cmd=install_cmd,
        install_note=install_note or f"Install {name} manually",
    )


class TestInitCmdAllPresent(unittest.TestCase):
    def test_all_present_returns_ok_and_prints_checkmarks(self) -> None:
        from ranzi_game.commands.init_cmd import execute

        components = [
            _make_component("node"),
            _make_component("npm"),
        ]

        def fake_check(comp: Component, root: Path) -> Ok[str]:
            return Ok(value="1.0.0")

        with (
            patch("ranzi_game.commands.init_cmd.COMPONENTS", components),
            patch("ranzi_game.commands.init_cmd.check_component", side_effect=fake_check),
            patch("sys.stdout", new_callable=StringIO) as mock_out,
        ):
            result = execute(project_root=Path("/tmp"))

        self.assertIsInstance(result, Ok)
        output = mock_out.getvalue()
        self.assertIn("✓", output)
        self.assertIn("node", output)
        self.assertIn("npm", output)


class TestInitCmdOneMissingInstallable(unittest.TestCase):
    def test_missing_installable_component_calls_install_and_returns_ok(
        self,
    ) -> None:
        from ranzi_game.commands.init_cmd import execute

        components = [
            _make_component("typescript", install_cmd=["npm", "install", "-D", "typescript"]),
        ]

        check_results = [Err(message="typescript not found")]
        install_results = [Ok(value=None)]

        with (
            patch("ranzi_game.commands.init_cmd.COMPONENTS", components),
            patch(
                "ranzi_game.commands.init_cmd.check_component",
                side_effect=check_results,
            ),
            patch(
                "ranzi_game.commands.init_cmd.install_component",
                side_effect=install_results,
            ) as mock_install,
            patch("sys.stdout", new_callable=StringIO),
        ):
            result = execute(project_root=Path("/tmp"))

        self.assertIsInstance(result, Ok)
        mock_install.assert_called_once()


class TestInitCmdOneMissingNotInstallable(unittest.TestCase):
    def test_missing_not_installable_returns_err_with_component_name(self) -> None:
        from ranzi_game.commands.init_cmd import execute

        components = [
            _make_component("node", install_cmd=None, install_note="Install from nodejs.org"),
        ]

        check_results = [Err(message="node not found")]
        install_results = [Err(message="node: Install from nodejs.org")]

        with (
            patch("ranzi_game.commands.init_cmd.COMPONENTS", components),
            patch(
                "ranzi_game.commands.init_cmd.check_component",
                side_effect=check_results,
            ),
            patch(
                "ranzi_game.commands.init_cmd.install_component",
                side_effect=install_results,
            ),
            patch("sys.stdout", new_callable=StringIO),
        ):
            result = execute(project_root=Path("/tmp"))

        self.assertIsInstance(result, Err)
        self.assertIn("node", result.message)


class TestInitCmdMultipleMissing(unittest.TestCase):
    def test_multiple_missing_returns_err_listing_all_failures(self) -> None:
        from ranzi_game.commands.init_cmd import execute

        components = [
            _make_component("node", install_cmd=None),
            _make_component("rustup", install_cmd=None),
        ]

        check_results = [
            Err(message="node not found"),
            Err(message="rustup not found"),
        ]
        install_results = [
            Err(message="node: install manually"),
            Err(message="rustup: install manually"),
        ]

        with (
            patch("ranzi_game.commands.init_cmd.COMPONENTS", components),
            patch(
                "ranzi_game.commands.init_cmd.check_component",
                side_effect=check_results,
            ),
            patch(
                "ranzi_game.commands.init_cmd.install_component",
                side_effect=install_results,
            ),
            patch("sys.stdout", new_callable=StringIO),
        ):
            result = execute(project_root=Path("/tmp"))

        self.assertIsInstance(result, Err)
        self.assertIn("node", result.message)
        self.assertIn("rustup", result.message)


if __name__ == "__main__":
    unittest.main()
