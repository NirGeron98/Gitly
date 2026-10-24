#!/bin/sh
set -eu

agent=${1:-}

case "$agent" in
  claude-code) skill_root=".claude/skills" ;;
  codex) skill_root=".agents/skills" ;;
  cursor) skill_root=".cursor/skills" ;;
  *)
    echo "Usage: curl -fsSL https://raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh | sh -s -- claude-code|codex|cursor" >&2
    exit 2
    ;;
esac

if ! command -v curl >/dev/null 2>&1; then
  echo "Gitly needs curl for this installation method. Use the ZIP option instead." >&2
  exit 1
fi

project_dir=$(pwd -P)
if [ "$project_dir" = "/" ] || [ "$project_dir" = "${HOME:-}" ]; then
  echo "Open your project folder in the terminal before installing Gitly." >&2
  exit 1
fi

source_url=${GITLY_SOURCE_URL:-https://raw.githubusercontent.com/NirGeron98/Gitly/main}
temp_dir=$(mktemp -d "${TMPDIR:-/tmp}/gitly-install.XXXXXX")

cleanup() {
  if [ -n "${temp_dir:-}" ] && [ -d "$temp_dir" ]; then
    rm -rf "$temp_dir"
  fi
}
trap cleanup EXIT HUP INT TERM

skills="
gitly-branches
gitly-check
gitly-compare
gitly-github-connect
gitly-history
gitly-merge
gitly-restore
gitly-save
gitly-settings
gitly-setup
gitly-status
gitly-sync
"

mkdir -p "$temp_dir/skills" "$temp_dir/shared"
for name in $skills; do
  mkdir -p "$temp_dir/skills/$name"
  curl -fsSL "$source_url/packages/skills/$name/SKILL.md" -o "$temp_dir/skills/$name/SKILL.md"
done
curl -fsSL "$source_url/packages/shared/GITLY.md" -o "$temp_dir/shared/GITLY.md"

conflicts=""
for name in $skills; do
  destination="$skill_root/$name/SKILL.md"
  if [ -e "$destination" ] && { [ ! -f "$destination" ] || ! cmp -s "$temp_dir/skills/$name/SKILL.md" "$destination"; }; then
    conflicts="$conflicts
  - $destination"
  fi
done

shared_destination=".gitly/GITLY.md"
if [ -e "$shared_destination" ] && { [ ! -f "$shared_destination" ] || ! cmp -s "$temp_dir/shared/GITLY.md" "$shared_destination"; }; then
  conflicts="$conflicts
  - $shared_destination"
fi

if [ -n "$conflicts" ]; then
  echo "Gitly stopped before making changes because these files already differ:$conflicts" >&2
  echo "Review or remove those Gitly files, then run the command again." >&2
  exit 1
fi

installed=0
for name in $skills; do
  destination="$skill_root/$name/SKILL.md"
  if [ ! -e "$destination" ]; then
    mkdir -p "$skill_root/$name"
    cp "$temp_dir/skills/$name/SKILL.md" "$destination"
    installed=$((installed + 1))
  fi
done

if [ ! -e "$shared_destination" ]; then
  mkdir -p ".gitly"
  cp "$temp_dir/shared/GITLY.md" "$shared_destination"
  installed=$((installed + 1))
fi

if [ "$installed" -eq 0 ]; then
  echo "Gitly is already up to date for $agent in $project_dir."
else
  echo "Installed Gitly for $agent in $project_dir ($installed files)."
fi
echo "Reload your AI coding agent, then say: Set up Gitly"
