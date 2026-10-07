$ErrorActionPreference = 'Stop'

$homeHtml = Get-Content -LiteralPath 'index.html' -Raw -Encoding UTF8
$parents = Get-Content -LiteralPath 'foreldre.html' -Raw -Encoding UTF8
$kindergartens = Get-Content -LiteralPath 'barnehager.html' -Raw -Encoding UTF8
$clinical = Get-Content -LiteralPath 'leger-og-psykologer.html' -Raw -Encoding UTF8
$script = Get-Content -LiteralPath 'language.js' -Raw -Encoding UTF8
$pages = Get-ChildItem -File -Filter '*.html'

$kindergartenCopy = 'Vi tilbyr kurs og veiledning som gir ansatte i barnehagen økt kunnskap om barn med stort læringspotensial og hvordan disse barna kan komme til uttrykk i lek, læring og hverdagslige situasjoner. Dere får konkrete perspektiver og praktiske verktøy for å oppdage, forstå og møte barnas behov på en inkluderende måte. Målet er å skape et barnehagemiljø der barn med stort læringspotensial får passende utfordringer, anerkjennelse og rom for utvikling.'
if (-not $kindergartens.Contains($kindergartenCopy)) { throw 'Barnehageteksten stemmer ikke ordrett med Ellas e-post.' }

$clinicalCopy = @(
  'Kurs og rådgiving til psykologer',
  'Vi tilbyr kurs og rådgivning til psykologer som møter barn og unge med stort eller ekstraordinært læringspotensial. Atferd og reaksjoner hos denne elevgruppen kan i noen tilfeller overlappe med symptomer på blant annet ADHD, autismespektertilstander, angst eller skolevegring. Det er derfor viktig å ha kunnskap om hvordan Stort læringspotensial kan komme til uttrykk, slik at man kan gjøre gode differensialdiagnostiske vurderinger og unngå feilfortolkninger.',
  'Vi kan også bidra med faglig drøfting av enkeltsaker i anonymisert form, med særlig vekt på differensialdiagnostikk og på hvilke pedagogiske tiltak og tilrettelegginger skolen kan anbefales.',
  'Rådgiving til leger',
  'Vi tilbyr rådgivning til fastleger som møter barn og unge med gjentatte somatiske plager, skolefravær eller redusert allmennfungering, der skolesituasjonen kan være en medvirkende faktor. Hos elever med stort eller ekstraordinært læringspotensial kan manglende faglige utfordringer, lav opplevelse av mestring eller et utilstrekkelig tilpasset opplæringstilbud bidra til stressrelaterte plager som hodepine, magesmerter, søvnvansker og utmattelse.',
  'Rådgivningen erstatter ikke medisinsk utredning, men kan bidra til et bredere vurderingsgrunnlag og til samarbeid med foresatte, skole og eventuelt PPT. Målet er å identifisere om pedagogisk tilrettelegging kan være en del av tiltaket, parallelt med nødvendig medisinsk og psykisk helsefaglig oppfølging.'
)
foreach ($text in $clinicalCopy) { if (-not $clinical.Contains($text)) { throw "Mangler i tekst for leger og psykologer: $text" } }

if ($homeHtml -notmatch '<details id="formalet"') { throw 'Vårt mål må ligge i et lukket detaljer-element.' }
if ($homeHtml -match '<details id="formalet"[^>]*open') { throw 'Vårt mål skal ikke være åpent ved lasting.' }
if ($script -notmatch 'Skriv til oss') { throw 'Kontaktvinduet skal ha overskriften Skriv til oss.' }
if ($parents -notmatch 'Kjenner du deg igjen\?') { throw 'Foreldresiden mangler gjenkjenningsdelen.' }

$expectedNavigation = @('Hjem', 'For foreldre', 'For barnehager', 'For leger og psykologer', 'Kontakt')
foreach ($page in $pages) {
  $html = Get-Content -LiteralPath $page.FullName -Raw -Encoding UTF8
  $nav = [regex]::Match($html, '<nav class="main-nav".*?</nav>', 'Singleline').Value
  if (-not $nav) { throw "Mangler hovedmeny: $($page.Name)" }
  $labels = [regex]::Matches($nav, '<a\b[^>]*>([^<]+)</a>') | ForEach-Object { $_.Groups[1].Value }
  $expected = if ($html -match '<html lang="en"') { @('Home', 'For parents', 'For kindergartens', 'For doctors and psychologists', 'Contact') } else { $expectedNavigation }
  if (($labels -join '|') -ne ($expected -join '|')) { throw "Feil menypunkter: $($page.Name)" }
  if ($html -match '(?i)\bElla\b|mobb|blogg|\bblog\b|online tilbud|online services|om-ella') { throw "Uønsket tekst på $($page.Name)" }
}

$obsolete = @('skoler.html', 'schools.html', 'kunnskapsbank.html', 'knowledge.html', 'samtalen-med-skolen.html', 'difficult-conversations-with-school.html')
foreach ($name in $obsolete) { if (Test-Path -LiteralPath $name) { throw "Gammel side ligger fortsatt ute: $name" } }

Write-Output 'OK: Ny struktur, Ellas norske tekst, lukket målseksjon og fjerning av gammelt innhold er kontrollert.'
