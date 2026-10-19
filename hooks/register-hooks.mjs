/**
 * Register the shared Claude Code hook in ~/.claude/settings.json,
 * idempotently. Called by install.ps1; safe to run again.
 *
 *   node hooks/register-hooks.mjs <knowledge-repo-dir> [--tier live|draft]
 *
 * Hook registered:
 *   SessionStart  -> hooks/session-pull.mjs        (pull the clone on main)
 *
 * --tier must be live or draft (case insensitive), and hooks/session-pull.mjs
 * must exist on disk. The repo argument must be the main clone, not a linked
 * git worktree. Any failed check exits 1 before settings.json is read, before
 * the .bak copy is written, and before any write happens.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import { homedir } from 'node:os';

const repoArg = process.argv[2];
if (!repoArg) {
  console.error('usage: node hooks/register-hooks.mjs <knowledge-repo-dir> [--tier live|draft]');
  process.exit(1);
}
// Resolve to an absolute path: a relative arg such as "." would otherwise be
// baked into the registered hook command, which then only works from that
// one working directory.
const repo = resolve(repoArg);

// A linked worktree's .git is a file (a pointer to the real one), not a
// folder; registering from it writes a path that breaks once the worktree is
// removed, so refuse before any write.
if (statSync(join(repo, '.git'), { throwIfNoEntry: false })?.isFile()) {
  console.error('hooks must be registered from the main clone, not a git worktree.');
  process.exit(1);
}

// Reject anything other than the two real tiers up front. Lowercase first so
// ValidateSet's case insensitivity on the PowerShell side (Live, DRAFT) does
// not slip through to a strict, case-sensitive check here.
const tierIdx = process.argv.indexOf('--tier');
const tierArg = tierIdx > -1 ? process.argv[tierIdx + 1] : 'live';
const tier = tierArg ? tierArg.toLowerCase() : tierArg;
if (tier !== 'live' && tier !== 'draft') {
  console.error('usage: node hooks/register-hooks.mjs <knowledge-repo-dir> [--tier live|draft]');
  process.exit(1);
}

// Fail before any write rather than register a SessionStart command that will
// exit 1 on every session.
const pullScriptPath = join(repo, 'hooks', 'session-pull.mjs');
if (!existsSync(pullScriptPath)) {
  console.error(`missing ${pullScriptPath}; hooks not registered`);
  process.exit(1);
}

const settingsDir = join(homedir(), '.claude');
const settingsPath = join(settingsDir, 'settings.json');
if (!existsSync(settingsDir)) mkdirSync(settingsDir, { recursive: true });
let settings = {};
if (existsSync(settingsPath)) {
  // Validate before touching anything: a broken settings file is reported,
  // never overwritten.
  const raw = readFileSync(settingsPath, 'utf8');
  try {
    settings = JSON.parse(raw);
  } catch (e) {
    console.error(`${settingsPath} is not valid JSON (${e.message}); nothing was changed.`);
    process.exit(1);
  }
  // Keep a copy of what was there; the rewrite below keeps every other key.
  writeFileSync(settingsPath + '.bak', raw);
}
settings.hooks ||= {};

const q = (p) => `"${p.replace(/\\/g, '/')}"`;
const pullCmd = `node ${q(pullScriptPath)}`;

// An old entry is dropped when it names this repo's script (any letter case) or
// a session-pull.mjs that no longer exists (a moved clone). A hook of another
// knowledge repo whose script still exists is left alone.
function isOwnOrDead(command, marker) {
  const cmd = String(command).replace(/\\/g, '/');
  if (cmd.toLowerCase().includes(marker.toLowerCase())) return true;
  const path = /"([^"]*hooks\/session-pull\.mjs)"/i.exec(cmd)?.[1];
  // Only a plain absolute path can be judged missing; a variable or a relative
  // path may resolve at run time, so such an entry is kept.
  return Boolean(path) && isAbsolute(path) && !/[$%~]/.test(path) && !existsSync(path);
}

function upsert(event, matcher, command, marker, timeout = 30) {
  const list = (settings.hooks[event] ||= []);
  for (const group of list) {
    group.hooks = (group.hooks || []).filter((h) => !isOwnOrDead(h.command, marker));
  }
  const kept = list.filter((g) => (g.hooks || []).length > 0);
  const entry = { hooks: [{ type: 'command', command, timeout }] };
  if (matcher) entry.matcher = matcher;
  kept.push(entry);
  settings.hooks[event] = kept;
}

upsert('SessionStart', null, pullCmd, q(pullScriptPath), 60);

writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log(`hooks registered in ${settingsPath}`);
console.log(`  SessionStart: ${pullCmd}`);
