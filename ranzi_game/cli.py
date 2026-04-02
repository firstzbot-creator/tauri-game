"""CLI dispatch — argparse wiring + match dispatch."""
import argparse
import sys
from pathlib import Path

from ranzi_game.result import Ok, Err


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="ranzi-game",
        description="aloha-kids-game developer CLI",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("init", help="Check and install dev dependencies")

    test_parser = subparsers.add_parser("test", help="Run test suite")
    test_parser.add_argument("--unit", action="store_true", help="Unit tests only")
    test_parser.add_argument("--integration", action="store_true", help="Integration tests only")
    test_parser.add_argument("--e2e", action="store_true", help="E2E tests only")

    run_parser = subparsers.add_parser("run", help="Launch the game")
    run_parser.add_argument("--game", type=str, help="Game name to launch")

    args = parser.parse_args()
    project_root = Path(__file__).parent.parent

    match args.command:
        case "init":
            from ranzi_game.commands.init_cmd import execute as init_execute
            result = init_execute(project_root=project_root)
        case "test":
            from ranzi_game.commands.test_cmd import execute as test_execute
            result = test_execute(
                project_root=project_root,
                unit=args.unit,
                integration=args.integration,
                e2e=args.e2e,
            )
        case "run":
            from ranzi_game.commands.run_cmd import execute as run_execute
            result = run_execute(project_root=project_root, game=args.game)
        case _:
            parser.print_help()
            sys.exit(1)

    match result:
        case Ok(_):
            sys.exit(0)
        case Err(message=msg, cause=cause):
            print(f"✗ {msg}", file=sys.stderr)
            if cause is not None:
                print(f"  caused by: {cause}", file=sys.stderr)
            sys.exit(1)
