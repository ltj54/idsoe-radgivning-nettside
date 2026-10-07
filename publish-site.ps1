param(
    [switch]$Publish
)

$ErrorActionPreference = 'Stop'
$projectDirectory = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$repositoryUrl = 'https://github.com/ltj54/idsoe-radgivning-nettside.git'
$pagesUrl = 'https://ltj54.github.io/idsoe-radgivning-nettside/'

if (-not (Test-Path -LiteralPath (Join-Path $projectDirectory 'index.html'))) {
    throw "Finner ikke index.html i $projectDirectory"
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

$websitePathspecs = @(':(top,glob)*.html', ':(top,glob)*.css', ':(top,glob)*.js', ':(top,glob)*.svg')
function Test-WebsitePath([string]$path) {
    return ($path -eq [System.IO.Path]::GetFileName($path)) -and
        ([System.IO.Path]::GetExtension($path) -in @('.html', '.css', '.js', '.svg'))
}

$stagedBefore = git -C $projectDirectory diff --cached --name-only
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke kontrollere Git-indeksen.' }
if ($stagedBefore -and -not $Publish) {
    throw 'Det finnes allerede stagede endringer. Kontroller dem eller fjern staging før du kjører publiseringsskriptet.'
}
if ($stagedBefore -and $Publish) {
    $unexpectedStaged = @($stagedBefore | Where-Object { -not (Test-WebsitePath $_) })
    if ($unexpectedStaged) {
        throw "Kan ikke publisere fordi andre filer er staget: $($unexpectedStaged -join ', ')"
    }
}

$versionValue = (Get-Date).ToUniversalTime().ToString('yyyyMMddHHmmss')
$versionedAssets = 'styles\.css|language\.js'
$htmlFiles = Get-ChildItem -LiteralPath $projectDirectory -Filter '*.html' -File
foreach ($htmlFile in $htmlFiles) {
    $html = [System.IO.File]::ReadAllText($htmlFile.FullName)
    $updatedHtml = [regex]::Replace($html, "(?<asset>$versionedAssets)(?:\?v=\d{14})?", "`${asset}?v=$versionValue")
    if ($updatedHtml -ne $html) {
        [System.IO.File]::WriteAllText($htmlFile.FullName, $updatedHtml, [System.Text.UTF8Encoding]::new($false))
    }
}

git -C $projectDirectory diff --check -- $websitePathspecs
if ($LASTEXITCODE -ne 0) { throw 'Nettstedfilene inneholder whitespace-feil.' }

git -C $projectDirectory add -A -- $websitePathspecs
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke klargjøre nettstedfilene.' }

$stagedChanges = git -C $projectDirectory diff --cached --name-only
if (-not $stagedChanges) {
    Write-Host 'Nettsiden er allerede oppdatert i publiseringsroten.' -ForegroundColor Green
    exit 0
}

if (-not $Publish) {
    Write-Host 'Nettstedfilene er kontrollert og stagede. Kontroller dem med git diff --cached.' -ForegroundColor Yellow
    Write-Host 'Når du vil publisere, kjør .\publish-site.ps1 -Publish.'
    exit 0
}

git -C $projectDirectory commit -m 'Oppdater nettsiden'
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke opprette commit.' }

git -C $projectDirectory push origin main
if ($LASTEXITCODE -ne 0) { throw 'Kunne ikke publisere endringene til GitHub.' }

Write-Host 'Nettsiden er publisert til GitHub Pages.' -ForegroundColor Green
Write-Host "Når GitHub Pages er ferdig oppdatert, kan denne lenken sendes til Ella: $pagesUrl" -ForegroundColor Green
