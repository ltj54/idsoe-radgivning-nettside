$ErrorActionPreference = 'Stop'

$homeHtml = Get-Content -LiteralPath 'site/index.html' -Raw -Encoding UTF8
$parents = Get-Content -LiteralPath 'site/foreldre.html' -Raw -Encoding UTF8

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
  'Ta gjerne kontakt.',
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

Write-Output 'OK: Ellas norske tekst er ordrett gjengitt; 8 gjenkjennelsespunkter og 4 tilbudspunkter.'
