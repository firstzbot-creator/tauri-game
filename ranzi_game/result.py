"""Result type — Ok / Err / Result alias (Python 3.12+)."""
from dataclasses import dataclass
from typing import Generic, TypeVar

T = TypeVar("T")


@dataclass(frozen=True)
class Ok(Generic[T]):
    value: T


@dataclass(frozen=True)
class Err:
    message: str
    cause: BaseException | None = None


type Result[T] = Ok[T] | Err
