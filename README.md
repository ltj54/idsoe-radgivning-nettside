# Idsøe Rådgivning

Dette repositoriet inneholder nettsiden og lokale utviklingsverktøy for Idsøe Rådgivning.

## Prosjektstruktur

- HTML-, CSS-, JavaScript- og bildefilene i rotmappen er kildefilene for både forhåndsvisningen på GitHub Pages og produksjonssiden hos Domeneshop.
- `scripts/` og `start.ps1` brukes til lokal forhåndsvisning og kontroll.
- `docs/` inneholder lokale arbeidsdokumenter og er bevisst utelatt fra Git. Gjennomgå filer nøye før denne regelen endres.

## Forhåndsvis lokalt

Åpne prosjektmappen i IntelliJ IDEA, velg `Start Idsoe Radgivning` i Run-menyen øverst og trykk den grønne Run-knappen. Dette starter nettsiden lokalt og åpner nettleseren. `publish-site.ps1` er til publisering og skal ikke brukes for lokal forhåndsvisning.

Alternativt kan du kjøre:

```powershell
.\start.ps1
```

Python 3 må være tilgjengelig i `PATH`. Forhåndsvisningen åpnes på `http://127.0.0.1:8765`.

## Kontroller og publiser nettsideendringer

Kjør `python scripts/check_site.py` for å kontrollere kildefilene. Kjør deretter:

```powershell
.\publish-site.ps1
```

Skriptet oppdaterer versjonsparameteren for CSS og JavaScript, kontrollerer filene og legger bare nettsidefilene i staging. Kontroller endringene før commit. Når du uttrykkelig vil commite, pushe og publisere nettsideendringen, kjør:

```powershell
.\publish-site.ps1 -Publish
```

Skriptet pusher kildefilene til GitHub og laster deretter nettstedfilene opp til `public_html/default` hos Domeneshop via SFTP. SFTP-passordet etterspørres under publisering og skal ikke lagres i prosjektet. Produksjonssiden ligger på `https://emidsoe.no/`; GitHub Pages beholdes som forhåndsvisning og versjonshistorikk.

Versjonsparameteren sørger for at nettleseren henter oppdatert CSS og JavaScript etter publisering.
