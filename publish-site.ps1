param(
    [switch]$Publish
)

$ErrorActionPreference = 'Stop'
$projectDirectory = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$siteDirectory = Join-Path $projectDirectory 'site'
$repositoryUrl = 'https://github.com/ltj54/idsoe-radgivning-nettside.git'

if (-not (Test-Path -LiteralPath (Join-Path $siteDirectory 'index.html'))) {
    throw "Finner ikke site\index.html i $siteDirectory"
}

$gitRoot = (git -C $projectDirectory rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or (Resolve-Path -LiteralPath $gitRoot).Path -ne $projectDirectory) {
    throw 'Kjør skriptet fra roten av Idsøe Rådgivning-prosjektet.'
}

$remote = (git -C $projectDirectory remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $remote -ne $repositoryUrl) {
    throw "Prosjektet peker ikke til forventet GitHub-repo: $remote"
}

$branch = (git -C $projectDirectory branch --show-current).Trim()
if ($branch -ne 'main') {
    throw "Publisering er bare konfigurert for main-grenen. Aktiv gren: $branch"
}

$stagedBefore = git -C $projectDirectory diff --cached --name-only
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke kontrollere Git-indeksen.' }
if ($stagedBefore) {
    throw 'Det finnes allerede stagede endringer. Kontroller dem eller fjern staging før du kjører publiseringsskriptet.'
}

$websiteFiles = Get-ChildItem -LiteralPath $siteDirectory -File
foreach ($file in $websiteFiles) {
    Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $projectDirectory $file.Name) -Force
}

$websiteNames = $websiteFiles | ForEach-Object { $_.Name }
git -C $projectDirectory diff --check -- $websiteNames
if ($LASTEXITCODE -ne 0) { throw 'Nettstedfilene inneholder whitespace-feil.' }

git -C $projectDirectory add -- $websiteNames
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke klargjøre nettstedfilene.' }

$stagedChanges = git -C $projectDirectory diff --cached --name-only
if (-not $stagedChanges) {
    Write-Host 'Nettsiden er allerede oppdatert i publiseringsroten.' -ForegroundColor Green
    exit 0
}

if (-not $Publish) {
    Write-Host 'Nettstedfilene er kopiert og stagede. Kontroller dem med git diff --cached.' -ForegroundColor Yellow
    Write-Host 'Når du vil publisere, kjør .\publish-site.ps1 -Publish.'
    exit 0
}

git -C $projectDirectory commit -m 'Oppdater nettsiden'
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke opprette commit.' }

git -C $projectDirectory push origin main
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke publisere endringene til GitHub.' }

Write-Host 'Nettsiden er publisert til GitHub Pages.' -ForegroundColor Green
