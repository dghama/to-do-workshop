[CmdletBinding()]
param(
    [string]$FeatureDirectory
)

$ErrorActionPreference = 'Stop'

function Stop-Resolution([string]$Message) {
    [Console]::Error.WriteLine("Feature context: $Message")
    exit 1
}

$root = & git rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0 -or -not $root) {
    Stop-Resolution 'Run this command inside a Git worktree.'
}
$root = [System.IO.Path]::GetFullPath(($root | Select-Object -First 1))
$branch = & git symbolic-ref --quiet --short HEAD 2>$null
if ($LASTEXITCODE -ne 0 -or -not $branch) {
    Stop-Resolution 'HEAD is detached or the current branch cannot be determined.'
}
$branch = ($branch | Select-Object -First 1)

$featurePattern = '^[a-z][a-z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+){0,4}$'
$derivedName = $null
if ($branch -cmatch '^feature/([a-z][a-z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+){0,4})$') {
    $derivedName = $Matches[1]
}

if ($FeatureDirectory) {
    $selection = $FeatureDirectory -replace '\\', '/'
    if ($selection -cnotmatch '^specs/([^/]+)$') {
        Stop-Resolution 'Explicit selection must be specs/<JIRA-ID>-<short-name>.'
    }
    $name = $Matches[1]
    if ($name -cnotmatch $featurePattern) {
        Stop-Resolution 'Explicit selection must be specs/<JIRA-ID>-<short-name>.'
    }
    if ($derivedName -and $name -cne $derivedName) {
        Stop-Resolution "Explicit selection conflicts with branch '$branch'."
    }
} elseif ($derivedName) {
    $name = $derivedName
} else {
    Stop-Resolution "Branch '$branch' does not match feature/<JIRA-ID>-<short-name>. Select a feature explicitly with -FeatureDirectory."
}

$specsRoot = Join-Path $root 'specs'
if (-not $FeatureDirectory -and $derivedName) {
    $derivedDirectory = Join-Path $specsRoot $derivedName
    if (-not (Test-Path -LiteralPath $derivedDirectory)) {
        $issueMatch = [regex]::Match($derivedName, '^([a-z][a-z0-9]*)-([0-9]+)-')
        $issueKey = ($issueMatch.Groups[1].Value + '-' + $issueMatch.Groups[2].Value).ToUpperInvariant()
        $relatedFeatureNames = @()

        foreach ($candidate in Get-ChildItem -LiteralPath $specsRoot -Directory -Force) {
            if (($candidate.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
                continue
            }
            $candidateSpec = Join-Path $candidate.FullName 'spec.md'
            if (-not (Test-Path -LiteralPath $candidateSpec -PathType Leaf)) {
                continue
            }
            $candidateSpecItem = Get-Item -LiteralPath $candidateSpec -Force
            if (($candidateSpecItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
                continue
            }

            $specContent = [System.IO.File]::ReadAllText($candidateSpec)
            $pointer = [regex]::Match($specContent, '(?m)^This feature is specified by\s+\[[^\]]*\]\(([^)\r\n]+)\)')
            if (-not $pointer.Success) {
                continue
            }
            $useCaseLink = $pointer.Groups[1].Value.Trim()
            if ([System.Uri]::IsWellFormedUriString($useCaseLink, [System.UriKind]::Absolute)) {
                continue
            }

            $useCasePath = [System.IO.Path]::GetFullPath((Join-Path $candidate.FullName ($useCaseLink -replace '/', '\')))
            $repoPrefix = $root.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
            $pathComparison = if ([System.IO.Path]::DirectorySeparatorChar -eq '\') {
                [System.StringComparison]::OrdinalIgnoreCase
            } else {
                [System.StringComparison]::Ordinal
            }
            if (-not $useCasePath.StartsWith($repoPrefix, $pathComparison) -or
                -not (Test-Path -LiteralPath $useCasePath -PathType Leaf)) {
                continue
            }

            $useCaseItem = Get-Item -LiteralPath $useCasePath -Force
            if (($useCaseItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
                continue
            }
            $useCaseContent = [System.IO.File]::ReadAllText($useCasePath)
            $jiraLines = [regex]::Matches($useCaseContent, '(?im)^\s*\*\*(?:Related )?Jira:\*\*[^\r\n]*')
            foreach ($jiraLine in $jiraLines) {
                if ($jiraLine.Value -match '(?i)\b([A-Z][A-Z0-9]*-\d+)\b' -and $Matches[1].ToUpperInvariant() -ceq $issueKey) {
                    $relatedFeatureNames += $candidate.Name
                    break
                }
            }
        }

        $relatedFeatureNames = @($relatedFeatureNames | Select-Object -Unique)
        if ($relatedFeatureNames.Count -gt 1) {
            Stop-Resolution "Branch Jira '$issueKey' matches multiple use-case feature directories. Select one explicitly with -FeatureDirectory."
        }
        if ($relatedFeatureNames.Count -eq 1) {
            $name = $relatedFeatureNames[0]
        }
    }
}

$relativePath = "specs/$name"
$directory = Join-Path $specsRoot $name
$specFile = Join-Path $directory 'spec.md'
foreach ($path in @($specsRoot, $directory, $specFile)) {
    if (-not (Test-Path -LiteralPath $path)) {
        Stop-Resolution "Required feature path does not exist: $path"
    }
    $item = Get-Item -LiteralPath $path -Force
    if (($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
        Stop-Resolution "Feature path must not be a symbolic link or junction: $path"
    }
}
if (-not (Test-Path -LiteralPath $directory -PathType Container) -or
    -not (Test-Path -LiteralPath $specFile -PathType Leaf)) {
    Stop-Resolution "Expected a feature directory containing spec.md: $directory"
}

if ($env:SPECIFY_FEATURE_DIRECTORY) {
    $envPath = $env:SPECIFY_FEATURE_DIRECTORY
    if (-not [System.IO.Path]::IsPathRooted($envPath)) {
        $envPath = Join-Path $root $envPath
    }
    $comparison = if ([System.IO.Path]::DirectorySeparatorChar -eq '\') {
        [System.StringComparison]::OrdinalIgnoreCase
    } else {
        [System.StringComparison]::Ordinal
    }
    if (-not [string]::Equals([System.IO.Path]::GetFullPath($envPath).TrimEnd('\', '/'), $directory.TrimEnd('\', '/'), $comparison)) {
        Stop-Resolution 'SPECIFY_FEATURE_DIRECTORY conflicts with the selected feature. Clear or correct it before proceeding.'
    }
}
if ($env:SPECIFY_FEATURE -and $env:SPECIFY_FEATURE -cne $branch) {
    Stop-Resolution 'SPECIFY_FEATURE conflicts with the current branch. Clear or correct it before proceeding.'
}
if ($env:SPECIFY_FEATURE_NO_PERSIST -in @('1', 'true')) {
    Stop-Resolution 'SPECIFY_FEATURE_NO_PERSIST prevents updating feature.json. Clear it before proceeding.'
}

$stateDirectory = Join-Path $root '.specify'
if (-not (Test-Path -LiteralPath $stateDirectory -PathType Container)) {
    Stop-Resolution "Spec Kit directory not found: $stateDirectory"
}
$stateFile = Join-Path $stateDirectory 'feature.json'
if (Test-Path -LiteralPath $stateFile) {
    $stateItem = Get-Item -LiteralPath $stateFile -Force
    if (($stateItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0 -or $stateItem.PSIsContainer) {
        Stop-Resolution 'feature.json must be a regular file, not a link or directory.'
    }
}
$temporary = Join-Path $stateDirectory ('.feature-' + [Guid]::NewGuid().ToString('N') + '.tmp')
$backup = Join-Path $stateDirectory ('.feature-' + [Guid]::NewGuid().ToString('N') + '.bak')
try {
    $json = @{ feature_directory = $relativePath } | ConvertTo-Json -Compress
    [System.IO.File]::WriteAllText($temporary, $json, (New-Object System.Text.UTF8Encoding($false)))
    if (Test-Path -LiteralPath $stateFile) {
        [System.IO.File]::Replace($temporary, $stateFile, $backup)
        Remove-Item -LiteralPath $backup
    } else {
        [System.IO.File]::Move($temporary, $stateFile)
    }
} finally {
    if (Test-Path -LiteralPath $temporary -PathType Leaf) {
        Remove-Item -LiteralPath $temporary
    }
}

[PSCustomObject]@{
    BRANCH = $branch
    FEATURE_DIRECTORY = $relativePath
    FEATURE_SPEC = $specFile
} | ConvertTo-Json -Compress
