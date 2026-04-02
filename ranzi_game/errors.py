"""CLIError — structured error for command dispatch."""
from dataclasses import dataclass


@dataclass(frozen=True)
class CLIError:
    message: str
    exit_code: int = 1
