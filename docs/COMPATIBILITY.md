# Agent compatibility

Verified against official documentation available on 2026-10-23.

| Host | ZIP destination | Discovery | Invocation notes |
| --- | --- | --- | --- |
| Claude Code | `.claude/skills/navi-*/SKILL.md` | Native project skills | Automatic relevance or `/navi-save` style invocation |
| Codex | `.agents/skills/navi-*/SKILL.md` | Open Agent Skills project discovery | Automatic relevance or explicit `$navi-save` where supported |
| Cursor | `.cursor/skills/navi-*/SKILL.md` | Native project Agent Skills | Automatic relevance, `/navi-save`, or `@navi-save` |

Sources: [Claude Code skills](https://code.claude.com/docs/en/skills), [OpenAI Agent Skills](https://developers.openai.com/api/docs/guides/tools-skills), and [Cursor skills](https://cursor.com/help/customization/skills).

Cursor also discovers compatible `.claude/skills` and `.agents/skills` folders. If Navi is already installed for Claude Code or Codex in the same project, do not also copy the Cursor ZIP; Cursor can use the existing skills and this avoids duplicate names. When two agents genuinely need separate roots, generated definitions are identical, but updates must be applied consistently.

Native confirmation UI varies by host/version. Every skill supports a clear text fallback tied to the current displayed plan. This is workflow guidance, not cryptographic authorization.

## Validation matrix

| Capability | Automated | Still needs live validation |
| --- | --- | --- |
| Twelve manifests, metadata, safety sections, shared references | Yes | Automatic routing quality in each host |
| Claude/Codex/Cursor ZIP contents and destination mapping | Yes | Agent-guided installation in each host |
| No runtime/installer in downloads | Yes | Host terminal permission presentation |
| Settings schema and scenario coverage | Yes | Cross-chat behavior in each host |
| Website build and download availability | Yes | Full visual/device review |
| Git workflow guidance against disposable repositories | Static/scenario validation | Real agent execution and judgment |
| GitHub authentication | Documentation only | Browser login, SSO, repository creation, protected branches |
