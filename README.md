<div align="center">

# Gitly

**Just build. Gitly handles the rest.**

Natural-language guidance for safer software development with AI.

</div>

Gitly gives Claude Code, Codex, and Cursor a set of practical skills for handling Git, project checks, recovery, and GitHub workflows. You describe what you want in everyday language; Gitly turns it into clear technical steps, explains the consequences, and asks for exact approval before changing anything important.

There is no Gitly app, account, hosted backend, or runtime. The skills live inside your project and use the Git tools you already have.

## What Gitly helps you do

- Save progress as clear, meaningful versions.
- See what is saved, unsaved, online, or at risk.
- Check whether the project still builds, tests, or lints successfully.
- Understand what changed between two versions.
- Recover a file or return to an earlier version safely.
- Experiment without breaking the working version.
- Connect a project to GitHub and create an online backup.
- Work in English, Hebrew, or another language your coding agent understands.

## Install Gitly

Install Gitly into the root of the project where you want to use it. Choose either the terminal method or the ZIP method; both install the same twelve skills.

### Option 1: One terminal command

Open Terminal in your project folder and run the command for your AI coding agent.

**Claude Code**

```sh
curl -fsSL https://raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh | sh -s -- claude-code
```

**Codex**

```sh
curl -fsSL https://raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh | sh -s -- codex
```

**Cursor**

```sh
curl -fsSL https://raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh | sh -s -- cursor
```

The installer downloads only the skill Markdown files and Gitly's shared operating contract. It inspects every destination before writing: new files are installed, identical files are left untouched, and a different existing Gitly file stops the entire installation before any change is made.

This method requires `curl` and a POSIX shell. It works on macOS, Linux, and Windows through WSL or Git Bash.

### Option 2: Download a ZIP

Download the package that matches your agent:

- [Claude Code ZIP](https://github.com/NirGeron98/Gitly/raw/refs/heads/main/website/public/downloads/gitly-claude-code.zip)
- [Codex ZIP](https://github.com/NirGeron98/Gitly/raw/refs/heads/main/website/public/downloads/gitly-codex.zip)
- [Cursor ZIP](https://github.com/NirGeron98/Gitly/raw/refs/heads/main/website/public/downloads/gitly-cursor.zip)

Leave the ZIP in Downloads, open your project in the matching coding agent, and paste this prompt:

> Install Gitly now in this currently open project from the newest Gitly ZIP (or its matching extracted folder) in my Downloads folder. Do not ask me to move it into the project. If Downloads access requires native permission, request it. Confirm the package matches this AI coding agent, extract it temporarily if needed, and read gitly-install/INSTALL.md. This message is my explicit approval to create missing directories and copy all new Gitly files without asking for another confirmation. For installation only, this approval supersedes any package-guide step that says to show me a plan or wait for approval. If every destination is missing or byte-for-byte identical, proceed immediately, verify the installation, clean up only temporary files you created, and report the result. Stop and ask me only if the package is invalid, targets another agent, or a destination file differs. Do not delete my downloaded package.

### Finish setup

Reload your coding agent after installation, then say:

> Set up Gitly

You can also say `הגדר את Gitly` in Hebrew. Gitly will inspect the project and explain what, if anything, still needs attention.

## Use Gitly naturally

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
| `gitly-setup` | Checks Git, identity, repository state, and ignore rules |
| `gitly-status` | Explains what is saved, unsaved, online, current, or at risk |
| `gitly-check` | Runs approved project checks and explains failures |
| `gitly-save` | Reviews exact changes and creates a meaningful local version |
| `gitly-history` | Shows searchable, human-readable past versions |
| `gitly-compare` | Compares versions or current work with evidence |
| `gitly-restore` | Restores selected files or reverts safely |
| `gitly-branches` | Creates and switches safe experiments |
| `gitly-merge` | Integrates finished work without guessing through conflicts |
| `gitly-github-connect` | Authenticates and creates or links GitHub repositories |
| `gitly-sync` | Fetches, fast-forward pulls, and non-force pushes |
| `gitly-settings` | Saves validated project preferences in `.gitly/config.md` |

## Where the files go

| Agent | Skills | Shared Gitly contract |
| --- | --- | --- |
| Claude Code | `.claude/skills/gitly-*/SKILL.md` | `.gitly/GITLY.md` |
| Codex | `.agents/skills/gitly-*/SKILL.md` | `.gitly/GITLY.md` |
| Cursor | `.cursor/skills/gitly-*/SKILL.md` | `.gitly/GITLY.md` |

Cursor can also discover compatible Claude Code and Codex project skills. If Gitly is already installed for one of those agents in the same project, you may not need a second Cursor installation.

## Safety model

Gitly is intentionally procedural:

1. Inspect the real project state.
2. Explain the proposed action and its consequences.
3. Ask for action-specific approval.
4. Recheck relevant state before making the change.
5. Execute only the approved action and verify the result.

Gitly does not use force push, hard reset, automatic conflict guessing, or chat-pasted GitHub tokens. Read-only skills can inspect without approval. Saving locally never silently authorizes uploading to GitHub.

Gitly is a set of agent instructions, not an executable security boundary. Your coding agent's native permissions remain the stronger control.

## Requirements

- Git is required for version workflows.
- [GitHub CLI](https://cli.github.com/) is required only for GitHub connection and sync workflows.
- Gitly itself requires no Python, Node.js, account, or background process.

## Update or remove Gitly

Run the same terminal installation command again to check for an update. Identical files are skipped; locally changed Gitly files cause a safe stop so you can review them first.

To remove Gitly, delete the twelve `gitly-*` skill folders from your agent's project skill directory and delete `.gitly/GITLY.md`. Keep `.gitly/config.md` if you want to preserve your preferences.

## Development

Canonical skills live in `packages/skills`, and `packages/shared/GITLY.md` is their shared contract. The website and agent-specific ZIPs are generated and verified from those sources.

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
