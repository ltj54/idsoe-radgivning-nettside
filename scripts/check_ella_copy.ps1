$ErrorActionPreference = 'Stop'

$homeHtml = Get-Content -LiteralPath 'site/index.html' -Raw -Encoding UTF8
$parents = Get-Content -LiteralPath 'site/foreldre.html' -Raw -Encoding UTF8
$kindergartens = Get-Content -LiteralPath 'site/barnehager.html' -Raw -Encoding UTF8
$schools = Get-Content -LiteralPath 'site/skoler.html' -Raw -Encoding UTF8
$blog = Get-Content -LiteralPath 'site/samtalen-med-skolen.html' -Raw -Encoding UTF8

function Get-VisibleText([string]$html) {
  $withoutTags = [regex]::Replace($html, '<[^>]+>', ' ')
  $decoded = [System.Net.WebUtility]::HtmlDecode($withoutTags)
  return [regex]::Replace($decoded, '\s+', ' ').Trim()
}

$expectedHome = @(
  'Vårt mål',
  'Vi arbeider for at barn og unge skal bli sett, forstått og møtt på en måte som ivaretar hele mennesket – både deres evner, behov og livssituasjon.',
  'Et særlig fokusområde for oss er barn og unge med stort læringspotensial. Stort læringspotensial er ikke bare en styrke; det kan også være komplekst. Mange barn og unge med høye kognitive evner opplever å føle seg misforstått, utenfor eller utilstrekkelige. Noen strever med lav selvfølelse, manglende mestringsfølelse eller utfordringer i relasjoner, selv om de har gode forutsetninger for læring. Stort læringspotensial betyr heller ikke nødvendigvis jevnt gode prestasjoner eller at barnet får brukt ressursene sine på en god måte.',
  'Vi arbeider også med forebygging og håndtering av mobbing. Mobbing kan få alvorlige konsekvenser for barn og unges trygghet, tilhørighet, selvfølelse og læring. Derfor tilbyr vi veiledning og kurs som gir foreldre, barnehager, skoler og fagpersoner økt forståelse og konkrete verktøy til å forebygge, oppdage og håndtere mobbing på en trygg og god måte.',
  'Gjennom rådgivning, veiledning, kurs og webinarer ønsker vi å styrke de voksne rundt barnet. Tilbudet vårt bygger på forskningsbasert kunnskap og mer enn 30 års praktisk erfaring. Vi gir støtte til foreldre, ansatte i barnehage og skole, og andre fagpersoner som møter barn og unge i hverdagen.',
  'Vårt mål er at barn og unge – enten de strever med å bli forstått, opplever utenforskap eller står i utfordrende relasjoner – skal få riktig støtte til rett tid. Slik kan de oppleve trygghet, tilhørighet, mestring og gode muligheter for utvikling.'
)

$expectedParents = @(
  'Kjenner du deg igjen?',
  'Barnet ditt stiller uvanlig modne spørsmål, og du lurer på om det har stort læringspotensial.',
  'Du opplever at barnet ikke blir forstått i barnehagen eller på skolen.',
  'Du strever med å finne en opplæring som gir barnet nok faglige utfordringer og stimulering.',
  'Du er bekymret fordi barnet føler seg annerledes enn jevnaldrende.',
  'Du har et barn med stort læringspotensial og samtidig lærevanske eller diagnose og vet ikke hvordan du kan håndtere denne kompleksiteten.',
  'Du ønsker å støtte barnet som viser perfeksjonisme, uro eller angst, men er usikker på hvordan.',
  'Du ser at kjedsomhet i barnehagen/skolen kan føre til frustrasjon eller atferdsvansker.',
  'Du er usikker på hvordan du kan formidle barnets behov for tilrettelegging til barnehagen eller skolen.',
  'Kjenner du deg igjen i noe av dette?',
  'Ta kontakt',
  'Tilbud til foreldre',
  'Vi tilbyr individuell veiledning til foreldre som ønsker økt forståelse for barnets styrker, behov og utviklingsmuligheter.',
  'Med utgangspunkt i informasjon fra foreldre og et utviklingsintervju utarbeider vi en profil av barnets styrker og behov. På bakgrunn av dette kan dere få:',
  'en veiledningsrapport med konkrete råd om hvordan dere kan støtte barnets utvikling hjemme',
  'en rapport med anbefalinger til aktuelle tilpasninger i barnehage eller skole',
  'en praktisk støtteplan for en periode på 4–6 uker, som barnehagen eller skolen kan prøve ut',
  'kurs og webinarer for foreldregrupper om barn med stort læringspotensial.',
  'Veiledning og samtaler tilbys i helgene.',
  'Viktig merknad:',
  'Tilbudet er veilednings- og støttebasert og erstatter ikke en diagnostisk eller psykologisk utredning. Vurderingene bygger på opplysninger fra foreldrene og bør ved behov suppleres med observasjoner i barnehagen eller skolen.'
)

foreach ($text in $expectedHome) {
  if (-not $homeHtml.Contains($text)) { throw "Mangler på forsiden: $text" }
}
foreach ($text in $expectedParents) {
  if (-not $parents.Contains($text)) { throw "Mangler på foreldresiden: $text" }
}

$forbidden = @(
  'Hele mennesket skal bli sett og forstått',
  'Stort læringspotensial kan være komplekst',
  'Dette er eksempler til gjenkjennelse og refleksjon',
  'Individuell veiledning om barnets styrker og behov'
)
foreach ($text in $forbidden) {
  if ($homeHtml.Contains($text) -or $parents.Contains($text)) { throw "Uønsket redaksjonell tekst finnes fortsatt: $text" }
}

$recognitionItems = [regex]::Match($parents, '<ul class="recognition-list">(?<list>.*?)</ul>', 'Singleline').Groups['list'].Value
$offerItems = [regex]::Match($parents, '<ul class="offer-list">(?<list>.*?)</ul>', 'Singleline').Groups['list'].Value
if ([regex]::Matches($recognitionItems, '<li>').Count -ne 8) { throw 'Kjenner du deg igjen-listen skal ha nøyaktig 8 punkter.' }
if ([regex]::Matches($offerItems, '<li>').Count -ne 4) { throw 'Tilbud til foreldre-listen skal ha nøyaktig 4 punkter.' }

$expectedKindergartens = @(
  'Kurs og veiledning om mobbeatferd i barnehagen',
  'Vi tilbyr kurs, workshop og veiledning for barnehager som ønsker å forebygge, oppdage og håndtere mobbeatferd på en trygg og kunnskapsbasert måte. Tilbudet gir personalet økt forståelse, et felles språk og konkrete verktøy for å styrke inkludering, sosial kompetanse og et trygt psykososialt miljø. Kursene kan tilpasses hele personalgruppen, enkeltavdelinger, ledelse eller foreldregrupper.'
)
$expectedSchools = @(
  'Kurs og veiledning om mobbing i skolen',
  'Vi tilbyr kurs, workshop og veiledning for skoler som ønsker å forebygge, avdekke og håndtere mobbing på en trygg, systematisk og kunnskapsbasert måte. Tilbudet gir ansatte et felles språk, økt handlingskompetanse og konkrete verktøy for å skape et inkluderende og trygt skolemiljø.'
)
$expectedBlog = @(
  'Når samtalen med skolen blir vanskelig',
  'Å snakke med skolen om et barn med stort læringspotensial kan være krevende. Mange foreldre kjenner på følelsen av å måtte forklare, forsvare og dokumentere barnets behov – ofte uten å føle seg helt forstått.',
  'En nyere studie av Ben Artzey og Qadach (2024) viser at foreldre gjerne bruker tre ulike strategier i slike samtaler:',
  'Motivatoren søker samarbeid, deler informasjon og prøver å finne løsninger sammen med læreren.',
  'Regelhåndheveren viser til forskning, retningslinjer og regelverk når skolen ikke følger opp muligheter eller avtaler.',
  'Veilederen bruker mest energi på å støtte barnet direkte, blant annet ved å styrke selvstendighet, mestringsstrategier og læring utenfor skolen.',
  'De fleste foreldre vil nok kjenne seg igjen i alle tre rollene. Hvilken strategi som fungerer best, avhenger ofte av situasjonen, barnets behov og hvor åpen skolen er for dialog.',
  'Hvorfor blir det så følelsesladet?',
  'Foreldre tar ikke bare med seg kunnskap inn i møtet, men også bekymringer, håp og erfaringer. Når det gjelder eget barn, er det naturlig at følelsene blir sterke.',
  'Målet trenger ikke være å skjule følelsene, men å kombinere dem med tydelig kunnskap om hva barnet faktisk trenger: mindre repetisjon, raskere progresjon, større faglige utfordringer eller mer fleksible læringsmuligheter.',
  'Noen råd til møtet med skolen',
  'Forbered konkrete eksempler på barnets læringsbehov.',
  'Start med tanken om at dere har et felles mål: at barnet skal trives og utvikle seg.',
  'Snakk om behov fremfor merkelapper.',
  'Vær tydelig på hva dere ønsker å prøve ut.',
  'Oppsummer avtalene skriftlig etter møtet.',
  'Avtal et nytt møte for å evaluere tiltakene.',
  'Ta gjerne med en partner, fagperson eller annen støtteperson.',
  'Å tale barnets sak trenger ikke være en kamp du står i alene. Når foreldre, skole og fagpersoner klarer å samarbeide, blir det lettere å skape et læringsmiljø der barnet kan utvikle seg og trives.'
)

$kindergartenText = Get-VisibleText $kindergartens
$schoolText = Get-VisibleText $schools
$blogText = Get-VisibleText $blog
foreach ($text in $expectedKindergartens) { if (-not $kindergartenText.Contains($text)) { throw "Mangler på barnehagesiden: $text" } }
foreach ($text in $expectedSchools) { if (-not $schoolText.Contains($text)) { throw "Mangler på skolesiden: $text" } }
foreach ($text in $expectedBlog) { if (-not $blogText.Contains($text)) { throw "Mangler i blogginnlegget: $text" } }

$blogLists = [regex]::Matches($blog, '<ul class="topic-list">(?<list>.*?)</ul>', 'Singleline')
if ($blogLists.Count -ne 2) { throw 'Blogginnlegget skal ha to punktlister.' }
$blogListItems = ($blogLists | ForEach-Object { [regex]::Matches($_.Groups['list'].Value, '<li>').Count } | Measure-Object -Sum).Sum
if ($blogListItems -ne 10) { throw 'Blogginnlegget skal ha nøyaktig 10 punkter.' }

Write-Output 'OK: Ellas norske tekst er ordrett gjengitt på forsiden, foreldresiden, barnehagesiden, skolesiden og i blogginnlegget.'
