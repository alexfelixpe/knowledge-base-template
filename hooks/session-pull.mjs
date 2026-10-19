/**
 * Claude Code SessionStart hook: keep the knowledge-repo clone on its current
 * main without anyone remembering to pull.
 *
 * Finds its repo from its own file location and pulls it. If it is on main and clean, runs
 * `git pull --ff-only`, unless it is already ahead of origin (a local commit
 * not yet pushed), in which case it says so instead of pulling. If it is on
 * a branch, or has local changes, it does not touch it and says so, because
 * branch content is not approved knowledge. Whatever this prints on stdout
 * is added to the session context, so it stays short.
 */
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// SSH must fail fast and never prompt: an offline machine or a missing key
// costs a few seconds, not a hung session start.
const env = { ...process.env, GIT_SSH_COMMAND: 'ssh -o BatchMode=yes -o ConnectTimeout=5', GIT_TERMINAL_PROMPT: '0' };
const git = (dir, args) => execSync(`git -C "${dir}" ${args}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], env, timeout: 20000 }).trim();

/**
 * Pull one clone on main, ff-only, and return the one-line note it prints
 * today, or null when the pull happened and nothing needs saying. Never
 * throws: every failure becomes a note instead of blocking the session start.
 */
function pullClone(dir, label) {
  try {
    const branch = git(dir, 'rev-parse --abbrev-ref HEAD');
    const dirty = git(dir, 'status --porcelain');
    if (branch !== 'main') {
      return `${label}: clone is on branch "${branch}", not pulled. Branch content is not approved knowledge.\n`;
    }
    if (dirty) {
      return `${label}: clone has local changes, not pulled.\n`;
    }
    let ahead = '0';
    try { ahead = git(dir, 'rev-list --count @{upstream}..HEAD'); } catch { ahead = '0'; }
    if (ahead !== '0') {
      return `${label}: main has ${ahead} local commit(s) not on origin (not pushed yet; run git status in ${dir}).\n`;
    }
    // Network can be slow or absent; a failed pull must never block the session.
    try {
      git(dir, 'pull --ff-only --quiet');
    } catch {
      return `${label}: pull failed (offline?), using the local copy.\n`;
    }
    return null;
  } catch {
    return `${label}: ${dir} is not a git clone.\n`;
  }
}

// The repo is the parent of the hooks folder this script lives in, so several
// installs from this template never point at each other's clone.
const kr = resolve(dirname(fileURLToPath(import.meta.url)), '..');

let out = '';
const krNote = pullClone(kr, 'knowledge');

if (krNote) {
  out += krNote;
} else {
  const head = git(kr, 'log -1 --format="%h %cs"');
  // The line below is the only pointer a session outside the knowledge repo
  // gets, so it names where things live.
  out +=
    `knowledge: main at ${head}. Shared team context lives in ${kr}: ` +
    'decisions/DECISIONS.md (what was decided), decisions/open/ (not yet ruled), notes/ (facts), ' +
    'backlog/ (work, followups), architecture/ (spec, contracts). ' +
    'Read these files directly when a question touches team decisions; what a teammate is working on is in the ticket tracker.\n';
}
process.stdout.write(out);
process.exit(0);
