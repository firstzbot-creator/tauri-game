#!/usr/bin/env python3
"""aloha-kids-game developer CLI entry point."""
import sys

MIN_PYTHON = (3, 12)

if sys.version_info < MIN_PYTHON:
    print(
        f"ranzi-game requires Python {MIN_PYTHON[0]}.{MIN_PYTHON[1]}+. "
        f"You are running Python {sys.version_info.major}.{sys.version_info.minor}.",
        file=sys.stderr,
    )
    sys.exit(1)

from ranzi_game.cli import main

if __name__ == "__main__":
    main()
