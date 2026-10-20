param(
    [switch]$Publish
)

$ErrorActionPreference = 'Stop'
$projectDirectory = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$repositoryUrl = 'https://github.com/ltj54/idsoe-radgivning-nettside.git'
$pagesUrl = 'https://ltj54.github.io/idsoe-radgivning-nettside/'
$productionUrl = 'https://emidsoe.no/'
$sftpHost = 'sftp1.no1.essentialhosting.net'
$sftpPort = 22
$sftpUser = 'web-245729'
$sftpDirectory = 'public_html/default'

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

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCommand) {
    throw 'Python 3 må være installert og tilgjengelig som python i PATH.'
}

& $pythonCommand.Source (Join-Path $projectDirectory 'scripts/check_site.py')
if ($LASTEXITCODE -ne 0) { throw 'Den automatiske nettstedskontrollen feilet.' }

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

$scpCommand = Get-Command scp -ErrorAction SilentlyContinue
if (-not $scpCommand) {
    throw 'Finner ikke scp. Installer eller aktiver OpenSSH Client i Windows før publisering til Domeneshop.'
}

$deploymentFiles = Get-ChildItem -LiteralPath $projectDirectory -File | Where-Object {
    $_.Extension -in @('.html', '.css', '.js', '.svg')
} | Sort-Object @{ Expression = { $_.Name -eq 'index.html' } }, Name

if (-not $deploymentFiles) {
    throw 'Fant ingen nettstedfiler å laste opp.'
}

$sftpTarget = '{0}@{1}:{2}/' -f $sftpUser, $sftpHost, $sftpDirectory
$scpArguments = @('-P', "$sftpPort") + @($deploymentFiles.FullName) + @($sftpTarget)

Write-Host "Laster opp $($deploymentFiles.Count) filer til Domeneshop." -ForegroundColor Yellow
Write-Host 'Skriv inn SFTP-passordet når du blir bedt om det. Passordet lagres ikke av skriptet.' -ForegroundColor Yellow
& $scpCommand.Source @scpArguments
if ($LASTEXITCODE -ne 0) {
    throw 'GitHub ble oppdatert, men opplastingen til Domeneshop mislyktes.'
}

try {
    $response = Invoke-WebRequest -Uri $productionUrl -TimeoutSec 20
    if ($response.StatusCode -ne 200 -or $response.Content -notmatch '<title>Idsøe Rådgivning') {
        throw 'Produksjonssiden svarte, men innholdet kunne ikke bekreftes.'
    }
} catch {
    throw "Filene ble lastet opp, men kontrollen av $productionUrl mislyktes: $($_.Exception.Message)"
}

Write-Host 'Kildekoden er pushet til GitHub.' -ForegroundColor Green
Write-Host "Forhåndsvisning: $pagesUrl" -ForegroundColor Green
Write-Host "Nettsiden er publisert og kontrollert: $productionUrl" -ForegroundColor Green
