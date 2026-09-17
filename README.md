# Idsøe Rådgivning

Dette repositoriet inneholder nettsidekilden og lokale utviklingsverktøy for Idsøe Rådgivning.

## Prosjektstruktur

- `site/` inneholder redigerbar kilde for nettsiden.
- HTML-, CSS-, JavaScript- og bildefilene i rotmappen er den gjeldende GitHub Pages-publiseringen.
- `scripts/` og `start.ps1` brukes til lokal forhåndsvisning og kontroll.
- `docs/` inneholder lokale arbeidsdokumenter og er bevisst utelatt fra Git. Gjennomgå filer nøye før denne regelen endres.

## Forhåndsvis lokalt

Åpne prosjektmappen i IntelliJ IDEA og kjør:

```powershell
.\start.ps1
```

Python 3 må være tilgjengelig i `PATH`. Forhåndsvisningen åpnes på `http://127.0.0.1:8765`.

## Kontroller og publiser nettsideendringer

Kjør `python scripts/check_site.py` for å kontrollere kildefilene. Kjør deretter:

```powershell
.\publish-site.ps1
```

Skriptet kopierer filene fra `site/` til GitHub Pages-rotmappen og legger bare disse nettsidefilene i staging. Kontroller endringene før commit. Når du uttrykkelig vil commite og pushe nettsideendringen, kjør:

```powershell
.\publish-site.ps1 -Publish
```

GitHub Pages serverer nettsiden fra rotmappen. `site/` er redigerbar kilde; publisering kopierer filene derfra til mappen som Pages viser.
