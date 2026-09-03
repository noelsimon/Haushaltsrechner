# Haushaltsrechner

Kleine Web-App zum Erfassen von Einnahmen und Ausgaben nach Kategorie – als
Ersatz für die bisherige Google-Sheets-Tabelle (Eingabetabelle +
Finanzfluss-Übersicht).

## Funktionen

- **Erfassen**: Einnahme oder Ausgabe mit Datum, Kategorie, Beschreibung und
  Betrag eintragen; Liste aller Einträge gruppiert nach Monat, mit
  Bearbeiten/Löschen.
- **Übersicht**: Einnahmen, Ausgaben und Überschuss pro Monat, Ausgaben nach
  Kategorie sowie ein Verlaufs-Chart über alle Monate.
- **Kategorien**: Die Kategorien aus der ursprünglichen Tabelle sind
  vorbelegt (Lebensmittel, Wohnen, Reisen, Ausgehen, Sport, Sparen –
  Consors/Taures/Altersvorsorge/Bondora, …) und lassen sich um eigene
  Kategorien erweitern.

Alle Daten werden lokal im Browser gespeichert (`localStorage`) – es gibt
keinen Server und keine Anmeldung.

## Entwicklung

```bash
npm install
npm run dev
```

Weitere Skripte:

```bash
npm run build    # Typecheck + Produktionsbuild nach dist/
npm run lint      # oxlint
npm run preview   # gebautes dist/ lokal ansehen
```

## Deployment (GitHub Pages)

Die App wird automatisch auf GitHub Pages veröffentlicht: Ein GitHub-Actions-
Workflow (`.github/workflows/deploy.yml`) baut bei jedem Push auf
`claude/haushaltrechner-app-m25ujg` die App (`npm run build`) und deployt den
Inhalt von `dist/`.

Damit die Seite live ist, muss Pages in den Repo-Einstellungen einmalig auf
Actions gestellt werden:

1. Repo auf GitHub öffnen → **Settings → Pages**
2. Unter **Build and deployment → Source** die Option **GitHub Actions**
   auswählen (nicht "Deploy from a branch")
3. Danach im Tab **Actions** den Workflow **Deploy to Pages** einmal laufen
   lassen (oder einfach erneut pushen)

Die Seite ist anschließend unter
`https://<dein-github-benutzername>.github.io/Haushaltsrechner/` erreichbar.

`npm run build` erzeugt lokal ein statisches `dist/`-Verzeichnis, das sich
auch anderweitig hosten lässt (Netlify, Vercel, …). Der `base`-Pfad in
`vite.config.ts` ist aktuell auf `/Haushaltsrechner/` gesetzt (passend zum
Repo-Namen als GitHub-Pages-Projektseite) – bei einem anderen Hosting-Pfad
muss dieser Wert entsprechend angepasst werden.
