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
- **Benutzerkonten**: Registrierung per E-Mail/Passwort mit
  Bestätigungs-E-Mail (via Supabase Auth). Jeder Account sieht ausschließlich
  seine eigenen Kategorien und Buchungen.

Login und Daten laufen über [Supabase](https://supabase.com) (Postgres +
Auth). Die Datenbank ist per Row Level Security so abgesichert, dass jede
Zeile nur vom eigenen Konto gelesen/geschrieben werden kann – der im Client
verwendete Publishable-Key ist dafür ausgelegt, öffentlich zu sein.

## Supabase einrichten

Einmalig nötig, bevor sich jemand registrieren kann:

1. Im Supabase-Projekt → **SQL Editor** → neue Query → Inhalt von
   [`supabase/schema.sql`](./supabase/schema.sql) einfügen und ausführen.
   Das legt die Tabellen `categories`/`transactions` inkl. Row-Level-Security
   an, damit jedes Konto nur seine eigenen Daten sieht.
2. **Authentication → Providers → Email**: "Confirm email" aktiviert lassen
   (Standard), damit nach der Registrierung eine Bestätigungs-E-Mail
   verschickt wird.
3. **Authentication → URL Configuration**: Site URL auf die GitHub-Pages-URL
   setzen (z.B. `https://<benutzername>.github.io/Haushaltsrechner/`), damit
   der Bestätigungslink in der E-Mail zurück auf die App führt.

Projekt-URL und Publishable-Key stehen in `src/lib/supabaseClient.ts`. Der
Publishable-Key ist bewusst öffentlich (kein Secret) – der eigentliche Schutz
kommt von den RLS-Policies in `supabase/schema.sql`.

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
