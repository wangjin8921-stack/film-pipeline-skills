param(
    [string]$HostName = '192.168.1.150',
    [string]$UserName = 'WJIN',
    [string]$Password = 'Wangjin8921',
    [string]$ContainerName = 'openclaw',
    [string]$VolumeRoot = '/vol1/docker/volumes/openclaw_data/_data/workspace',
    [switch]$RestartContainer,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$plink = Join-Path ${env:ProgramFiles} 'PuTTY\plink.exe'
$pscp = Join-Path ${env:ProgramFiles} 'PuTTY\pscp.exe'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path $plink)) {
    throw "plink.exe not found: $plink"
}

if (-not (Test-Path $pscp)) {
    throw "pscp.exe not found: $pscp"
}

$skillSources = @(
    'film-pipeline',
    'step-1-film-director',
    'step-2-film-scriptboard',
    'step-3-prompt-director',
    'step-4-shot-executor',
    'step-5-director-prompts'
) | ForEach-Object {
    $path = Join-Path $repoRoot $_
    if (-not (Test-Path $path)) {
        throw "Missing local skill directory: $path"
    }
    [PSCustomObject]@{
        Name = $_
        Path = $path
    }
}

$pluginSource = Join-Path $repoRoot 'subagent-shortcuts'
if (-not (Test-Path $pluginSource)) {
    throw "Missing local plugin directory: $pluginSource"
}

$remoteSkillParent = "$VolumeRoot/skills"
$remotePluginParent = "$VolumeRoot/plugins"
$remotePluginDir = "$remotePluginParent/subagent-shortcuts"

function Invoke-NasRaw {
    param([string]$Command)
    $tmp = New-TemporaryFile
    try {
        Set-Content -Path $tmp -Value $Command -NoNewline
        & $plink -batch -pw $Password "$UserName@$HostName" -m $tmp
        if ($LASTEXITCODE -ne 0) {
            throw "NAS command failed: $Command"
        }
    } finally {
        Remove-Item $tmp -ErrorAction SilentlyContinue
    }
}

function Invoke-NasCommand {
    param([string]$Command)
    $quoted = [char]34 + $Command + [char]34
    $full = "printf '%s\n' '$Password' | sudo -S -p '' sh -lc " + $quoted
    Invoke-NasRaw $full
}

function Copy-ToNas {
    param(
        [string]$LocalPath,
        [string]$RemoteParent
    )
    & $pscp -batch -pw $Password -r $LocalPath "${UserName}@${HostName}:$RemoteParent"
    if ($LASTEXITCODE -ne 0) {
        throw "pscp failed for $LocalPath -> $RemoteParent"
    }
}

[System.Collections.Generic.List[string]]$plannedSteps = @(
    "mkdir -p '$remoteSkillParent' '$remotePluginParent'",
    "rm -rf '$remotePluginDir'",
    "copy '$pluginSource' -> '$remotePluginParent'"
)

foreach ($skill in $skillSources) {
    $plannedSteps.Insert(1, "rm -rf '$remoteSkillParent/$($skill.Name)'")
    $plannedSteps.Add("copy '$($skill.Path)' -> '$remoteSkillParent'")
}

if ($RestartContainer) {
    $plannedSteps.Add("docker restart $ContainerName")
    $plannedSteps.Add("docker ps --filter name=$ContainerName --format '{{.Names}} {{.Status}}'")
}

Write-Host ''
Write-Host 'Deploy Film Pipeline To NAS' -ForegroundColor Cyan
Write-Host "NAS: $HostName"
Write-Host "Workspace root: $VolumeRoot"
Write-Host "Skill sources: $($skillSources.Name -join ', ')"
Write-Host "Plugin source: $pluginSource"
Write-Host ''

if ($DryRun) {
    Write-Host 'DryRun mode. Planned steps:' -ForegroundColor Yellow
    $plannedSteps | ForEach-Object { Write-Host " - $_" }
    exit 0
}

Invoke-NasCommand "mkdir -p '$remoteSkillParent' '$remotePluginParent'"
foreach ($skill in $skillSources) {
    Invoke-NasCommand "rm -rf '$remoteSkillParent/$($skill.Name)'"
}
Invoke-NasCommand "rm -rf '$remotePluginDir'"
foreach ($skill in $skillSources) {
    Copy-ToNas -LocalPath $skill.Path -RemoteParent $remoteSkillParent
}
Copy-ToNas -LocalPath $pluginSource -RemoteParent $remotePluginParent

if ($RestartContainer) {
    Invoke-NasCommand "docker restart $ContainerName >/dev/null"
    Start-Sleep -Seconds 8
    Invoke-NasCommand "docker ps --filter name=$ContainerName --format '{{.Names}} {{.Status}}'"
}

Write-Host ''
Write-Host 'Deploy completed.' -ForegroundColor Green
Write-Host "Deployed skills: $($skillSources.Name -join ', ')"
Write-Host "Deployed plugin: $remotePluginDir"

if (-not $RestartContainer) {
    Write-Host 'Container not restarted. Restart OpenClaw if the new /film command does not appear immediately.' -ForegroundColor Yellow
}
