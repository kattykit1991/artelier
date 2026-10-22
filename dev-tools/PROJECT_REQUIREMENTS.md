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
| FR003 | Artwork Zod Schema              | Create ArtworkSchema covering at least id, title, artist_title, image_id, with sensible defaults for missing data.                                         | 🟡 In Arbeit | 🟠 Hinweise |
| FR004 | API Fetch with Validation       | Implement a helper that queries the AIC search endpoint, parses the JSON, and validates it with ArtworkSchema. Reject or handle invalid data.              | ⬜ Offen | 🔴 FAIL |
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
Implementierungsstatus und Reviewstatus sind unabhängig: „In Arbeit“ bedeutet hier teilweise umgesetzt; „Offen“ bedeutet noch nicht umgesetzt. FAIL bei FR004–FR011 bezeichnet die fehlende Implementierung, keinen fehlgeschlagenen Laufzeittest.

### FR001–FR002 · Projektgerüst und Zod

- **FR001 · Review: Hinweise.** React-/TypeScript-Einstieg in `src/main.tsx`, Starteroberfläche in `src/App.tsx`, Vite-Konfiguration und installierte Abhängigkeiten vorhanden. Der historische Scaffold-Befehl aus der Originalanforderung ist nicht sicher nachweisbar; der Bauplan nennt `kat-create`. Browserstart und Darstellung wurden in diesem Audit nicht geprüft.
- **FR002 · Review: PASS.** Zod steht in `package.json` und Lockfile; `npm ls --depth=0` bestätigt lokal Zod 4.6.7. Der Schema-Import funktioniert in der Laufzeitprüfung.

### FR003 · Artwork Zod Schema

**Implementierung:** Teilweise umgesetzt · **Review:** Hinweise

**Notizen:**

- `src/schemas/artworkSchema.ts` exportiert `ArtworkSchema` und den mit `z.infer<typeof ArtworkSchema>` abgeleiteten Typ `Artwork` korrekt.
- Alle vier geforderten Felder sind enthalten. `id` ist eine erforderliche Zahl; fehlende IDs und falsche Feldtypen werden abgelehnt.
- `title` und `artist_title` erlauben fehlende Werte und `null`; die Transformation liefert dann `Untitled` bzw. `Artist unknown.`.
- `image_id` ist ein erforderlicher String oder `null`. Ein vollständig fehlendes Feld wird abgelehnt. Ob die API dieses Feld immer liefert, ist ohne geprüfte API-Antwort offen; für fehlende Bilddaten ist die Behandlung noch nicht vollständig geklärt.
- Leere Strings werden bei allen drei Textfeldern unverändert akzeptiert. Die im Bauplan vorgesehene Behandlung leerer Angaben ist damit noch offen.
- Laufzeitstichproben mit dem tatsächlichen Schema: vollständiger Datensatz, `null`-Werte und fehlende Titel/Künstlerangaben erfolgreich; fehlendes `image_id`, fehlende ID und falsche Feldtypen abgelehnt; leere Strings akzeptiert. Dies sind synthetische Eingaben, keine API-Integrationstests.

### FR004–FR011 · API, Suche und Galerie

**Implementierung:** Noch nicht umgesetzt · **Review:** FAIL (Codeabgleich)

- **FR004:** Kein API-Helper, Fetch oder Validierungsaufruf im Anwendungscode vorhanden.
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
- `strict` und `strictNullChecks` sind in den aktuellen TypeScript-Konfigurationen nicht aktiviert. Der erfolgreiche Typcheck belegt daher keine strenge Nullsicherheit; dies ist insbesondere beim Abgleich von Zod-Laufzeitdaten und TypeScript-Typen relevant.

### Prüfungen und Git-Stand

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
