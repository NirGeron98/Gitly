from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from build_packages import AGENTS, GUIDE_PATH, OUTPUT, PACKAGE_ROOT, SKILLS, collision_paths


class PackageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        subprocess.run([sys.executable, ROOT / "scripts/build_packages.py"], check=True, capture_output=True)

    def test_agent_archives_are_visible_guided_and_runtime_free(self):
        self.assertEqual(len(SKILLS), 12)
        for agent, skill_root in AGENTS.items():
            archive = OUTPUT / f"gitly-{agent}.zip"
            with zipfile.ZipFile(archive) as package:
                names = set(package.namelist())
                guide = package.read(GUIDE_PATH.as_posix()).decode("utf-8")
                self.assertIsNone(package.testzip())
                self.assertEqual(
                    package.read(f"{PACKAGE_ROOT.as_posix()}/shared/GITLY.md"),
                    (ROOT / "packages/shared/GITLY.md").read_bytes(),
                )
                for name in SKILLS:
                    self.assertEqual(
                        package.read(f"{PACKAGE_ROOT.as_posix()}/skills/{name}/SKILL.md"),
                        (ROOT / "packages/skills" / name / "SKILL.md").read_bytes(),
                    )
            expected = {GUIDE_PATH.as_posix(), f"{PACKAGE_ROOT.as_posix()}/shared/GITLY.md"} | {
                f"{PACKAGE_ROOT.as_posix()}/skills/{name}/SKILL.md" for name in SKILLS
            }
            self.assertEqual(names, expected)
            self.assertIn("Do not ask for another confirmation", guide)
            self.assertNotIn("Wait for explicit user approval", guide)
            self.assertIn("currently open project", guide)
            self.assertNotIn("project root that contains this", guide)
            self.assertIn(skill_root.as_posix(), guide)
            self.assertFalse(any(part.startswith(".") for name in names for part in Path(name).parts))
            self.assertFalse(any(name.endswith((".py", ".js", ".cmd", ".command", ".exe")) for name in names))
            self.assertFalse(any("installer" in name.lower() or "payload" in name.lower() for name in names))

    def test_existing_file_collisions_are_detectable_before_copy(self):
        archive = OUTPUT / "gitly-claude-code.zip"
        with tempfile.TemporaryDirectory() as temporary:
            project = Path(temporary)
            existing = project / ".claude/skills/gitly-save/SKILL.md"
            existing.parent.mkdir(parents=True)
            existing.write_text("existing user version\n", encoding="utf-8")
            self.assertEqual(collision_paths(archive, project, "claude-code"), [".claude/skills/gitly-save/SKILL.md"])
            self.assertEqual(existing.read_text(), "existing user version\n")

    def test_legacy_os_archives_are_removed(self):
        self.assertFalse((OUTPUT / "gitly-macos.zip").exists())
        self.assertFalse((OUTPUT / "gitly-windows.zip").exists())

    def test_website_points_to_all_real_packages(self):
        source = (ROOT / "website/src/main.tsx").read_text(encoding="utf-8")
        for agent in AGENTS:
            name = f"gitly-{agent}.zip"
            self.assertIn(f"/downloads/{name}", source)
            self.assertTrue((OUTPUT / name).is_file())
        self.assertNotIn("gitly-macos.zip", source)
        self.assertNotIn("gitly-windows.zip", source)
        self.assertNotIn("Python 3", source)
        self.assertIn("Downloads folder", source)
        self.assertIn("explicit approval", source)
        self.assertIn("supersedes any package-guide step", source)
        self.assertNotIn("wait for my approval", source)
        self.assertNotIn("Move it into your project", source)

    def test_website_offers_terminal_and_zip_install_tabs(self):
        source = (ROOT / "website/src/main.tsx").read_text(encoding="utf-8")
        self.assertIn('role="tablist"', source)
        self.assertIn("Terminal <b>Fastest</b>", source)
        self.assertIn("Download ZIP", source)
        for agent in AGENTS:
            self.assertIn(f"sh -s -- {agent}", source)
        self.assertIn("raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh", source)


if __name__ == "__main__":
    unittest.main()
