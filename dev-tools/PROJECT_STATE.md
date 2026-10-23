# 🎮 PROJECT STATE

> Mein Savegame für dieses Projekt.
> Wenn ich nach einer Pause zurückkomme, soll ich hier schnell sehen:
> **Wo bin ich? Was funktioniert schon? Was ist offen? Was kommt als Nächstes?**

---

## 🎯 CURRENT GOAL

**Woran arbeite ich gerade?**

<!--
Das aktuelle Ziel / die aktuelle Stage.
Nicht die komplette Projektvision – dafür gibt es PROJECT_START.md.
-->

- **Checkpoint: 23.10.2026 · Stage 02 – Datenmodell und API.**
- FR004 schrittweise fertigstellen. FR003 ist erfolgreich geprüft und abgeschlossen.

---

## 📍 CURRENT STATE

**Was funktioniert bereits? Was ist nachweislich fertig oder getestet?**

<!--
Darf ausführlich sein. Genau das macht den Savepoint später nützlich.

Beschreibe den relevanten Projektstand, nicht jede einzelne Implementierungszeile.
Konkrete technische Details nur dann hier festhalten, wenn sie für das Verständnis
des aktuellen Zustands wirklich wichtig sind.
-->

- Heute: FR003 nachgeprüft und mit PASS abgeschlossen; fehlende oder `null` gesetzte Bild-IDs werden zu `null` normalisiert. Die 14 Schema-Laufzeitfälle und die Typinferenzprüfung sind im Requirements-Dokument festgehalten.
- `src/services/artworkServices.ts` enthält die asynchrone Funktion `artworkSearch(query: string)`: dynamischer Suchbegriff mit `encodeURIComponent`, Fetch, HTTP-Prüfung mit `response.ok` und `throw new Error`, JSON-Lesen, Extraktion von `data.data`, Validierung mit `z.array(ArtworkSchema).parse(...)` und Rückgabe der validierten Liste. Diese Schritte sind durch Codeabgleich bestätigt.
- **Implementierung:** FR001–FR003 umgesetzt; FR004 und FR012 teilweise umgesetzt; FR005–FR011 offen. FR004 hat noch keinen abschließenden Review-PASS.
- **Checkpoint-Prüfungen:** TypeScript-Prüfung ohne Dateiausgabe scheitert an TS6133 (Suchfunktion noch ungenutzt). Lint endet mit Exitcode 0, meldet aber dieselbe ungenutzte Funktion als Warnung. Keine eigenständige Reparatur vorgenommen.
- **Ungeprüft:** Laufzeitverhalten des Services einschließlich HTTP-/Zod-Fehlerpfaden, Live-API-Integration, Browserdarstellung, Produktions-Build und Browserpersistenz. Die Oberfläche ist weiterhin das Startergerüst.

---

## ➡️ NEXT STEP

**Was mache ich als Nächstes?**

<!--
Möglichst konkret, damit Future-Kat nicht erst wieder herausfinden muss,
wo sie anfangen wollte.
-->

- Beim nächsten Einstieg in `src/services/artworkServices.ts` zuerst den geplanten `fields`-Parameter für `id,title,artist_title,image_id` ergänzen. Danach die Suchfunktion exportieren und FR004 abschließend prüfen.
- **Wiedereinstieg morgen oder Sonntag:** Build Guide → Stage 02 · Schritt 3; Schema und abgeschlossene FR003-Prüfung nicht wiederholen.

---

## 🐛 KNOWN PROBLEMS

**Was funktioniert noch nicht richtig oder verhält sich komisch?**

<!--
Nur bekannte, aktuell relevante Probleme.
Technische Mikrodetails dürfen direkt im Code kommentiert oder – wenn sie nur
zwischengespeichert werden sollen – in NOTES.md geparkt werden.
-->

- Service: `fields`-Parameter und Export fehlen noch. Die Funktion wird noch nicht verwendet; dadurch derzeit TS6133 sowie eine Lintwarnung.
- `.parse()` lehnt ungültige Daten mit einer Exception ab; HTTP-Fehler werden ausdrücklich geworfen. Diese Fehlerpfade sind im Code vorhanden, aber noch nicht zur Laufzeit geprüft.
- Der frühere Strict-Hinweis ist korrigiert: TypeScript 6.0.3 aktiviert Strict-Prüfungen standardmäßig. FR012 bleibt wegen fehlender fachlicher Komponenten-/State-Verwendung offen.
- Leere Strings bleiben erlaubt und sind kein FR003-Blocker. Der ArtworkCard-Platzhalter ist weiterhin nur geplant.

---

## 🐇 PARKED SIDEQUESTS

**Was möchte ich vielleicht machen, aber NICHT jetzt?**

<!--
Hier dürfen die „OH UND MAN KÖNNTE NOCH—“-Blerps sicher geparkt werden,
ohne den aktuellen Build zu entführen.
-->

- Keine zusätzlichen Sidequests beschlossen. Der FR-Blerpsi-Pilot läuft weiter; der Bericht für den Dev-Identity-Chat erfolgt erst nach Abschluss des Piloten.

---

## 🧹 CLEANUP LATER

**Was funktioniert, sollte aber später noch aufgeräumt oder verbessert werden?**

<!--
Kein Grund, den aktuellen Flow zu unterbrechen.
Hier landet technischer oder struktureller Cleanup, der gerade nicht wichtig genug ist.
-->

- Aktuell keine konkrete zusätzliche Cleanup-Aufgabe bestätigt.

---

## 🧠 IMPORTANT CONTEXT

**Was darf Future-Kat beim Wiedereinstieg auf keinen Fall vergessen?**

<!--
Entscheidungen, wichtige Zusammenhänge oder Kontext, der nicht offensichtlich
aus dem aktuellen Code hervorgeht.

Nicht jedes technische Detail konservieren:
- Gehört es direkt zu einer Codestelle? → eher Code-Kommentar.
- Ist es ein loser Brainblerps? → eher NOTES.md.
- Ist es wichtig, um den aktuellen Projektstand richtig zu verstehen? → hier.
-->

- Kat schreibt den Anwendungscode selbst. Dieser Checkpoint aktualisiert nur Dokumentation und sichert die vorhandenen Tagesänderungen mit Git.
- Originalanforderungen bleiben unverändert. Details und getrennte Implementierungs-/Reviewstatus stehen in `PROJECT_REQUIREMENTS.md`, die Lernroute im Build Guide.
- FR003 ist abgeschlossen; FR004 und FR012 sind noch nicht abgeschlossen. Ein vorhandener Codepfad ist kein bestandener Laufzeittest.
- Der FR-Blerpsi-Pilot läuft weiter; der Bericht für den Dev-Identity-Chat erfolgt erst nach Abschluss des Piloten.

---

<!--
KAT-REGELN FÜR PROJECT STATE

- PROJECT_STATE ist ein SAVEGAME, kein Tagebuch.
- Die Datei darf ausführlich sein, wenn das beim Wiedereinstieg hilft.
- Sie muss nicht nach jeder kleinen Änderung aktualisiert werden.
- Gute Savepoint-Momente sind z. B.:
  - vor einer längeren Pause
  - am Ende eines Arbeitstags
  - nach einem größeren Meilenstein
  - wenn sich Ziel oder Projektstand deutlich verändert haben
- Bestehende relevante Informationen bleiben erhalten; veraltete Informationen werden aktualisiert oder entfernt.
- Keine erfundenen Fortschritte: Nur festhalten, was wirklich umgesetzt, geprüft oder bewusst entschieden wurde.
- Ein Agent darf beim Formulieren/Aktualisieren helfen, aber Kat liefert bzw. bestätigt den tatsächlichen Projektkontext.
- Start mit EINER PROJECT_STATE.md. Keine zusätzlichen BUGS-, SIDEQUESTS-, CLEANUP- oder DECISIONS-Dateien erzeugen, solange dafür kein echter Bedarf entsteht.
-->

---

> 👻 Part of **KAT · DEV TOOLS** · katcoded.de  
> See `DEV_TOOLS_README.md` for information about this toolkit.
