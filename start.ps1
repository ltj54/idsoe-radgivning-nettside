param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8765,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCommand) {
    throw 'Python 3 må være installert og tilgjengelig som python i PATH.'
}

$serverArguments = @('-u', (Join-Path $PSScriptRoot 'scripts/serve.py'), '--port', "$Port")
if (-not $NoBrowser) {
    $serverArguments += '--open'
}

& $pythonCommand.Source @serverArguments
exit $LASTEXITCODE
