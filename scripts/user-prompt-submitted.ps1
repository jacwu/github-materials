$ErrorActionPreference = "Stop"

$stdin = [Console]::OpenStandardInput()
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$reader = New-Object System.IO.StreamReader($stdin, $utf8NoBom, $true)
$raw = $reader.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) {
    $raw = "{}"
}

New-Item -ItemType Directory -Path "logs" -Force | Out-Null

try {
    $obj = $raw | ConvertFrom-Json
    $compact = $obj | ConvertTo-Json -Compress
} catch {
    $compact = ($raw -replace "(\r?\n)+", " ").Trim()
}

[System.IO.File]::AppendAllText((Join-Path $PWD "logs\user-prompt-submitted.jsonl"), $compact + [Environment]::NewLine, $utf8NoBom)
