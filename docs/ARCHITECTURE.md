# Skills-only architecture

```text
Natural-language request
          │
          ▼
  Host-native skill discovery
          │
          ├──► gitly-* / SKILL.md (one workflow)
          │            │
          │            └──► .gitly/GITLY.md (shared safety + config contract)
          │
          ▼
 Agent read-only inspection through its native terminal/tools
          │
          ▼
 Plain-language plan → explicit user approval → fresh state recheck
          │
          ▼
 Native Git / GitHub CLI action → verification → summary
```

Gitly has no execution layer. The host agent reads one relevant skill and the shared contract, then uses the terminal/tool permissions it already has. Skills are independent by responsibility and coordinate only at explicit workflow boundaries.

Project preferences live in `.gitly/config.md` only after the user approves a settings change. Missing configuration means defaults: local saves, five history items, private GitHub visibility, automatic response language, and confirmation always required. The file contains no credentials or machine-specific data.

Canonical sources live once under `packages/skills`. Development packaging copies them into a visible `gitly-install` staging folder with twelve `SKILL.md` files, `shared/GITLY.md`, and an agent-readable `INSTALL.md`. After explicit user approval, the selected host agent copies them into its official discovery root and `.gitly/GITLY.md`. Executable installers, runtimes, tests, and website source are excluded from downloads.
