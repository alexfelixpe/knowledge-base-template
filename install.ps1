<#
.SYNOPSIS
  One-time setup for an engineer joining the shared team knowledge base.

.DESCRIPTION
  Run once from a clone of this repo (Windows PowerShell 5.1 or PowerShell 7).
  It:
    1. Links every skill under skills/live into ~/.claude/skills (directory
       junctions: no admin rights or Developer Mode needed; a git pull of this
       repo updates the skills in place). With no skills yet, nothing is linked.
    2. Registers the shared Claude Code hook in ~/.claude/settings.json:
       a SessionStart pull of this clone. The file is rewritten (other settings
       kept); a .bak copy is left beside it.
  A preflight checks node, the settings file and skill-folder conflicts before
  any write, so a failed run changes nothing. Re-running is safe.

.PARAMETER Tier
  live (default) or draft. draft is only for trying unmerged skills.

.EXAMPLE
  .\install.ps1
#>
[CmdletBinding()]
param(
  [ValidateSet('live', 'draft')]
  [string]$Tier = 'live'
)

# ValidateSet accepts any case (Live, DRAFT); lowercase now so the
# skills\$Tier path below and the strict tier check in register-hooks.mjs agree.
$Tier = $Tier.ToLowerInvariant()

$ErrorActionPreference = 'Stop'
$repo = $PSScriptRoot
if (-not (Test-Path (Join-Path $repo 'skills'))) { throw "Run this script from the knowledge repo clone." }

# 0. Preflight: check everything that could fail BEFORE writing anything, so a
#    failed run leaves the machine exactly as it was.
$problems = @()
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { $problems += "node is not on PATH (needed for the hooks)." }
# A linked worktree's .git is a file, not a folder; registering from one would
# write a hook path that breaks as soon as the worktree is removed.
if (Test-Path (Join-Path $repo '.git') -PathType Leaf) {
  $problems += "hooks must be registered from the main clone, not a git worktree."
}
$settingsPath = Join-Path $HOME '.claude\settings.json'
if (Test-Path $settingsPath) {
  try { Get-Content $settingsPath -Raw | ConvertFrom-Json | Out-Null }
  catch { $problems += "$settingsPath is not valid JSON; fix it first (the script rewrites it, with a backup)." }
}
$skillsSrc = Join-Path $repo "skills\$Tier"
$skillsDst = Join-Path $HOME '.claude\skills'
Get-ChildItem $skillsSrc -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  $link = Join-Path $skillsDst $_.Name
  if ((Test-Path $link) -and -not (Get-Item $link -Force).LinkType) {
    $problems += "$link is a real folder (a personal copy); move it away first, a copy would shadow the shared skill."
  }
}
if ($problems.Count -gt 0) {
  Write-Host "install.ps1: nothing was changed. Fix these and re-run:"
  $problems | ForEach-Object { Write-Host "  - $_" }
  exit 1
}

# 1. Skills: one junction per skill folder under skills/<tier> (conflicts were
#    rejected in the preflight, so every existing entry here is a link).
if (-not (Test-Path $skillsDst)) { New-Item -ItemType Directory -Path $skillsDst | Out-Null }
$linked = 0
Get-ChildItem $skillsSrc -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  $target = $_.FullName
  $link = Join-Path $skillsDst $_.Name
  # A junction is removed with rmdir, which drops the link and never touches the
  # target; Remove-Item on a junction prompts and, with -Recurse, can delete the target.
  if (Test-Path $link) { cmd /c rmdir "$link" | Out-Null }
  New-Item -ItemType Junction -Path $link -Target $target | Out-Null
  $linked++
}
Write-Host "skills: $linked linked from skills\$Tier into $skillsDst"
if ($linked -eq 0) { Write-Host "  (skills\$Tier is empty; nothing linked yet)" }
# Retire junctions whose target was a skill of this repo that no longer exists
# (a skill folded or renamed by a PR). Only links that point inside this repo's
# skills folder are touched; anything else in ~/.claude/skills is left alone.
$repoSkills = (Join-Path $repo 'skills').ToLower()
Get-ChildItem $skillsDst -Force | Where-Object { $_.LinkType } | ForEach-Object {
  $target = ($_.Target | Select-Object -First 1)
  if ($target -and $target.ToLower().StartsWith($repoSkills) -and -not (Test-Path $target)) {
    cmd /c rmdir "$($_.FullName)" | Out-Null
    Write-Host "skills: retired link $($_.Name) (target no longer in the repo)"
  }
}

# 2. Hooks in ~/.claude/settings.json.
node (Join-Path $repo 'hooks\register-hooks.mjs') $repo --tier $Tier
# PowerShell 5.1 does not throw on a native exe's non-zero exit, so a failed
# register-hooks run would otherwise fall through to "Done" below.
if ($LASTEXITCODE -ne 0) { throw "register-hooks.mjs failed (exit $LASTEXITCODE); hooks were not registered." }

Write-Host ""
Write-Host "Done. Open a new Claude Code session; it will pull this clone at start and load any skills you linked."
Write-Host "Optional: if you run a memory vault, add this clone as a read-only external root."
