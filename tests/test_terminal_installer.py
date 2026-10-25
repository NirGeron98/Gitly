from __future__ import annotations

import os
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INSTALLER = ROOT / "install.sh"
SKILLS = sorted(path.name for path in (ROOT / "packages/skills").iterdir() if path.name.startswith("gitly-"))
AGENTS = {"codex": ".agents/skills", "claude-code": ".claude/skills", "cursor": ".cursor/skills"}


class TerminalInstallerTests(unittest.TestCase):
    def run_installer(self, project: Path, agent: str) -> subprocess.CompletedProcess[str]:
        env = os.environ.copy()
        env["GITLY_SOURCE_URL"] = ROOT.as_uri()
        return subprocess.run(
            ["sh", INSTALLER, agent],
            cwd=project,
            env=env,
            text=True,
            capture_output=True,
        )

    def test_each_agent_install_is_complete_and_idempotent(self):
        for agent, skill_root in AGENTS.items():
            with self.subTest(agent=agent), tempfile.TemporaryDirectory() as temporary:
                project = Path(temporary) / "project"
                project.mkdir()

                first = self.run_installer(project, agent)
                self.assertEqual(first.returncode, 0, first.stderr)
                for name in SKILLS:
                    installed = project / skill_root / name / "SKILL.md"
                    self.assertEqual(installed.read_bytes(), (ROOT / "packages/skills" / name / "SKILL.md").read_bytes())
                    shared_reference = installed.parent / "../../../.gitly/GITLY.md"
                    self.assertEqual(shared_reference.resolve(), (project / ".gitly/GITLY.md").resolve())
                    self.assertEqual(shared_reference.read_bytes(), (ROOT / "packages/shared/GITLY.md").read_bytes())

                before = {path: (path.stat().st_mtime_ns, path.read_bytes()) for path in project.rglob("*") if path.is_file()}
                second = self.run_installer(project, agent)
                self.assertEqual(second.returncode, 0, second.stderr)
                self.assertIn("already up to date", second.stdout)
                self.assertEqual(before, {path: (path.stat().st_mtime_ns, path.read_bytes()) for path in project.rglob("*") if path.is_file()})

    def test_conflict_stops_before_any_new_file_is_written(self):
        with tempfile.TemporaryDirectory() as temporary:
            project = Path(temporary) / "project"
            conflict = project / ".agents/skills/gitly-save/SKILL.md"
            conflict.parent.mkdir(parents=True)
            conflict.write_text("user version\n", encoding="utf-8")

            result = self.run_installer(project, "codex")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("stopped before making changes", result.stderr)
            self.assertEqual(conflict.read_text(encoding="utf-8"), "user version\n")
            self.assertFalse((project / ".agents/skills/gitly-setup/SKILL.md").exists())
            self.assertFalse((project / ".gitly/GITLY.md").exists())

    def test_unknown_agent_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            project = Path(temporary) / "project"
            project.mkdir()
            result = self.run_installer(project, "unknown")
            self.assertEqual(result.returncode, 2)
            self.assertIn("claude-code|codex|cursor", result.stderr)


if __name__ == "__main__":
    unittest.main()
