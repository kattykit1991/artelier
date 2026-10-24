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

- **Zwischen-Checkpoint: 24.10.2026 · Stage 03 – Suche und ArtworkCards.**
- FR005 ist begonnen, noch nicht abgeschlossen. Die lokale Suche funktioniert; als Nächstes die Suchbedienung und Ergebnisdarstellung ausbauen.

---

## 📍 CURRENT STATE

**Was funktioniert bereits? Was ist nachweislich fertig oder getestet?**

<!--
Darf ausführlich sein. Genau das macht den Savepoint später nützlich.

Beschreibe den relevanten Projektstand, nicht jede einzelne Implementierungszeile.
Konkrete technische Details nur dann hier festhalten, wenn sie für das Verständnis
des aktuellen Zustands wirklich wichtig sind.
-->

- **FR001–FR004 umgesetzt**, FR003 und FR004 erfolgreich geprüft (Details im Requirements-Piloten). FR005 und FR012 teilweise umgesetzt; FR006–FR011 offen.
- Die Demoseite ist durch eine einfache Artelier-Oberfläche ersetzt. `App.tsx` verwaltet `query` mit `useState`; das kontrollierte Suchfeld aktualisiert diesen Wert. Whooosh ruft `searchHandle()` auf, das `artworkSearch(query)` abwartet und Ergebnisse ausschließlich in der Konsole ausgibt.
- **Von Kat bestätigter Safari-Test:** Nach der Referer-Korrektur lieferte die lokale Suche nach `cat` zehn validierte Kunstwerke. Kein eigener Safari-Test in diesem Checkpoint.
- **Technisch bereits nachgewiesen:** Der laufende Vite-Proxy lieferte ohne Referer HTTP 200 und zehn erfolgreich schema-validierte Kunstwerke; mit lokalem Referer kam eine Cloudflare-403-Sperrseite vom API-Ziel.
- **Heutige Checkpoint-Prüfungen:** Beide TypeScript-Konfigurationen ohne Dateiausgabe geprüft; Lint ohne Warnungen; Vite-Produktions-Build im Arbeitsspeicher erfolgreich. Kein Browser-Neutest und keine Cloudflare-Pages-Prüfung.

---

## ➡️ NEXT STEP

**Was mache ich als Nächstes?**

<!--
Möglichst konkret, damit Future-Kat nicht erst wieder herausfinden muss,
wo sie anfangen wollte.
-->

1. Suche über Enter und Whooosh gemeinsam mit `form` / `onSubmit` auslösen.
2. Suchergebnisse im React-State speichern und darstellen; Lade- und Fehlerzustände gemäß Build Guide ergänzen.
3. Wiederverwendbare ArtworkCard erstellen (FR006).
4. Anschließend Galerie, `localStorage` und Notizen entlang des Build Guides umsetzen.

- **Wiedereinstieg:** `src/App.tsx` öffnen → Stage 03 · Schritt 1. Die funktionierende Service-/Schema-Verbindung beibehalten.

---

## 🐛 KNOWN PROBLEMS

**Was funktioniert noch nicht richtig oder verhält sich komisch?**

<!--
Nur bekannte, aktuell relevante Probleme.
Technische Mikrodetails dürfen direkt im Code kommentiert oder – wenn sie nur
zwischengespeichert werden sollen – in NOTES.md geparkt werden.
-->

- Ergebnisse erscheinen nur in der Konsole. Kein Ergebnis-State, keine ArtworkCards, keine Enter-Suche und keine Lade-/Fehleranzeige. `searchHandle()` fängt abgelehnte Promises noch nicht ab.
- **Lokale Verbindung:** Vite leitet `/api` mit `changeOrigin: true` an `https://api.artic.edu` weiter. Fetch nutzt die relative API-Adresse und `referrerPolicy: "no-referrer"`, damit der lokale Seitenverweis keine 403-Sperre am API-Ziel auslöst.
- **Produktion offen:** Der Vite-Development-Proxy wird nicht auf Cloudflare Pages deployt. Für die relative `/api`-Adresse ist vor Veröffentlichung eine Produktionsanbindung erforderlich; sie ist noch nicht implementiert. Ein erfolgreicher Build beweist diese Verbindung nicht.
- Leere Strings bleiben schema-seitig erlaubt; der Bildplatzhalter ist weiterhin für ArtworkCard geplant.

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

- Kat schreibt den Lerncode selbst. Dieser Checkpoint ändert nur Dokumentation und sichert den vorhandenen Arbeitsstand.
- Originalanforderungen und bestehende Review-Ergebnisse bleiben erhalten. Der Build Guide ist die Lernroute, Requirements enthalten die Detailprüfung.
- Implementierung, automatisierte Prüfung und von Kat bestätigter Browser-Test sind getrennte Nachweise. FR005 ist trotz funktionierender Suchanfrage noch nicht abgeschlossen.
- `PROJECT_REQUIREMENTS.md` bleibt ein experimenteller KAT DEV TOOLS-Pilot. Der Bericht für den Dev-Identity-Chat folgt erst nach Abschluss des Piloten.

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
