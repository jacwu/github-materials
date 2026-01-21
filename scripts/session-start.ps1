$ErrorActionPreference = "Stop"

$raw = [Console]::In.ReadToEnd()
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

Add-Content -Path "logs\session-start.jsonl" -Value $compact
