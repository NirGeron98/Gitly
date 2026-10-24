import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const features = [
  ['Setup', 'Check Git readiness and prepare the project without technical guesswork.'],
  ['Status', 'See what is saved, unsaved, backed up, current, or at risk.'],
  ['Check', 'Verify the project with its own approved build, test, and lint commands.'],
  ['Save', 'Review exactly what changed, then create a clean local version.'],
  ['History', 'See past versions as a readable timeline, not a wall of hashes.'],
  ['Compare', 'Understand verified file changes and clearly labeled inferences.'],
  ['Restore', 'Return selected files safely, with a recovery checkpoint when needed.'],
  ['Experiments', 'Try an idea on a branch or in an isolated worktree.'],
  ['Merge', 'Bring good experiments home without guessing through conflicts.'],
  ['GitHub', 'Connect through the trusted GitHub CLI—never paste a token into chat.'],
  ['Sync', 'See what is local and online before any fetch, pull, or push.'],
  ['Settings', 'Keep language and workflow preferences inside this project.'],
]

const INSTALL_PROMPT = 'Install Navi now in this currently open project from the newest Navi ZIP (or its matching extracted folder) in my Downloads folder. Do not ask me to move it into the project. If Downloads access requires native permission, request it. Confirm the package matches this AI coding agent, extract it temporarily if needed, and read navi-install/INSTALL.md. This message is my explicit approval to create missing directories and copy all new Navi files without asking for another confirmation. For installation only, this approval supersedes any package-guide step that says to show me a plan or wait for approval. If every destination is missing or byte-for-byte identical, proceed immediately, verify the installation, clean up only temporary files you created, and report the result. Stop and ask me only if the package is invalid, targets another agent, or a destination file differs. Do not delete my downloaded package.'

export function Mark() {
  return <span className="mark" aria-hidden="true">
    <svg viewBox="0 0 32 32">
      <circle cx="7" cy="24" r="2.5" />
      <path d="M9.5 23c4.7-2.2 2.1-7.1 6.5-9.4 3.5-1.8 6.1-.1 9-6.6" />
      <path d="M19.5 7H25v5.5" />
    </svg>
  </span>
}

type Platform = 'claude' | 'codex' | 'cursor'

const TERMINAL_INSTALLS: Array<{ platform: Platform, name: string, command: string }> = [
  { platform: 'claude', name: 'Claude Code', command: 'curl -fsSL https://raw.githubusercontent.com/NirGeron98/Navi/main/install.sh | sh -s -- claude-code' },
  { platform: 'codex', name: 'Codex', command: 'curl -fsSL https://raw.githubusercontent.com/NirGeron98/Navi/main/install.sh | sh -s -- codex' },
  { platform: 'cursor', name: 'Cursor', command: 'curl -fsSL https://raw.githubusercontent.com/NirGeron98/Navi/main/install.sh | sh -s -- cursor' },
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

  return <div className="install-methods" id="download">
    <div className="install-tabs" role="tablist" aria-label="Choose an installation method">
      <button type="button" role="tab" aria-selected={method === 'terminal'} aria-controls="terminal-install" onClick={() => setMethod('terminal')}><span>01</span> Terminal <b>Fastest</b></button>
      <button type="button" role="tab" aria-selected={method === 'zip'} aria-controls="zip-install" onClick={() => setMethod('zip')}><span>02</span> Download ZIP</button>
    </div>

    {method === 'terminal' ? <div className="install-panel terminal-panel" id="terminal-install" role="tabpanel">
      <div className="install-panel-head"><div><span className="kicker">One command</span><h3>Install directly into your project.</h3></div><p>Open Terminal in your project folder, then run the command for your agent. No ZIP, moving files, or prompt needed.</p></div>
      <div className="command-grid">
        {TERMINAL_INSTALLS.map(({ platform, name, command }) => <article key={platform}>
          <h3><PlatformIcon platform={platform} />{name}</h3>
          <div className="command-line"><code>{command}</code><button type="button" aria-label={`Copy ${name} install command`} onClick={() => void navigator.clipboard?.writeText(command)}>Copy</button></div>
        </article>)}
      </div>
      <div className="terminal-steps"><span><b>1</b> Open your project folder in Terminal</span><span><b>2</b> Run the matching command</span><span><b>3</b> Reload your agent and say “Set up Navi”</span></div>
      <p className="install-note">Works on macOS, Linux, and Windows through WSL or Git Bash. The installer checks all destinations first and stops without changing anything if it finds a different existing Navi file.</p>
    </div> : <div className="install-panel zip-panel" id="zip-install" role="tabpanel">
      <div className="install-panel-head"><div><span className="kicker">Guided download</span><h3>Download a package for your agent.</h3></div><p>Prefer not to use Terminal? Download the ZIP and let your coding agent install it from Downloads.</p></div>
      <div className="install-grid">
        <div><h3><PlatformIcon platform="claude" />Claude Code</h3><a href="/downloads/navi-claude-code.zip" download>Download Claude Code ZIP →</a></div>
        <div><h3><PlatformIcon platform="codex" />Codex</h3><a href="/downloads/navi-codex.zip" download>Download Codex ZIP →</a></div>
        <div><h3><PlatformIcon platform="cursor" />Cursor</h3><a href="/downloads/navi-cursor.zip" download>Download Cursor ZIP →</a></div>
      </div>
      <div className="install-flow"><h3>Then install it with your agent.</h3><ol><li><b>01</b><span><strong>Leave it in Downloads</strong><small>No extracting, moving, or hidden folders.</small></span></li><li><b>02</b><span><strong>Open your project</strong><small>Use the same AI coding agent you downloaded for.</small></span></li><li><b>03</b><span><strong>Paste the prompt below</strong><small>Pasting it authorizes a clean installation.</small></span></li><li><b>04</b><span><strong>Install and reload</strong><small>Your agent installs, verifies, and reports—then reload it.</small></span></li></ol></div>
      <div className="install-prompt"><div><span>Paste this into your AI agent</span><button type="button" onClick={() => void navigator.clipboard?.writeText(INSTALL_PROMPT)}>Copy prompt</button></div><p>{INSTALL_PROMPT}</p></div>
      <p className="install-note">Your agent may still request one-time native permission to read Downloads. It proceeds immediately when destinations are new or identical, and asks only if it finds a conflict or an invalid package. If your browser saves elsewhere, paste the ZIP’s full path into chat.</p>
    </div>}
  </div>
}

export function App() {
  return <>
    <header className="nav">
      <a className="brand" href="#top"><Mark />Navi</a>
      <nav aria-label="Main navigation">
        <a href="#install">Install</a><a href="#how">How it works</a><a href="#safety">Safety</a>
      </nav>
      <a className="nav-cta" href="#download">Get Navi</a>
    </header>

    <main id="main">
      <section className="hero" id="top">
        <div className="glow glow-one" /><div className="glow glow-two" />
        <div className="eyebrow"><span /> Your guide through vibe coding</div>
        <h1>Just build.<br /><em>Navi handles the rest.</em></h1>
        <p className="lede">Describe what you want in natural language. Navi guides your coding agent through safe Git, project checks, recovery, and online backup—without requiring prior technical knowledge.</p>
        <div className="hero-install" id="install">
          <span className="kicker">Install Navi</span>
          <h2>Choose how you want to install.</h2>
          <InstallTabs />
        </div>
        <p className="requirements">Free & local-first · No Navi app or runtime · Git required · GitHub CLI only for GitHub features</p>

        <div className="conversation" id="how" aria-label="Example Navi approval conversation">
          <div className="window-bar"><span /><span /><span /><b>AI agent · your-project</b></div>
          <div className="messages">
            <div className="you"><small>You</small><p>Save my progress and back it up online.</p></div>
            <div className="navi"><small><Mark /> Navi</small><p>I found 3 changed files. I’ll save them locally as <strong>“Add weekly focus view”</strong>, then upload <strong>main</strong> to <strong>origin</strong>.</p><ul><li><span>✓</span> No likely secrets or large files found</li><li><span>!</span> This creates one local version and updates GitHub</li></ul><div className="approval"><code>APPROVE PLAN A7C2</code><span>Chat approval · current state only</span></div></div>
          </div>
        </div>
      </section>

      <section className="strip" aria-label="Principles"><span>Natural language</span><i /> <span>No prior Git knowledge</span><i /> <span>Local by default</span><i /> <span>English + עברית</span></section>

      <section className="section examples">
        <div className="section-head"><span className="kicker">Say it your way</span><h2>No commands to memorize.</h2></div>
        <div className="example-grid"><div><span>EN</span><blockquote>“Try a new dashboard without affecting the working version.”</blockquote><blockquote>“What changed between version 2 and version 5?”</blockquote><blockquote>“From now on, only save locally.”</blockquote></div><div dir="rtl"><span>עב</span><blockquote>״תנסה עיצוב חדש בלי לפגוע בגרסה הקיימת.״</blockquote><blockquote>״מה השתנה בין גרסה 2 לגרסה 5?״</blockquote><blockquote>״מעכשיו תשמור רק מקומית.״</blockquote></div></div>
      </section>

      <section className="section feature-section">
        <div className="section-head"><span className="kicker">Twelve guided workflows</span><h2>One clear route forward.</h2></div>
        <div className="feature-grid">{features.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="section history-preview">
        <div><span className="kicker">Human-readable history</span><h2>Your work,<br />as a story.</h2><p>Git remains the source of truth. Navi adds readable dates and summaries without inventing behavior.</p></div>
        <div className="timeline">
          <article><i /><small>Today, 14:32 · 8d7c1a2b</small><h3>Add weekly focus view</h3><p>3 files changed · local + GitHub</p></article>
          <article><i /><small>Yesterday, 18:06 · e21af093</small><h3>Polish mobile navigation</h3><p>5 files changed · local</p></article>
          <article><i /><small>Mon, 10:11 · 03bc772e</small><h3>First working dashboard</h3><p>12 files changed · local + GitHub</p></article>
        </div>
      </section>

      <section className="section safety" id="safety">
        <div className="shield"><Mark /><span>Local-first<br />by design</span></div>
        <div><span className="kicker">Safety by clear procedure</span><h2>A deliberate pause before anything changes.</h2><p>Read-only skills can inspect safely. Before any change, Navi requires a plain-language plan, explicit approval, a fresh state check, and result verification.</p><div className="safety-grid"><p><b>Fresh state checks</b>Changed files, branches, or remotes require a new plan.</p><p><b>Action-specific approval</b>A save never silently authorizes a push.</p><p><b>No destructive shortcuts</b>No force push, hard reset, clean, or guessed conflicts.</p><p><b>No secret storage</b>Credentials stay with Git and GitHub CLI.</p></div><aside>Honest boundary: Navi is a set of agent instructions, not executable enforcement. A host agent with terminal access can bypass Markdown. Use the host’s native permission controls for a stronger boundary.</aside></div>
      </section>

      <section className="section faq"><div className="section-head"><span className="kicker">Questions, answered</span><h2>FAQ</h2></div><div className="faq-list">
        <details><summary>Does Navi upload my code?</summary><p>No. Navi adds instructions to your project. Code reaches GitHub only after an approved push, using your existing Git/GitHub authentication.</p></details>
        <details><summary>Do I need to know Git?</summary><p>No. Navi explains normal workflows in everyday language. Experts can still use Git vocabulary.</p></details>
        <details><summary>What if Git or GitHub CLI is missing?</summary><p>The setup skill reports exactly what is missing and guides you to official installation steps. Git is required for versioning; GitHub CLI is needed only for GitHub features. Navi itself has no runtime.</p></details>
        <details><summary>What if an AI change broke my project?</summary><p>Navi checks the current project first and explains the evidence without changing anything. It restores an earlier version only when you explicitly ask to go back.</p></details>
        <details><summary>Why did Navi ask for approval again?</summary><p>Your files, branch, remote, or intended action may have changed. The skills require a fresh plan instead of treating an earlier “yes” as permanent permission.</p></details>
        <details><summary>How do I update or remove Navi?</summary><p>Review and replace only the <code>navi-*</code> skill folders and <code>.navi/NAVI.md</code>. To remove it, delete those same files. Keep <code>.navi/config.md</code> if you want to preserve preferences.</p></details>
      </div></section>

      <section className="final-cta"><Mark /><h2>Choose the destination.<br /><em>Navi guides the route.</em></h2><div className="actions"><a className="button primary" href="#install">Choose your agent <span aria-hidden="true">↑</span></a></div></section>
    </main>
    <footer><a className="brand" href="#top"><Mark />Navi</a><p>Natural-language guidance for safer software development.</p><p>Open package · No hosted backend</p></footer>
  </>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
