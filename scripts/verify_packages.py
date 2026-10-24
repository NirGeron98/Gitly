#!/usr/bin/env python3
from __future__ import annotations

import tempfile
import zipfile
from pathlib import Path

from build_packages import AGENTS, GUIDE_PATH, OUTPUT, PACKAGE_ROOT, SKILLS


def main() -> None:
    for agent, skill_root in AGENTS.items():
        archive = OUTPUT / f"gitly-{agent}.zip"
        assert archive.is_file() and archive.stat().st_size > 1000
        with zipfile.ZipFile(archive) as package:
            names = set(package.namelist())
            expected = {GUIDE_PATH.as_posix(), f"{PACKAGE_ROOT.as_posix()}/shared/GITLY.md"} | {
                f"{PACKAGE_ROOT.as_posix()}/skills/{name}/SKILL.md" for name in SKILLS
            }
            assert names == expected, (agent, sorted(names ^ expected))
            guide = package.read(GUIDE_PATH.as_posix()).decode("utf-8")
            assert "Do not ask for another confirmation" in guide
            assert "Wait for explicit user approval" not in guide
            assert skill_root.as_posix() in guide
            assert not any(part.startswith(".") for name in names for part in Path(name).parts)
            assert not any(name.endswith((".py", ".pyc", ".js", ".cmd", ".command", ".exe")) for name in names)
            assert not any("installer" in name.lower() or "payload" in name.lower() for name in names)
            with tempfile.TemporaryDirectory() as temporary:
                package.extractall(temporary)
                root = Path(temporary)
                for name in SKILLS:
                    skill = root / PACKAGE_ROOT / "skills" / name / "SKILL.md"
                    assert skill.is_file()
                assert (root / PACKAGE_ROOT / "shared/GITLY.md").is_file()
    print("Package verification passed for Claude Code, Codex, and Cursor.")


if __name__ == "__main__":
    main()
