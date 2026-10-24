#!/usr/bin/env python3
"""Build deterministic, agent-guided Gitly skill archives for each host."""
from __future__ import annotations

import shutil
import stat
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "website/public/downloads"
SKILLS = tuple(sorted(path.name for path in (ROOT / "packages/skills").iterdir() if path.is_dir() and path.name.startswith("gitly-")))
AGENTS = {
    "claude-code": Path(".claude/skills"),
    "codex": Path(".agents/skills"),
    "cursor": Path(".cursor/skills"),
}
AGENT_NAMES = {"claude-code": "Claude Code", "codex": "Codex", "cursor": "Cursor"}
PACKAGE_ROOT = Path("gitly-install")
GUIDE_PATH = PACKAGE_ROOT / "INSTALL.md"


def stage_agent(stage: Path, agent: str) -> None:
    destination = AGENTS[agent]
    guide = stage / GUIDE_PATH
    guide.parent.mkdir(parents=True, exist_ok=True)
    guide.write_text(
        f"""# Install Gitly for {AGENT_NAMES[agent]}

This folder contains the actual Gitly files in a visible staging layout. It contains no executable installer or runtime.

## Instructions for the AI agent

This package targets {AGENT_NAMES[agent]}. If that does not match the current AI coding agent, stop and tell the user to download the correct package.

Install Gitly only into the currently open project. The package may be in Downloads or a temporary extraction directory; never treat that source directory as the project.
The user's request to install Gitly is explicit approval to create missing directories and copy new Gitly files. Do not ask for another confirmation when every destination file is missing or byte-for-byte identical to the staged file.

1. Resolve paths relative to this `INSTALL.md` and confirm that `skills` contains exactly these {len(SKILLS)} folders: {', '.join(SKILLS)}.
2. Inspect the destination `{destination.as_posix()}` and `.gitly/GITLY.md` before changing anything.
3. Classify every destination file as new, identical, or conflicting.
4. If the package inventory is invalid or any destination file is conflicting, stop and explain the problem. Ask the user what to do only for conflicting files. Never overwrite unrelated files or replace an entire existing folder.
5. If every destination file is new or identical, proceed immediately without presenting a plan or requesting approval. Create only missing directories, copy new `skills/gitly-*/SKILL.md` files into `{destination.as_posix()}/gitly-*/SKILL.md`, and copy a new `shared/GITLY.md` to `.gitly/GITLY.md`. Do not rewrite identical files.
6. Verify that all {len(SKILLS)} skills and `.gitly/GITLY.md` exist at their destinations and match the staged files.
7. Report the result. Remove only a temporary extraction directory you created. Never delete the downloaded ZIP or a user-created extracted folder.
8. Tell the user to reload {AGENT_NAMES[agent]} and say: “Set up Gitly.”

Do not modify `AGENTS.md`, `CLAUDE.md`, existing non-Gitly skills, credentials, Git history, branches, or remotes during installation.
""",
        encoding="utf-8",
    )
    shared = stage / PACKAGE_ROOT / "shared/GITLY.md"
    shared.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / "packages/shared/GITLY.md", shared)
    for name in SKILLS:
        target = stage / PACKAGE_ROOT / "skills" / name / "SKILL.md"
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / "packages/skills" / name / "SKILL.md", target)


def archive(agent: str) -> Path:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    target = OUTPUT / f"gitly-{agent}.zip"
    with tempfile.TemporaryDirectory() as temporary:
        stage = Path(temporary)
        stage_agent(stage, agent)
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as output:
            for source in sorted(stage.rglob("*")):
                if not source.is_file():
                    continue
                info = zipfile.ZipInfo(source.relative_to(stage).as_posix(), (2026, 1, 1, 0, 0, 0))
                info.external_attr = (stat.S_IFREG | 0o644) << 16
                info.compress_type = zipfile.ZIP_DEFLATED
                output.writestr(info, source.read_bytes())
    return target


def collision_paths(archive_path: Path, project: Path, agent: str) -> list[str]:
    """Development-time preflight for the destinations named by the guide."""
    destinations = {
        *(AGENTS[agent] / name / "SKILL.md" for name in SKILLS),
        Path(".gitly/GITLY.md"),
    }
    with zipfile.ZipFile(archive_path) as package:
        assert GUIDE_PATH.as_posix() in package.namelist()
    return sorted(path.as_posix() for path in destinations if (project / path).exists())


def main() -> None:
    for obsolete in (
        "gitly-macos.zip",
        "gitly-windows.zip",
    ):
        stale = OUTPUT / obsolete
        if stale.exists():
            stale.unlink()
    for agent in AGENTS:
        print(archive(agent))


if __name__ == "__main__":
    main()
