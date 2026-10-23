# 👻 PROJECT REQUIREMENTS · FR BLERPSI

> Was soll mein Projekt können?
> Hier sammle und überprüfe ich die Anforderungen aus der Originalaufgabenstellung.

**Projekt:** Artelier 🎨
**Version:** Pilot v0.1
**Quelle:** WBS Coding School · React + TypeScript Mini Project

---

## 📜 ORIGINAL REQUIREMENTS

Die folgenden Anforderungen stammen aus der WBS-Aufgabenstellung.
Die englischen Beschreibungen bleiben unverändert.

| ID    | Functional Requirement          | Description                                                                                                                                                | Status       | Review           |
| ----- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------- |
| FR001 | React + Vite (TypeScript) Setup | Scaffold a new project with npm create vite@latest my-app -- --template react-ts                                                                           | 🟢 Umgesetzt | 🟠 Hinweise |
| FR002 | Install Core Dependencies       | Add Zod via npm install zod.                                                                                                                               | 🟢 Umgesetzt | 🟢 PASS |
| FR003 | Artwork Zod Schema              | Create ArtworkSchema covering at least id, title, artist_title, image_id, with sensible defaults for missing data.                                         | 🟢 Umgesetzt | 🟢 PASS |
| FR004 | API Fetch with Validation       | Implement a helper that queries the AIC search endpoint, parses the JSON, and validates it with ArtworkSchema. Reject or handle invalid data.              | 🟡 In Arbeit | 🟠 Hinweise |
| FR005 | Search Interface                | Create a search interface that allows users to query the API.                                                                                              | ⬜ Offen | 🔴 FAIL |
| FR006 | ArtworkCard Component           | Build a reusable ArtworkCard component to display individual pieces of art from the search results. This component will show the image, title, and artist. | ⬜ Offen | 🔴 FAIL |
| FR007 | Gallery Component               | Develop a Gallery component that will display the collection of artworks the user has saved.                                                               | ⬜ Offen | 🔴 FAIL |
| FR008 | Create — Add to Gallery         | When the user clicks “Add to Gallery,” push the artwork object into localStorage.                                                                          | ⬜ Offen | 🔴 FAIL |
| FR009 | Read — Display Gallery          | Ensure Gallery shows every saved artwork using ArtworkCard                                                                                                 | ⬜ Offen | 🔴 FAIL |
| FR010 | Update — Notes per Artwork      | Allow users to add / edit a short text note on each saved artwork; validate this note with a simple Zod schema.                                            | ⬜ Offen | 🔴 FAIL |
| FR011 | Delete — Remove from Gallery    | Provide a control to delete an artwork (and its note) from gallery state.                                                                                  | ⬜ Offen | 🔴 FAIL |
| FR012 | Type-Safe State                 | Maintain TypeScript types throughout components and state, re-using the Zod-inferred types where possible.                                                 | 🟡 In Arbeit | 🟠 Hinweise |

---

## 🚦 STATUS-LEGENDE

### Implementierung

- ⬜ Offen
- 🟡 In Arbeit
- 🟢 Umgesetzt

### Review

- ⚪ Nicht geprüft
- 🟢 PASS
- 🟠 Hinweise
- 🔴 FAIL

---

## 🔍 REVIEW-NOTIZEN

Hier werden nur relevante Prüfergebnisse festgehalten.

**Audit:** 22.10.2026 · aktueller Arbeitsbaum einschließlich unversionierter Dateien.
Implementierungsstatus und Reviewstatus sind unabhängig: „In Arbeit“ bedeutet hier teilweise umgesetzt; „Offen“ bedeutet noch nicht umgesetzt. FAIL bei FR005–FR011 bezeichnet die fehlende Implementierung, keinen fehlgeschlagenen Laufzeittest.

### FR001–FR002 · Projektgerüst und Zod

- **FR001 · Review: Hinweise.** React-/TypeScript-Einstieg in `src/main.tsx`, Starteroberfläche in `src/App.tsx`, Vite-Konfiguration und installierte Abhängigkeiten vorhanden. Der historische Scaffold-Befehl aus der Originalanforderung ist nicht sicher nachweisbar; der Bauplan nennt `kat-create`. Browserstart und Darstellung wurden in diesem Audit nicht geprüft.
- **FR002 · Review: PASS.** Zod steht in `package.json` und Lockfile; `npm ls --depth=0` bestätigt lokal Zod 4.6.7. Der Schema-Import funktioniert in der Laufzeitprüfung.

### FR003 · Artwork Zod Schema

**Nachprüfung:** 23.10.2026 · **Implementierung:** Umgesetzt · **Review:** PASS

- Alle vier Originalfelder sind vorhanden. Fehlende oder `null` gesetzte Titel/Künstlerangaben werden zu `Untitled` bzw. `Artist unknown.` normalisiert. Fehlendes oder `null` gesetztes `image_id` wird jetzt zu `null` normalisiert.
- Fehlende IDs sowie IDs mit String, `null`, `NaN` oder `Infinity` werden abgelehnt; es wird keine ID erfunden. Ein numerisches `image_id` wird ebenfalls abgelehnt.
- **14/14 Laufzeitfälle bestanden:** vollständiges Kunstwerk; Künstler `null` und fehlend; Titel `null` und fehlend; Bild-ID `null` und fehlend; falscher Bild-ID-Typ; ID fehlend und vier ungültige ID-Werte; leere Strings. Die Tests prüfen erwartete Ausgabewerte bzw. erwartete Ablehnung mit Assertions direkt am tatsächlichen Schema, ohne Testdateien anzulegen.
- `ArtworkSchema` und `Artwork` sind korrekt exportiert. Die TypeScript-Compiler-API bestätigt für `z.infer` den Ausgabetyp `{ id: number; title: string; artist_title: string; image_id: string | null }` ohne optionale Felder und ohne `undefined`. Die projektweite Typprüfung über die Compiler-API meldet keine Diagnosen; eine zusätzliche Prüfung mit nur im Speicher explizit aktiviertem `strictNullChecks` liefert denselben Typ.
- **Korrektur des früheren Audits:** Die fehlenden expliziten Strict-Optionen sind hier kein Konfigurationsfehler. Installiert ist TypeScript 6.0.3; seit 6.0 ist `strict` standardmäßig aktiv. Die Compiler-API bestätigt effektiv `strictNullChecks` und `noImplicitAny`. Damit ist die Strict-Voraussetzung von Zod erfüllt. Keine Konfiguration wurde geändert. Quellen: [TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [Zod Requirements](https://zod.dev/#requirements).
- **Leere Strings:** Werden unverändert akzeptiert. Kein FR003-Blocker: Die Originalanforderung und die bestätigten Ersatzwertregeln verlangen die Behandlung fehlender bzw. `null` gesetzter Werte, keine Mindestlänge. Eine spätere Normalisierung leerer Strings ist eine mögliche Verbesserung, keine zusätzliche Abschlussbedingung.
- **Manuelle API-Stichprobe laut Kat:** `https://api.artic.edu/api/v1/artworks/search?q=cat&fields=id,title,artist_title,image_id&limit=3` lieferte drei Datensätze mit ID, Titel und Bild-ID; Künstler zweimal String, einmal `null`; Bild-IDs dreimal String. Diese Beobachtung wurde hier nicht erneut live abgerufen und beweist keine allgemeinen API-Garantien. Die Schema-Tests verwenden synthetische Daten.
- **Geplant für FR006:** Bei `image_id === null` soll ArtworkCard `No image available.` anzeigen. Diese Anzeige ist noch nicht implementiert und gehört nicht zum Abschluss von FR003.

### FR004 · API Fetch with Validation

**Checkpoint:** 23.10.2026 · **Implementierung:** Teilweise umgesetzt · **Review:** Hinweise (Codeabgleich; Abschlussprüfung offen)

- `src/services/artworkServices.ts`: `artworkSearch(query: string)` fragt asynchron den AIC-Suchendpunkt ab; der Suchbegriff wird mit `encodeURIComponent()` kodiert.
- `response.ok` wird geprüft; HTTP-Fehler werfen `Error`. Die JSON-Antwort wird gelesen, `data.data` extrahiert, mit `z.array(ArtworkSchema).parse(...)` validiert und die validierte Liste zurückgegeben. Ungültige Daten werden durch eine Zod-Exception abgelehnt; ein ungültiger Eintrag verwirft damit den gesamten Parse-Vorgang.
- Noch offen, in geplanter Reihenfolge: `fields=id,title,artist_title,image_id` ergänzen, Funktion exportieren, FR004 abschließend prüfen.
- Keine Service-Laufzeit- oder Live-API-Tests in diesem Checkpoint. Fehlerbehandlung und Rückgabe sind im Code belegt, aber nicht als bestandene Funktionstests bewertet.
- Aktuelle Typprüfung: `tsc -p tsconfig.app.json --noEmit --incremental false` scheitert mit TS6133, weil `artworkSearch` noch ungenutzt ist. `npm run lint` endet mit Exitcode 0 und einer Warnung zur ungenutzten Funktion. Das ist ein gesicherter Zwischenstand, kein fehlerfreier Abschluss.

### FR005–FR011 · Suche und Galerie

**Implementierung:** Noch nicht umgesetzt · **Review:** FAIL (Codeabgleich)

- **FR005:** Keine Suchoberfläche oder Suchzustände; `App.tsx` enthält die Starterseite mit Zähler.
- **FR006:** Keine ArtworkCard-Komponente oder Darstellung von Kunstwerkdaten vorhanden.
- **FR007:** Keine Gallery-Komponente oder Galerieverwaltung vorhanden.
- **FR008:** Kein „Add to Gallery“ und keine Speicherung in `localStorage` vorhanden.
- **FR009:** Keine Anzeige gespeicherter Kunstwerke über ArtworkCard vorhanden.
- **FR010:** Kein Notizenschema und keine Notizbearbeitung vorhanden.
- **FR011:** Kein Entfernen von Kunstwerken oder zugehörigen Notizen vorhanden.
- Laufzeitverhalten dieser Funktionen bleibt ungeprüft, weil ihre Implementierung fehlt. API-Antworten und Browserpersistenz wurden nicht getestet.

### FR012 · Type-Safe State

**Implementierung:** Teilweise umgesetzt · **Review:** Hinweise

- TypeScript-Projekt und Zod-inferierter Artwork-Typ vorhanden. Der Starterzähler verwendet inferierten Zahlen-State.
- Der Artwork-Typ wird bisher in keiner Komponente und keinem fachlichen State verwendet; Such- und Galerie-State fehlen noch.
- Nachprüfung 23.10.2026: Der frühere Strict-Hinweis war unzutreffend; TypeScript 6.0.3 aktiviert Strict-Prüfungen standardmäßig (Nachweis und Quellen siehe FR003). FR012 bleibt wegen der noch fehlenden fachlichen Verwendung des Artwork-Typs teilweise umgesetzt.

### Prüfungen und Git-Stand · Audit vom 22.10.2026

Historischer Prüfstand; aktuelle FR003-/FR004-Ergebnisse stehen oben. Die damaligen erfolgreichen Typ-/Lintprüfungen gelten nicht als Nachweis für den heutigen Service-Zwischenstand.

- **PASS:** `npm run lint` (Oxlint, ohne Fix-Option).
- **PASS:** `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit --incremental false` und dieselbe Prüfung für `tsconfig.node.json`; keine Build- oder Cachedateien erzeugt.
- **PASS:** Lokaler Abhängigkeitsabgleich mit `npm ls --depth=0`.
- **Ungeprüft:** Produktions-Build und Browserdarstellung. `npm run build` wurde nicht ausgeführt, weil es Build-Ausgaben und TypeScript-Buildinformationen schreibt. Die Typprüfung ersetzt keinen Vite-Build oder Browsertest.
- **Git vor dem Audit:** `package.json` und `package-lock.json` geändert (Zod ergänzt); `dev-tools/PROJECT_REQUIREMENTS.md` und `src/schemas/` unversioniert. Das Schema wurde als vorhandener Arbeitsstand geprüft, ist aber noch nicht im Commit gesichert. Keine Commits oder Pushes durchgeführt.

---

## 🧪 PILOT-FEEDBACK

Dieses Dokument wird als mögliches neues KAT · DEV TOOL getestet.

**Was funktioniert gut?**

- Noch offen.

**Was ist unnötig oder doppelt?**

- Noch offen.

**Was sollte verbessert werden?**

- Noch offen.

**Ergebnis für den Dev-Identity-Chat:**

- Noch ausstehend.

---

> 👻 FR BLERPSI · KAT · DEV TOOLS Pilot v0.1
> Noch kein offizieller Bestandteil des Toolkits.
