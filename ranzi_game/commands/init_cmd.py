"""init command — check and install all required dev components."""
from pathlib import Path

from ranzi_game.components import COMPONENTS, check_component, install_component
from ranzi_game.result import Ok, Err, Result


def execute(project_root: Path) -> Result[None]:
    failures: list[str] = []

    for component in COMPONENTS:
        check_result = check_component(component, project_root)
        match check_result:
            case Ok(value=version):
                print(f"✓ {component.name} ({version}) — already installed")
            case Err():
                install_result = install_component(component, project_root)
                match install_result:
                    case Ok(_):
                        print(f"✓ {component.name} — installed successfully")
                    case Err(message=msg):
                        print(f"✗ {component.name} — {msg}")
                        failures.append(component.name)

    if failures:
        return Err(message=f"Missing components: {', '.join(failures)}")
    return Ok(value=None)
