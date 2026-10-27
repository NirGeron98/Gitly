import { StrictMode, useRef, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const features: [string, string, string, string, string][] = [
  ['Setup', 'Check Git readiness and prepare the project without technical guesswork.', 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 3.1a7.4 7.4 0 0 0-1.7 1l-2.3-1-2 3.4L6.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.4 7.4 0 0 0 1.7 1L11 21h4l.4-3.1a7.4 7.4 0 0 0 1.7-1l2.3 1 2-3.4z', '“Get this project ready.”', 'Git found · repository created · ready'],
  ['Status', 'See what is saved, unsaved, backed up, current, or at risk.', 'M3 12h4l3-8 4 16 3-8h4', '“Where do things stand?”', '3 unsaved files · 1 version not on GitHub'],
  ['Check', 'Verify the project with its own approved build, test, and lint commands.', 'M5 12.5l4.5 4.5L19 7.5', '“Make sure nothing is broken.”', 'Build ✓ · Tests ✓ · Lint ✓'],
  ['Save', 'Review exactly what changed, then create a clean local version.', 'M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6', '“Save my progress.”', 'Saved: “Add weekly focus view”'],
  ['History', 'See past versions as a readable timeline, not a wall of hashes.', 'M12 7v5l3 2M4 12a8 8 0 1 0 2.6-5.9M4 4v4h4', '“Show me what happened this week.”', 'Today · Yesterday · Mon — one line each'],
  ['Compare', 'Understand verified file changes and clearly labeled inferences.', 'M8 4v16M16 4v16M4 8l4-4 4 4M12 16l4 4 4-4', '“What changed between version 2 and 5?”', '4 files changed · header redesigned'],
  ['Restore', 'Return selected files safely, with a recovery checkpoint when needed.', 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3', '“Go back to how app.css was yesterday.”', 'Checkpoint saved · app.css restored'],
  ['Experiments', 'Try an idea on a branch or in an isolated worktree.', 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3', '“Try a new dashboard safely.”', 'Branch “new-dashboard” · main untouched'],
  ['Merge', 'Bring good experiments home without guessing through conflicts.', 'M6 4v6a4 4 0 0 0 4 4h4M6 4a1.5 1.5 0 1 0 0 .01M6 20V10M18 14a1.5 1.5 0 1 0 0 .01M6 20a1.5 1.5 0 1 0 0 .01', '“Keep the new dashboard.”', 'Merged cleanly · 0 conflicts'],
  ['GitHub', 'Connect through the trusted GitHub CLI—never paste a token into chat.', 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5a4.2 4.2 0 0 1-.5 8.5H7zM12 16v-5M9.5 13l2.5-2.500 2.500 2.500', '“Connect this project to GitHub.”', 'Signed in via GitHub CLI · no token shared'],
  ['Sync', 'See what is local and online before any fetch, pull, or push.', 'M4 10a8 8 0 0 1 14-3l2 2M20 4v5h-5M20 14a8 8 0 0 1-14 3l-2-2M4 20v-5h5', '“Is my work backed up?”', '2 versions ahead · nothing to download'],
  ['Settings', 'Keep language and workflow preferences inside this project.', 'M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4', '“From now on, only save locally.”', 'Preference saved in this project'],
]

const INSTALL_PROMPT = 'Install Gitly now in this currently open project from the newest Gitly ZIP (or its matching extracted folder) in my Downloads folder. Do not ask me to move it into the project. If Downloads access requires native permission, request it. Confirm the package matches this AI coding agent, extract it temporarily if needed, and read gitly-install/INSTALL.md. This message is my explicit approval to create missing directories and copy all new Gitly files without asking for another confirmation. For installation only, this approval supersedes any package-guide step that says to show me a plan or wait for approval. If every destination is missing or byte-for-byte identical, proceed immediately, verify the installation, clean up only temporary files you created, and report the result. Stop and ask me only if the package is invalid, targets another agent, or a destination file differs. Do not delete my downloaded package.'

const VIBE_MD = 'https://www.vibe-md.dev'
const REPOSITORY = 'https://github.com/NirGeron98/Gitly'

const ICONS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  check: 'M20 6 9 17l-5-5',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4',
}

function Icon({ d }: { d: string }) {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
}

function GitHubIcon() {
  return <svg className="icon icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" /></svg>
}

function LinkedInIcon() {
  return <svg className="icon icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
}

function PlayIcon() {
  return <svg className="icon icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" /></svg>
}

export function Mark() {
  return <span className="mark" aria-hidden="true">
    <svg viewBox="0 0 32 32">
      <circle cx="8" cy="7" r="2.5" />
      <circle cx="8" cy="25" r="2.5" />
      <circle cx="24" cy="8" r="2.5" />
      <path d="M8 9.5v13" />
      <path d="M24 10.5v1c0 4.7-3.8 8.5-8.5 8.5H8" />
    </svg>
  </span>
}

function BrandLockup() {
  return <div className="brand">
    <a className="brand-home" href={VIBE_MD} aria-label="vibe.md home"><span className="brand-badge" aria-hidden="true">~/</span><span className="brand-name">vibe.md</span></a>
    <span className="brand-sep" aria-hidden="true">/</span>
    <a className="brand-sub" href="#top">gitly</a>
  </div>
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch { /* storage unavailable: theme still applies for this visit */ }
    setDark(next)
  }

  return <button type="button" className="icon-button" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggle}><Icon d={dark ? ICONS.sun : ICONS.moon} /></button>
}

function CopyButton({ text, label, children = 'Copy' }: { text: string, label: string, children?: ReactNode }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return <button type="button" className="copy-button" aria-label={label} onClick={copy}>{copied ? <><Icon d={ICONS.check} />Copied</> : children}</button>
}

type Platform = 'claude' | 'codex' | 'cursor'

const TERMINAL_INSTALLS: Array<{ platform: Platform, name: string, command: string }> = [
  { platform: 'claude', name: 'Claude Code', command: 'curl -fsSL https://raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh | sh -s -- claude-code' },
  { platform: 'codex', name: 'Codex', command: 'curl -fsSL https://raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh | sh -s -- codex' },
  { platform: 'cursor', name: 'Cursor', command: 'curl -fsSL https://raw.githubusercontent.com/NirGeron98/Gitly/main/install.sh | sh -s -- cursor' },
]

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === 'claude') {
    return <svg className="platform-icon claude-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m4.714 15.956 4.718-2.648.079-.23-.079-.128h-.231l-2.696-.073-2.337-.097-2.265-.121-.57-.122-.535-.704.055-.352.48-.322.685.061 1.518.103 2.277.158 1.651.097 2.447.255h.388l.055-.158-.134-.097-.103-.097-2.228-1.548-2.55-1.688-1.336-.971-.722-.492-.365-.461-.158-1.008.656-.722.88.06.225.061.893.686 1.906 1.476 2.49 1.833.364.304.146-.103.018-.073-.164-.273-1.354-2.447-1.445-2.489-.644-1.032-.17-.619c-.06-.255-.103-.468-.103-.729L6.287.134 6.7 0l.996.134.419.364.619 1.415 1.002 2.228 1.554 3.03.455.898.243.832.091.255h.158v-.146l.128-1.706.236-2.095.231-2.696.079-.759.376-.91.747-.492.583.279.48.686-.067.443-.286 1.852-.558 2.902-.364 1.943h.212l.243-.243.984-1.305 1.651-2.064.729-.82.85-.905.546-.431h1.032l.759 1.13-.34 1.165-1.062 1.348-.881 1.141-1.263 1.7-.789 1.36.073.11.188-.019 2.854-.607 1.542-.279 1.839-.316.832.389.091.394-.328.808-1.967.486-2.307.461-3.436.814-.043.03.049.061 1.548.146.662.036h1.621l3.017.225.79.522.473.637-.079.486-1.214.619-1.639-.389-3.825-.91-1.312-.328h-.182v.109l1.093 1.069 2.004 1.809 2.507 2.331.128.577-.322.455-.34-.048-2.204-1.658-.85-.747-1.925-1.621h-.127v.17l.443.65 2.343 3.521.122 1.081-.17.352-.607.213-.668-.122-1.372-1.924L14.38 17.959l-1.141-1.943-.14.08-.674 7.254-.316.37-.728.28-.607-.461-.322-.747.322-1.475.388-1.925.316-1.53.285-1.9.17-.632-.012-.042-.14.018-1.432 1.967-2.18 2.945-1.724 1.846-.413.164-.716-.37.067-.662.4-.589 2.386-3.036 1.44-1.882.928-1.087-.006-.158h-.055l-6.338 4.117-1.13.145-.485-.455.06-.746.231-.243 1.907-1.312Z" /></svg>
  }

  if (platform === 'codex') {
    return <svg className="platform-icon codex-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.182a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.096 5.98 5.98 0 0 0 .511 4.911 6.051 6.051 0 0 0 6.514 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073Zm-9.022 12.608a4.476 4.476 0 0 1-2.877-1.04l.142-.081 4.778-2.758a.795.795 0 0 0 .393-.682v-6.736l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494ZM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.758a.771.771 0 0 0 .78 0l5.843-3.368v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.499 4.499 0 0 1-6.14-1.646ZM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.677l5.814 3.354-2.02 1.169a.076.076 0 0 1-.071 0l-4.83-2.787A4.504 4.504 0 0 1 2.34 7.872Zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.104v-5.677a.79.79 0 0 0-.407-.667Zm2.011-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.499 4.499 0 0 1 6.68 4.66ZM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.039-.056V6.074a4.499 4.499 0 0 1 7.376-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681Zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z" /></svg>
  }

  return <svg className="platform-icon cursor-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" /></svg>
}

function InstallTabs() {
  const [method, setMethod] = useState<'terminal' | 'zip'>('terminal')

  return <div className="install-card" id="download">
    <div className="install-tabs" role="tablist" aria-label="Choose an installation method">
      <button type="button" role="tab" aria-selected={method === 'terminal'} aria-controls="terminal-install" onClick={() => setMethod('terminal')}><span>01</span> Terminal <b>Fastest</b></button>
      <button type="button" role="tab" aria-selected={method === 'zip'} aria-controls="zip-install" onClick={() => setMethod('zip')}><span>02</span> Download ZIP</button>
    </div>

    {method === 'terminal' ? <div className="install-panel" id="terminal-install" role="tabpanel">
      <div className="install-panel-head"><div><p className="eyebrow">One command</p><h3>Install directly into your project.</h3></div><p>Open Terminal in your project folder, then run the command for your agent. No ZIP, moving files, or prompt needed.</p></div>
      <div className="command-grid">
        {TERMINAL_INSTALLS.map(({ platform, name, command }) => <article key={platform}>
          <h4 className="agent-name"><PlatformIcon platform={platform} />{name}</h4>
          <div className="command-line dark"><code><span aria-hidden="true">$ </span>{command}</code><CopyButton text={command} label={`Copy ${name} install command`} /></div>
        </article>)}
      </div>
      <ol className="steps"><li><b>1</b>Open your project folder in Terminal</li><li><b>2</b>Run the matching command</li><li><b>3</b>Reload your agent and say “Set up Gitly”</li></ol>
      <p className="note"><Icon d={ICONS.info} /><span>Works on macOS, Linux, and Windows through WSL or Git Bash. The installer checks all destinations first and stops without changing anything if it finds a different existing Gitly file.</span></p>
    </div> : <div className="install-panel" id="zip-install" role="tabpanel">
      <div className="install-panel-head"><div><p className="eyebrow">Guided download</p><h3>Download a package for your agent.</h3></div><p>Prefer not to use Terminal? Download the ZIP and let your coding agent install it from Downloads.</p></div>
      <div className="download-grid">
        <article><h4 className="agent-name"><PlatformIcon platform="claude" />Claude Code</h4><p>gitly-claude-code.zip</p><a className="button button-outline" href="/downloads/gitly-claude-code.zip" download><Icon d={ICONS.download} />Download Claude Code ZIP</a></article>
        <article><h4 className="agent-name"><PlatformIcon platform="codex" />Codex</h4><p>gitly-codex.zip</p><a className="button button-outline" href="/downloads/gitly-codex.zip" download><Icon d={ICONS.download} />Download Codex ZIP</a></article>
        <article><h4 className="agent-name"><PlatformIcon platform="cursor" />Cursor</h4><p>gitly-cursor.zip</p><a className="button button-outline" href="/downloads/gitly-cursor.zip" download><Icon d={ICONS.download} />Download Cursor ZIP</a></article>
      </div>
      <div className="install-flow"><h4>Then install it with your agent.</h4><ol><li><b>01</b><span><strong>Leave it in Downloads</strong><small>No extracting, moving, or hidden folders.</small></span></li><li><b>02</b><span><strong>Open your project</strong><small>Use the same AI coding agent you downloaded for.</small></span></li><li><b>03</b><span><strong>Paste the prompt below</strong><small>Pasting it authorizes a clean installation.</small></span></li><li><b>04</b><span><strong>Install and reload</strong><small>Your agent installs, verifies, and reports—then reload it.</small></span></li></ol></div>
      <div className="install-prompt"><div><span>Paste this into your AI agent</span><CopyButton text={INSTALL_PROMPT} label="Copy install prompt">Copy prompt</CopyButton></div><p>{INSTALL_PROMPT}</p></div>
      <p className="note"><Icon d={ICONS.info} /><span>Your agent may still request one-time native permission to read Downloads. It proceeds immediately when destinations are new or identical, and asks only if it finds a conflict or an invalid package. If your browser saves elsewhere, paste the ZIP’s full path into chat.</span></p>
    </div>}
  </div>
}

function HeroSession() {
  return <div className="terminal dark" aria-label="Illustrative Gitly session">
    <div className="term-bar"><span className="term-dots" aria-hidden="true"><i /><i /><i /></span><span className="term-tab">~/your-project</span><span className="term-tab">skill: gitly</span></div>
    <div className="term-body">
      <p><span className="t-who">you ›</span> Save my progress and back it up online.</p>
      <p><span className="t-who t-agent">agent ›</span> I found 3 changed files. Here’s the plan:</p>
      <ol className="t-plan"><li>Save them locally as <strong>“Add weekly focus view”</strong></li><li>Upload <strong>main</strong> to <strong>origin</strong> on GitHub</li></ol>
      <p className="t-meta"><span className="t-ok">✓</span> No likely secrets or large files found</p>
      <p className="t-meta"><span className="t-warn">!</span> This creates one local version and updates GitHub</p>
      <p className="t-approve"><span><span className="t-who">you ›</span> APPROVE PLAN A7C2</span><small>current state only</small></p>
      <p className="t-cmd"><span>$</span> git commit -m "Add weekly focus view"</p>
      <p className="t-cmd"><span>$</span> git push origin main</p>
      <p className="t-done">✓ Saved 8d7c1a2 · backed up to origin/main<span className="caret" aria-hidden="true" /></p>
    </div>
    <div className="term-foot"><span><i />main</span><span>illustrative session</span></div>
  </div>
}

function PromoVideo() {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  return <div className="promo-video">
    <video ref={video} src="/gitly-promo.mp4" poster="/gitly-promo-poster.jpg" controls={started} playsInline preload="none" onPlay={() => setStarted(true)} aria-label="30-second Gitly product tour" />
    {!started && <button type="button" className="promo-play" onClick={() => void video.current?.play()}><PlayIcon />Watch the 30-second tour</button>}
  </div>
}

function SectionHead({ eyebrow, title, text, id }: { eyebrow: string, title: ReactNode, text?: string, id?: string }) {
  return <div className="section-head"><p className="eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2>{text && <p className="lede">{text}</p>}</div>
}

export function App() {
  return <>
    <header className="site-header">
      <div className="container">
        <BrandLockup />
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#install">Install</a><a href="#watch">Watch</a><a href="#workflows">Workflows</a><a href="#safety">Safety</a><a href="#faq">FAQ</a>
        </nav>
        <div className="header-actions">
          <a className="icon-button" href={REPOSITORY} aria-label="Gitly on GitHub"><GitHubIcon /></a>
          <ThemeToggle />
          <a className="button-sm" href="#install"><Icon d={ICONS.download} />Install</a>
        </div>
      </div>
    </header>

    <main id="main">
      <section className="hero" id="top">
        <div className="bg-grid" aria-hidden="true" /><div className="hero-wash" aria-hidden="true" />
        <div className="container hero-inner">
          <div>
            <a className="hero-pill" href={`${VIBE_MD}/skills`}><b>vibe.md skill</b>Your guide through vibe coding<Icon d={ICONS.arrow} /></a>
            <h1>Just build. <span className="gradient-text">Gitly handles the rest.</span></h1>
            <p className="hero-lede">Describe what you want in natural language. Gitly guides your coding agent through safe Git, project checks, recovery, and online backup—without requiring prior technical knowledge.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#install">Install Gitly <Icon d={ICONS.arrow} /></a>
              <a className="button button-outline" href="#watch"><PlayIcon />Watch the tour</a>
            </div>
            <p className="hero-note">Free & local-first · No Gitly app or runtime</p>
          </div>
          <HeroSession />
        </div>
      </section>

      <section className="principles" aria-label="Principles"><div className="container"><span>Natural language</span><span>No prior Git knowledge</span><span>Local by default</span><span>English + עברית</span></div></section>

      <section className="section tinted" id="install" aria-labelledby="install-title">
        <div className="container">
          <SectionHead eyebrow="Install Gitly" id="install-title" title="Choose how you want to install." text="Git is required. GitHub CLI is needed only for GitHub features. There is no Gitly app or runtime to keep running." />
          <InstallTabs />
        </div>
      </section>

      <section className="section" id="watch" aria-labelledby="watch-title">
        <div className="container">
          <SectionHead eyebrow="See it in action" id="watch-title" title="Gitly in 30 seconds." text="Save your progress, back it up to GitHub, and try new ideas—just by asking your coding assistant." />
          <PromoVideo />
        </div>
      </section>

      <section className="section tinted" aria-labelledby="examples-title">
        <div className="container">
          <SectionHead eyebrow="Say it your way" id="examples-title" title="No commands to memorize." text="Ask in everyday English or Hebrew. Gitly turns it into the right Git workflow." />
          <div className="example-grid">
            <article className="example-card"><header><span>English</span><b>EN</b></header><ul><li>“Try a new dashboard without affecting the working version.”</li><li>“What changed between version 2 and version 5?”</li><li>“From now on, only save locally.”</li></ul></article>
            <article className="example-card" dir="rtl" lang="he"><header><span>עברית</span><b>עב</b></header><ul><li>״תנסה עיצוב חדש בלי לפגוע בגרסה הקיימת.״</li><li>״מה השתנה בין גרסה 2 לגרסה 5?״</li><li>״מעכשיו תשמור רק מקומית.״</li></ul></article>
          </div>
        </div>
      </section>

      <section className="section" id="workflows" aria-labelledby="workflows-title">
        <div className="container">
          <SectionHead eyebrow="Twelve guided workflows" id="workflows-title" title="One clear route forward." text="Hover or tap a workflow to see what you say and what Gitly shows back." />
          <div className="workflow-grid">{features.map(([title, text, icon, say, result], index) => <article key={title} tabIndex={0}>
            <div className="workflow-top"><span className="icon-box"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon} /></svg></span><span className="workflow-num">{String(index + 1).padStart(2, '0')}</span></div>
            <h3>{title}</h3><p>{text}</p>
            <div className="workflow-pop"><small>You say</small><q>{say.replace(/[“”]/g, '')}</q><small>Gitly shows</small><b>{result}</b></div>
          </article>)}</div>
        </div>
      </section>

      <section className="section tinted" aria-labelledby="history-title">
        <div className="container history">
          <div><p className="eyebrow">Human-readable history</p><h2 id="history-title">Your work, as a story.</h2><p className="lede">Git remains the source of truth. Gitly adds readable dates and summaries without inventing behavior.</p></div>
          <div className="timeline-card">
            <div className="timeline-head"><span>History</span><span><i />main</span></div>
            <ol className="timeline">
              <li><small>Today, 14:32 · 8d7c1a2b</small><h3>Add weekly focus view</h3><p>3 files changed · local + GitHub</p></li>
              <li><small>Yesterday, 18:06 · e21af093</small><h3>Polish mobile navigation</h3><p>5 files changed · local</p></li>
              <li><small>Mon, 10:11 · 03bc772e</small><h3>First working dashboard</h3><p>12 files changed · local + GitHub</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="safety" aria-labelledby="safety-title">
        <div className="container safety">
          <div>
            <p className="eyebrow">Safety by clear procedure</p>
            <h2 id="safety-title">A deliberate pause before anything changes.</h2>
            <p className="lede">Read-only skills can inspect safely. Before any change, Gitly requires a plain-language plan, explicit approval, a fresh state check, and result verification.</p>
            <aside className="note"><Icon d={ICONS.info} /><span><strong>Honest boundary:</strong> Gitly is a set of agent instructions, not executable enforcement. A host agent with terminal access can bypass Markdown. Use the host’s native permission controls for a stronger boundary.</span></aside>
          </div>
          <div className="guard-card">
            <div className="guard-head"><Mark /><span><strong>Local-first by design</strong><small>Every change follows the same route</small></span></div>
            <ol className="track"><li><i /><small>01</small>Plan</li><li><i /><small>02</small>Approve</li><li><i /><small>03</small>Re-check</li><li><i /><small>04</small>Verify</li></ol>
            <ul className="guard-list">
              <li><span className="check"><Icon d={ICONS.check} /></span><div><strong>Fresh state checks</strong><p>Changed files, branches, or remotes require a new plan.</p></div></li>
              <li><span className="check"><Icon d={ICONS.check} /></span><div><strong>Action-specific approval</strong><p>A save never silently authorizes a push.</p></div></li>
              <li><span className="check"><Icon d={ICONS.check} /></span><div><strong>No destructive shortcuts</strong><p>No force push, hard reset, clean, or guessed conflicts.</p></div></li>
              <li><span className="check"><Icon d={ICONS.check} /></span><div><strong>No secret storage</strong><p>Credentials stay with Git and GitHub CLI.</p></div></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section tinted" id="faq" aria-labelledby="faq-title">
        <div className="container faq">
          <div><p className="eyebrow">Questions, answered</p><h2 id="faq-title">FAQ</h2><p className="lede">Short answers about privacy, setup, recovery, and approvals.</p></div>
          <div className="faq-list">
            <details><summary>Does Gitly upload my code?</summary><p>No. Gitly adds instructions to your project. Code reaches GitHub only after an approved push, using your existing Git/GitHub authentication.</p></details>
            <details><summary>Do I need to know Git?</summary><p>No. Gitly explains normal workflows in everyday language. Experts can still use Git vocabulary.</p></details>
            <details><summary>What if Git or GitHub CLI is missing?</summary><p>The setup skill reports exactly what is missing and guides you to official installation steps. Git is required for versioning; GitHub CLI is needed only for GitHub features. Gitly itself has no runtime.</p></details>
            <details><summary>What if an AI change broke my project?</summary><p>Gitly checks the current project first and explains the evidence without changing anything. It restores an earlier version only when you explicitly ask to go back.</p></details>
            <details><summary>Why did Gitly ask for approval again?</summary><p>Your files, branch, remote, or intended action may have changed. The skills require a fresh plan instead of treating an earlier “yes” as permanent permission.</p></details>
            <details><summary>How do I update or remove Gitly?</summary><p>Review and replace only the <code>gitly-*</code> skill folders and <code>.gitly/GITLY.md</code>. To remove it, delete those same files. Keep <code>.gitly/config.md</code> if you want to preserve preferences.</p></details>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="bg-grid" aria-hidden="true" /><div className="hero-wash" aria-hidden="true" />
            <div className="cta-content">
              <Mark />
              <h2>Choose the destination. <span className="gradient-text">Gitly guides the route.</span></h2>
              <p>Gitly is the first skill on vibe.md. More skills for testing, debugging, and deployment are on the way.</p>
              <div className="cta-actions"><a className="button button-primary" href="#install">Choose your agent <Icon d={ICONS.arrow} /></a><a className="button button-outline" href={`${VIBE_MD}/skills`}>Browse all skills</a></div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand"><BrandLockup /><p>Natural-language guidance for safer software development.</p></div>
        <nav aria-label="Gitly"><p className="footer-title">Gitly</p><ul><li><a href="#install">Install</a></li><li><a href="#workflows">Workflows</a></li><li><a href="#safety">Safety</a></li><li><a href="#faq">FAQ</a></li><li><a href={REPOSITORY}>Source code</a></li></ul></nav>
        <nav aria-label="vibe.md"><p className="footer-title">vibe.md</p><ul><li><a href={`${VIBE_MD}/skills`}>Skills directory</a></li><li><a href={`${VIBE_MD}/#how-it-works`}>How it works</a></li><li><a href={`${VIBE_MD}/about`}>About</a></li><li><a href={`${VIBE_MD}/submit`}>Submit a skill</a></li></ul></nav>
        <div><p className="footer-title">Contact</p><ul><li><a href="https://www.linkedin.com/in/adi-ber-a151841b2"><LinkedInIcon />Adi Ber</a></li><li><a href="https://www.linkedin.com/in/nir-geron-459711208"><LinkedInIcon />Nir Geron</a></li></ul></div>
      </div>
      <div className="footer-bottom"><div className="container"><p>© vibe.md. Open-source AI agent skills.</p><p className="mono">Open package · No hosted backend</p></div></div>
    </footer>
  </>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
