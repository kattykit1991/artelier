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
| FR001 | React + Vite (TypeScript) Setup | Scaffold a new project with npm create vite@latest my-app -- --template react-ts                                                                           | 🟢 Umgesetzt | 🟢 PASS |
| FR002 | Install Core Dependencies       | Add Zod via npm install zod.                                                                                                                               | 🟢 Umgesetzt | 🟢 PASS |
| FR003 | Artwork Zod Schema              | Create ArtworkSchema covering at least id, title, artist_title, image_id, with sensible defaults for missing data.                                         | 🟢 Umgesetzt | 🟢 PASS |
| FR004 | API Fetch with Validation       | Implement a helper that queries the AIC search endpoint, parses the JSON, and validates it with ArtworkSchema. Reject or handle invalid data.              | 🟢 Umgesetzt | 🟠 Hinweise |
| FR005 | Search Interface                | Create a search interface that allows users to query the API.                                                                                              | 🟢 Umgesetzt | 🟢 PASS |
| FR006 | ArtworkCard Component           | Build a reusable ArtworkCard component to display individual pieces of art from the search results. This component will show the image, title, and artist. | 🟢 Umgesetzt | 🟠 Hinweise |
| FR007 | Gallery Component               | Develop a Gallery component that will display the collection of artworks the user has saved.                                                               | 🟢 Umgesetzt | 🟢 PASS |
| FR008 | Create — Add to Gallery         | When the user clicks “Add to Gallery,” push the artwork object into localStorage.                                                                          | 🟢 Umgesetzt | 🟢 PASS |
| FR009 | Read — Display Gallery          | Ensure Gallery shows every saved artwork using ArtworkCard                                                                                                 | 🟢 Umgesetzt | 🟢 PASS |
| FR010 | Update — Notes per Artwork      | Allow users to add / edit a short text note on each saved artwork; validate this note with a simple Zod schema.                                            | 🟢 Umgesetzt | 🟢 PASS |
| FR011 | Delete — Remove from Gallery    | Provide a control to delete an artwork (and its note) from gallery state.                                                                                  | 🟢 Umgesetzt | 🟢 PASS |
| FR012 | Type-Safe State                 | Maintain TypeScript types throughout components and state, re-using the Zod-inferred types where possible.                                                 | 🟢 Umgesetzt | 🟢 PASS |

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

**Prüfstand: 25.10.2026 · Präsentationsvorbereitung.** Implementierung und Review sind getrennt: Alle zwölf FRs sind im Code umgesetzt. PASS bezeichnet den unten belegten lokalen Code-/Teststand, keine Bestätigung des noch ausstehenden Deployments. FR004 behält wegen des noch ausstehenden Deployments der Produktionskorrektur und FR006 wegen externer Bildverfügbarkeit den Reviewstatus „Hinweise“.

### FR001–FR003 · Grundlage und Schema

- **FR001 · PASS:** React/Vite/TypeScript vorhanden; Initialisierung mit `kat-create` von Kat bestätigt. Produktions-Build und lokale Safari-Darstellung geprüft. Kein nachträglicher Wechsel des Scaffold-Tools erforderlich.
- **FR002 · PASS:** Zod als bestehende Abhängigkeit vorhanden und in Schema-, Service- und Notiztests verwendet. Keine neuen Dependencies hinzugefügt.
- **FR003 · PASS:** `ArtworkSchema` und exportierter `Artwork`-Typ mit `z.infer` bleiben erhalten. Fehlende/`null`-Titel → `Untitled`, Künstler → `Artist unknown.`, Bild-ID → `null`; fehlende/ungültige IDs werden abgelehnt. Die Nachprüfung vom 23.10. bestätigte 14/14 Schemafälle; aktuelle Service-Tests bestätigen Transformationen und Ablehnung ungültiger Einträge. Leere Strings bleiben erlaubt und sind unter den festgelegten Regeln kein Blocker.
- Der frühere Strict-Hinweis wurde am 23.10. korrigiert: TypeScript 6.0.3 aktiviert `strict` standardmäßig. Der aktuelle Build typprüft App, Vite-Konfiguration und Pages Function. Quellen: [TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [Zod Requirements](https://zod.dev/#requirements).

### FR004 · API Fetch with Validation

**Implementierung:** Umgesetzt · **Review:** Hinweise (Produktionskorrektur lokal vorbereitet; erneutes Deployment offen)

- Der exportierte Helper fragt jetzt direkt `https://api.artic.edu/api/v1/artworks/search` ab: kodierter Suchbegriff, vier feste Felder, maximal zehn Treffer. Der bestehende öffentliche, vom Museum dokumentierte CORS-Zugriff benötigt keine Secrets oder neuen Dependencies. `no-referrer` bleibt erhalten; Cookies werden mit `credentials: "omit"` ausgeschlossen, Timeout nach zehn Sekunden.
- HTTP- und JSON-Content-Type-Prüfung sowie Zod-Validierung des `{ data: Artwork[] }`-Umschlags bleiben erhalten. Rückgabe bleibt `Promise<Artwork[]>`. Design, Galerie, Notizen und localStorage sind unverändert.
- **Produktionsdiagnose nach Deployment am 25.10.2026:** Live-Domain und Pages-Deployment liefern am Function-Pfad 502/JSON. Der zugängliche produktive Cloudflare-Log-Tail zeigt `AIC search upstream error { status: 403 }`, keine Function-Exception. Die Function wandelt diesen Upstream-403 in 502 um. Derselbe Request direkt vom Rechner liefert 200/JSON mit `Access-Control-Allow-Origin: *`.
- **Grenze der Diagnose:** Die vorhandenen Logs erfassen weder Upstream-Body noch dessen Header. Deshalb ist keine konkrete Challenge oder einzelne WAF-/IP-Regel nachgewiesen. Belegt ist der unterschiedliche Ausgang aus tatsächlicher Cloudflare-Edge und lokalem Runtime/Rechner; weitere Header-Experimente wurden unterlassen.
- **Zulässige Alternative tatsächlich geprüft:** Safari direkt aus `https://artelier.katcoded.de` → Museum-API: 200, CORS-Antwort lesbar, zehn Datensätze. Anschließend das Live-Suchformular mit ausschließlich temporär im Tab umgeleitetem Suchtransport ausgeführt: zehn Zod-validierte Karten und tatsächlich sichtbare Bilder. Kein Deployment verändert; Testadapter durch Neuladen vollständig entfernt. Dies ist ein End-to-End-Transporttest, keine Abnahme eines neu deployten Bundles.
- **QA:** `npm run build`, `npm run lint`, `npm run test` (23/23) erfolgreich. Der Service-Test prüft jetzt den offiziellen CORS-Endpunkt, Query, Felder, Limit, ausgeschlossene Cookies und Timeout. Frühere Pages-Handler-Tests bleiben technische Regressionstests; sie beweisen keine Erreichbarkeit von Cloudflare-Edge zum Museum.
- **Nach Deployment:** Der Browser verwendet die Pages Function und den Vite-Proxy nicht mehr. Beide Dateien bleiben für diesen minimalen Fix unverändert, sind aber nicht der aktive Suchtransport. Die alte `/api/v1/...`-Function kann weiterhin 502 liefern; maßgeblich ist die ausgehende Browseranfrage an `api.artic.edu`.
- Referenz: [AIC-Dokumentation zu CORS und öffentlichem API-Zugriff](https://api.artic.edu/docs/). Keine Umgehung einer Challenge, kein Spoofing von Herkunfts-/Client-IP-Headern und kein weiterer Proxy-Dienst.

### FR005–FR009 · Suche, Karten und Galerie

- **FR005 · PASS:** Kontrolliertes Suchformular, Enter und Whooosh, typisierter Ergebnis-State, Ladezustand, Fehleranzeige, Leerergebnis-Hinweis. Safari-Suche mit Enter und Button sowie Navigation zwischen Explore und My Gallery durchgeführt. Fehlerfälle des Services automatisiert geprüft; nicht jeder Fehlerfall separat in der UI ausgelöst.
- **FR006 · Hinweise:** Wiederverwendbare `ArtworkCard.tsx` zeigt Titel, Künstler und IIIF-Bild. Fehlende oder fehlgeschlagene Bilder erhalten einen gestalteten Fallback. Safari hat lokale 403-Bildfehler und die korrekt dargestellten Fallbacks bestätigt. Der offizielle Bildhost und die Bildgröße bleiben erhalten.
- **FR007 · PASS:** Eigene `Gallery`-Komponente in separater My-Gallery-Ansicht, einschließlich freundlichem Leerzustand. In Safari geprüft.
- **FR008 · PASS:** Hinzufügen, sichtbarer/gesperrter Saved-Zustand und Duplikatschutz vorhanden. Galerie wird unter `artelier-gallery` in localStorage gespeichert und beim Start mit `GallerySchema` geprüft. Safari: Hinzufügen und Wiederherstellung nach Neuladen erfolgreich. Fehlgeschlagene Speicherzugriffe führen zu einer Warnung statt einem App-Absturz; dieser Ausnahmefall ist nur im Code geprüft.
- **FR009 · PASS:** Gespeicherte Kunstwerke verwenden dieselbe ArtworkCard. In Safari vor und nach Reload gesehen.

### FR010–FR012 · Notizen, Entfernen und Typen

- **FR010 · PASS:** Notiz pro Werk, kontrolliertes Textfeld mit maximal 500 Zeichen; Zod-Prüfung vor State-Änderung und im gespeicherten Datenmodell. Safari: Notiz eingegeben, nach Reload wiederhergestellt. Automatisiert: 500 Zeichen akzeptiert, 501 abgelehnt, JSON-Rundlauf und ungültige gespeicherte Daten geprüft.
- **FR011 · PASS:** Entfernen filtert den gesamten Galerieeintrag einschließlich Notiz. Safari: Entfernen und leerer Galerie-Zustand bestätigt; auch nach erneutem Seitenaufruf bleibt der Testeintrag entfernt.
- **FR012 · PASS:** `Artwork[]`, `SavedArtwork[]` und Ansichts-State typisiert; Typen aus Zod wiederverwendet, Such-JSON ist `unknown` bis zur Validierung. TypeScript-Prüfung ohne Fehler.

### Tatsächlich ausgeführte Qualitätssicherung

- `npm run build`: PASS, einschließlich aller drei TypeScript-Projekte und Vite-Produktions-Build.
- `npm run lint`: PASS, keine Warnungen. Die zwei begründeten lokalen Ausnahmen betreffen das Melden externer localStorage-Schreibfehler aus dem Synchronisierungseffekt.
- `npm run test`: **23/23 PASS**. Handler-Methoden/Parameter, festes Upstream-Ziel, Header, HTTP-/Netzwerk-/Timeout-/HTML-Fehler; Service-Transformationen, ungültige Daten, leere Trefferliste; Notizgrenze und persistierte Daten. Mocks sind keine Live-API-Nachweise.
- Safari: lokale Vite-Suche; gebautes Frontend mit Pages Function ohne Vite-Proxy; Speichern, gesperrter Saved-Zustand, Galerie, Notiz, Reload und Entfernen; Desktop-Ansicht und mobiles Kartenlayout bei 320 Pixeln geprüft. Eigene Testnotiz und Testeintrag wieder entfernt.
- Safari-Konsole am Pages-Test: Bild-HTTP-403 sichtbar; keine weitere unbehandelte JavaScript-Exception im beobachteten Stand. Nicht geladene Bilder werden abgefangen und zeigen den Fallback.

### Produktionsgrenzen und verbleibende Prüfung

- **Produktionsfix noch nicht deployt.** Der CUTE_COZY-Stand ist bereits veröffentlicht; seine Function erhält produktiv Upstream-403 und liefert 502. Der jetzt vorbereitete Direktzugriff benötigt ein neues Git-/Pages-Deployment nach Freigabe. Build bleibt `npm run build`, Ausgabe `dist`. Die alte Function bleibt vorhanden, wird von der korrigierten Suche aber nicht mehr aufgerufen.
- **Bildserver bleibt extern:** HTTP-Test mit Referer `https://artelier.katcoded.de/` lieferte ein echtes JPEG (200). Dies beweist keinen erfolgreichen eingebetteten Safari-Bildtest auf der neuen Live-Seite. Lokal liefert der Server weiterhin teilweise 403/HTML. Keine spekulativen Hostwechsel oder Bildproxy-Infrastruktur eingebaut. Bildladefehler beeinträchtigen Suche/Galerie/Notizen nicht.
- Vor der Präsentation auf der echten Domain Suche, eingebettete Bilder, Speichern, Notiz, Reload und Entfernen kurz prüfen. localStorage ist pro Origin getrennt; lokale Galerieeinträge erscheinen nicht automatisch auf HTTPS. Privater Modus, manuelles Löschen oder Browser-Speicherlimits können Persistenz einschränken.

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
