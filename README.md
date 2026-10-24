<div align="center">

# Navi

**Just build. Navi handles the rest.**

Natural-language guidance for safer software development with AI.

</div>

Navi gives Claude Code, Codex, and Cursor a set of practical skills for handling Git, project checks, recovery, and GitHub workflows. You describe what you want in everyday language; Navi turns it into clear technical steps, explains the consequences, and asks for exact approval before changing anything important.

There is no Navi app, account, hosted backend, or runtime. The skills live inside your project and use the Git tools you already have.

## What Navi helps you do

- Save progress as clear, meaningful versions.
- See what is saved, unsaved, online, or at risk.
- Check whether the project still builds, tests, or lints successfully.
- Understand what changed between two versions.
- Recover a file or return to an earlier version safely.
- Experiment without breaking the working version.
- Connect a project to GitHub and create an online backup.
- Work in English, Hebrew, or another language your coding agent understands.

## Install Navi

Install Navi into the root of the project where you want to use it. Choose either the terminal method or the ZIP method; both install the same twelve skills.

### Option 1: One terminal command

Open Terminal in your project folder and run the command for your AI coding agent.

**Claude Code**

```sh
curl -fsSL https://raw.githubusercontent.com/NirGeron98/Navi/main/install.sh | sh -s -- claude-code
```

**Codex**

```sh
curl -fsSL https://raw.githubusercontent.com/NirGeron98/Navi/main/install.sh | sh -s -- codex
```

**Cursor**

```sh
curl -fsSL https://raw.githubusercontent.com/NirGeron98/Navi/main/install.sh | sh -s -- cursor
```

The installer downloads only the skill Markdown files and Navi's shared operating contract. It inspects every destination before writing: new files are installed, identical files are left untouched, and a different existing Navi file stops the entire installation before any change is made.

This method requires `curl` and a POSIX shell. It works on macOS, Linux, and Windows through WSL or Git Bash.

### Option 2: Download a ZIP

Download the package that matches your agent:

- [Claude Code ZIP](https://github.com/NirGeron98/Navi/raw/refs/heads/main/website/public/downloads/navi-claude-code.zip)
- [Codex ZIP](https://github.com/NirGeron98/Navi/raw/refs/heads/main/website/public/downloads/navi-codex.zip)
- [Cursor ZIP](https://github.com/NirGeron98/Navi/raw/refs/heads/main/website/public/downloads/navi-cursor.zip)

Leave the ZIP in Downloads, open your project in the matching coding agent, and paste this prompt:

> Install Navi now in this currently open project from the newest Navi ZIP (or its matching extracted folder) in my Downloads folder. Do not ask me to move it into the project. If Downloads access requires native permission, request it. Confirm the package matches this AI coding agent, extract it temporarily if needed, and read navi-install/INSTALL.md. This message is my explicit approval to create missing directories and copy all new Navi files without asking for another confirmation. For installation only, this approval supersedes any package-guide step that says to show me a plan or wait for approval. If every destination is missing or byte-for-byte identical, proceed immediately, verify the installation, clean up only temporary files you created, and report the result. Stop and ask me only if the package is invalid, targets another agent, or a destination file differs. Do not delete my downloaded package.

### Finish setup

Reload your coding agent after installation, then say:

> Set up Navi

You can also say `הגדר את Navi` in Hebrew. Navi will inspect the project and explain what, if anything, still needs attention.

## Use Navi naturally

You do not need to memorize Git commands or skill names. Ask for the result you want:

- “Save everything I changed today.”
- “Is all my work backed up?”
- “Something broke after the last change—check what happened.”
- “Show me the last five working versions.”
- “Try a new dashboard without affecting the working version.”
- “Connect this project to GitHub as a private repository.”
- “תחזיר רק את קובץ ההתחברות לגרסה מאתמול.”

## Included skills

| Skill | What it does |
| --- | --- |
| `navi-setup` | Checks Git, identity, repository state, and ignore rules |
| `navi-status` | Explains what is saved, unsaved, online, current, or at risk |
| `navi-check` | Runs approved project checks and explains failures |
| `navi-save` | Reviews exact changes and creates a meaningful local version |
| `navi-history` | Shows searchable, human-readable past versions |
| `navi-compare` | Compares versions or current work with evidence |
| `navi-restore` | Restores selected files or reverts safely |
| `navi-branches` | Creates and switches safe experiments |
| `navi-merge` | Integrates finished work without guessing through conflicts |
| `navi-github-connect` | Authenticates and creates or links GitHub repositories |
| `navi-sync` | Fetches, fast-forward pulls, and non-force pushes |
| `navi-settings` | Saves validated project preferences in `.navi/config.md` |

## Where the files go

| Agent | Skills | Shared Navi contract |
| --- | --- | --- |
| Claude Code | `.claude/skills/navi-*/SKILL.md` | `.navi/NAVI.md` |
| Codex | `.agents/skills/navi-*/SKILL.md` | `.navi/NAVI.md` |
| Cursor | `.cursor/skills/navi-*/SKILL.md` | `.navi/NAVI.md` |

Cursor can also discover compatible Claude Code and Codex project skills. If Navi is already installed for one of those agents in the same project, you may not need a second Cursor installation.

## Safety model

Navi is intentionally procedural:

1. Inspect the real project state.
2. Explain the proposed action and its consequences.
3. Ask for action-specific approval.
4. Recheck relevant state before making the change.
5. Execute only the approved action and verify the result.

Navi does not use force push, hard reset, automatic conflict guessing, or chat-pasted GitHub tokens. Read-only skills can inspect without approval. Saving locally never silently authorizes uploading to GitHub.

Navi is a set of agent instructions, not an executable security boundary. Your coding agent's native permissions remain the stronger control.

## Requirements

- Git is required for version workflows.
- [GitHub CLI](https://cli.github.com/) is required only for GitHub connection and sync workflows.
- Navi itself requires no Python, Node.js, account, or background process.

## Update or remove Navi

Run the same terminal installation command again to check for an update. Identical files are skipped; locally changed Navi files cause a safe stop so you can review them first.

To remove Navi, delete the twelve `navi-*` skill folders from your agent's project skill directory and delete `.navi/NAVI.md`. Keep `.navi/config.md` if you want to preserve your preferences.

## Development

Canonical skills live in `packages/skills`, and `packages/shared/NAVI.md` is their shared contract. The website and agent-specific ZIPs are generated and verified from those sources.

```sh
python3 scripts/build_packages.py
python3 scripts/verify_packages.py
python3 -m unittest discover -s tests -v
npm --prefix website install
npm --prefix website run lint
npm --prefix website run typecheck
npm --prefix website run build
```

For implementation details, see [Architecture](docs/ARCHITECTURE.md), [Compatibility](docs/COMPATIBILITY.md), [Security](docs/SECURITY.md), and [Troubleshooting](docs/TROUBLESHOOTING.md).
