$src = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = Join-Path (Split-Path $src -Parent) "TradeFlow_Final.zip"

if (Test-Path $dest) { Remove-Item $dest -Force }

$exclude = @("node_modules", ".angular", "dist")
$items = Get-ChildItem -Path $src | Where-Object { $exclude -notcontains $_.Name }

Compress-Archive -Path ($items | Select-Object -ExpandProperty FullName) -DestinationPath $dest -Force
Write-Host "ZIP created at: $dest"
