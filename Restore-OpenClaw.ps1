param(
    [string]$HostName = '192.168.1.150',
    [string]$UserName = 'WJIN',
    [string]$Password = 'Wangjin8921',
    [string]$ContainerName = 'openclaw',
    [string]$BackupDir = '/vol1/1000/1/openclaw',
    [string]$BackupArchive = '',
    [string]$BackupHash = '',
    [string]$VolumeRoot = '/vol1/docker/volumes/openclaw_data',
    [switch]$SkipVerify,
    [switch]$Force,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$plink = Join-Path ${env:ProgramFiles} 'PuTTY\plink.exe'

if (-not (Test-Path $plink)) {
    throw "plink.exe not found: $plink"
}

function Invoke-NasRaw {
    param([string]$Command)
    & $plink -batch -pw $Password "$UserName@$HostName" $Command
    if ($LASTEXITCODE -ne 0) {
        throw "NAS command failed: $Command"
    }
}

function Invoke-NasCommand {
    param([string]$Command)
    $quoted = [char]34 + $Command + [char]34
    $full = "printf '%s\n' '$Password' | sudo -S -p '' sh -lc " + $quoted
    Invoke-NasRaw $full
}

function Get-BackupCandidates {
    $cmd = "python3 - <<'PY'
from pathlib import Path
root = Path('$BackupDir')
if not root.exists():
    raise SystemExit(0)
for path in sorted(root.glob('openclaw-state-*.tar.gz'), reverse=True):
    print(path.as_posix())
PY"
    $result = Invoke-NasRaw $cmd
    @($result | Where-Object { $_ -and $_.Trim() })
}

function Resolve-BackupPaths {
    if ($BackupArchive) {
        $archive = $BackupArchive
    } else {
        $candidates = Get-BackupCandidates
        if (-not $candidates -or $candidates.Count -eq 0) {
            throw "No backup archives found in $BackupDir"
        }

        Write-Host ''
        Write-Host 'Available backup archives:' -ForegroundColor Cyan
        for ($i = 0; $i -lt $candidates.Count; $i++) {
            Write-Host ("[{0}] {1}" -f ($i + 1), $candidates[$i])
        }
        Write-Host ''
        $choice = Read-Host 'Choose archive number (default 1)'
        if ([string]::IsNullOrWhiteSpace($choice)) {
            $choice = '1'
        }
        $index = [int]$choice - 1
        if ($index -lt 0 -or $index -ge $candidates.Count) {
            throw 'Invalid archive selection.'
        }
        $archive = $candidates[$index]
    }

    if ($BackupHash) {
        $hash = $BackupHash
    } else {
        $hash = "$archive.sha256"
    }

    [pscustomobject]@{
        Archive = $archive
        Hash = $hash
    }
}

$selected = Resolve-BackupPaths
$BackupArchive = $selected.Archive
$BackupHash = $selected.Hash

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$preRestore = "$BackupDir/pre-restore-$stamp.tar.gz"
$steps = [System.Collections.Generic.List[string]]::new()
$steps.Add("docker stop $ContainerName >/dev/null")
$steps.Add("mkdir -p '$BackupDir'")
if (-not $SkipVerify) {
    $steps.Add("sha256sum -c '$BackupHash'")
}
$steps.Add("tar -czf '$preRestore' -C '$VolumeRoot' _data")
$steps.Add("rm -rf '$VolumeRoot/_data'")
$steps.Add("mkdir -p '$VolumeRoot/_data'")
$steps.Add("tar -xzf '$BackupArchive' -C '$VolumeRoot'")
$steps.Add("docker start $ContainerName >/dev/null")
$steps.Add("docker ps --filter name=$ContainerName --format '{{.Names}} {{.Status}}'")

Write-Host ''
Write-Host 'OpenClaw Restore Script' -ForegroundColor Cyan
Write-Host "NAS: $HostName"
Write-Host "Container: $ContainerName"
Write-Host "Archive: $BackupArchive"
Write-Host "Checksum: $BackupHash"
Write-Host "Pre-restore backup: $preRestore"
Write-Host ''

if ($DryRun) {
    Write-Host 'DryRun mode. Planned steps:' -ForegroundColor Yellow
    $steps | ForEach-Object { Write-Host " - $_" }
    exit 0
}

if (-not $Force) {
    $answer = Read-Host 'This will overwrite current OpenClaw data. Type YES to continue'
    if ($answer -ne 'YES') {
        Write-Host 'Cancelled.' -ForegroundColor Yellow
        exit 1
    }
}

$index = 0

try {
    Write-Host '1/7 Stopping container...' -ForegroundColor Green
    Invoke-NasCommand $steps[$index]
    $index++

    Write-Host '2/7 Preparing backup folder...' -ForegroundColor Green
    Invoke-NasCommand $steps[$index]
    $index++

    if (-not $SkipVerify) {
        Write-Host '3/7 Verifying archive...' -ForegroundColor Green
        Invoke-NasCommand $steps[$index]
        $index++
    }

    Write-Host '4/7 Creating pre-restore snapshot...' -ForegroundColor Green
    Invoke-NasCommand $steps[$index]
    $index++

    Write-Host '5/7 Restoring data...' -ForegroundColor Green
    Invoke-NasCommand $steps[$index]
    $index++
    Invoke-NasCommand $steps[$index]
    $index++
    Invoke-NasCommand $steps[$index]
    $index++

    Write-Host '6/7 Starting container...' -ForegroundColor Green
    Invoke-NasCommand $steps[$index]
    $index++

    Write-Host '7/7 Checking container status...' -ForegroundColor Green
    Invoke-NasCommand $steps[$index]

    Write-Host ''
    Write-Host 'Restore completed.' -ForegroundColor Cyan
    Write-Host "Pre-restore backup saved to: $preRestore"
} catch {
    Write-Host ''
    Write-Host "Restore failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'Use the restore guide if you need to recover manually.' -ForegroundColor Yellow
    exit 1
}