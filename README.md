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

## Deployment

`npm run build` erzeugt ein statisches `dist/`-Verzeichnis, das sich z.B. per
GitHub Pages, Netlify oder Vercel hosten lässt.
