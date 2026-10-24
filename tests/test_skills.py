from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = ROOT / "packages/skills"
EXPECTED = {
    "navi-setup", "navi-save", "navi-history", "navi-compare", "navi-restore",
    "navi-branches", "navi-merge", "navi-github-connect", "navi-sync", "navi-settings",
    "navi-status", "navi-check",
}
READ_ONLY = {"navi-history", "navi-compare", "navi-status"}
MUTATING = EXPECTED - READ_ONLY


class SkillManifestTests(unittest.TestCase):
    def test_exact_inventory_and_valid_metadata(self):
        found = {path.name for path in SKILL_ROOT.iterdir() if (path / "SKILL.md").is_file()}
        self.assertEqual(found, EXPECTED)
        for name in EXPECTED:
            text = (SKILL_ROOT / name / "SKILL.md").read_text(encoding="utf-8")
            self.assertRegex(text, rf"\A---\nname: {re.escape(name)}\ndescription: .+\n---")
            self.assertNotIn("TODO", text)
            self.assertIn("../../../.navi/NAVI.md", text)
            self.assertTrue(any("\u0590" <= char <= "\u05ff" for char in text), name)

    def test_skills_are_independent_of_removed_engine(self):
        forbidden = ("navi.py", ".navi/bin", "install.py", "payload/", "Python 3", "APPROVE NAVI")
        for path in SKILL_ROOT.glob("*/SKILL.md"):
            text = path.read_text(encoding="utf-8")
            for value in forbidden:
                self.assertNotIn(value, text, f"{path} still depends on {value}")

    def test_required_workflow_guidance(self):
        shared = (ROOT / "packages/shared/NAVI.md").read_text(encoding="utf-8")
        for phrase in ("Inspect", "explicit approval", "relevant state change", "untrusted data", "Never use force push", "Project preferences"):
            self.assertIn(phrase, shared)
        for name in MUTATING:
            text = (SKILL_ROOT / name / "SKILL.md").read_text(encoding="utf-8").lower()
            for phrase in ("prerequisites and inspection", "approval", "verify", "recovery"):
                self.assertIn(phrase, text, f"{name} lacks {phrase}")
        for name in READ_ONLY:
            text = (SKILL_ROOT / name / "SKILL.md").read_text(encoding="utf-8").lower()
            self.assertIn("read-only", text)
            self.assertRegex(text, r"(?:no approval|do not require approval)")

    def test_restore_merge_and_sync_prohibit_destructive_shortcuts(self):
        all_text = "\n".join(path.read_text(encoding="utf-8") for path in SKILL_ROOT.glob("*/SKILL.md"))
        self.assertNotIn("git reset --hard", all_text)
        self.assertNotIn("git push --force", all_text)
        restore = (SKILL_ROOT / "navi-restore/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("checkpoint", restore)
        self.assertIn("path-scoped stash", restore)
        merge = (SKILL_ROOT / "navi-merge/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("Never pick “ours”/“theirs,”", merge)
        self.assertIn("git merge --abort", merge)
        sync = (SKILL_ROOT / "navi-sync/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("git pull --ff-only", sync)
        self.assertIn("Never add force flags", sync)

    def test_natural_language_scenarios_route_to_distinct_skills(self):
        scenarios = {
            "navi-save": "Save everything I did today",
            "navi-history": "Show me the last five versions",
            "navi-compare": "What changed between yesterday and today",
            "navi-restore": "Go back to the version where login worked",
            "navi-branches": "experiment without breaking",
            "navi-merge": "Put the changes into my main project",
            "navi-sync": "Back up my project to GitHub",
            "navi-settings": "From now on only save locally",
            "navi-status": "Am I backed up?",
            "navi-check": "something behaving strangely after a recent change",
        }
        for skill, example in scenarios.items():
            text = (SKILL_ROOT / skill / "SKILL.md").read_text(encoding="utf-8").casefold()
            self.assertIn(example.casefold(), text, skill)

    def test_ambiguous_breakage_checks_before_explicit_restore(self):
        shared = (ROOT / "packages/shared/NAVI.md").read_text(encoding="utf-8")
        check = (SKILL_ROOT / "navi-check/SKILL.md").read_text(encoding="utf-8")
        restore = (SKILL_ROOT / "navi-restore/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("general report", shared.casefold())
        self.assertIn("never authorizes a fix or restoration", check)
        self.assertIn("explicitly wants", restore)
        self.assertNotIn("git reset --hard", check + restore)

    def test_settings_schema_has_safe_defaults(self):
        shared = (ROOT / "packages/shared/NAVI.md").read_text(encoding="utf-8")
        for line in ("version: 1", "save_destination: local", "history_length: 5", "github_visibility: private", "language: auto", "confirmation: always"):
            self.assertIn(line, shared)
        settings = (SKILL_ROOT / "navi-settings/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("Do not overwrite malformed", settings)
        self.assertIn("next action still needs its own approval", settings)


if __name__ == "__main__":
    unittest.main()
