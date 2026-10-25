# 🗺️ PROJECT BUILD GUIDE

> Meine Bauanleitung vom aktuellen Ziel zum funktionierenden DING™.
> Nicht in Stein gemeißelt: Wenn sich beim Bauen ein besserer Weg zeigt, darf der Bauplan mitwachsen.

---

**Prüfstand · 25.10.2026:** Alle zwölf FRs sind implementiert und lokal geprüft; FR006 behält wegen externer Bildsperren Hinweise. Explore/My Gallery und responsive Gestaltung stehen. TypeScript/Build, Lint und 23 Tests bestehen; Safari- und Pages-Runtime-Prüfungen sind in `PROJECT_REQUIREMENTS.md` dokumentiert. Vor der Präsentation fehlen Freigabe, Deployment und der Smoke-Test auf der echten HTTPS-Domain. Keine abgeschlossenen Lernschritte wiederholen.

**Lokal / Deployment:** `npm run dev` nutzt weiterhin Vite; `npm run build`, `npm run lint`, `npm run test` prüfen den Stand. Den Produktionspfad mit `npx wrangler pages dev dist --port 8788 --compatibility-date 2026-10-25` nach dem Build testen. Für Git-basiertes Pages-Deployment: Build `npm run build`, Ausgabeverzeichnis `dist`, Projektwurzel mit `functions/`. `npm run preview` hat keine Functions. Keine Secrets nötig. Details und verbleibender Live-Test im Savegame.

## 🧭 BUILD ROUTE

- [STAGE 01 · Projekt vorbereiten](#stage-01--projekt-vorbereiten)
- [STAGE 02 · Datenmodell und API](#stage-02--datenmodell-und-api)
- [STAGE 03 · Suche und ArtworkCards](#stage-03--suche-und-artworkcards)
- [STAGE 04 · Favoriten und Galerie](#stage-04--favoriten-und-galerie)
- [STAGE 05 · Notizen und Abschluss](#stage-05--notizen-und-abschluss)

---

# STAGE 01 · Projekt vorbereiten

## 🎯 ZIEL

Die React-/TypeScript-Anwendung läuft lokal und Zod ist installiert.

## 🔨 BAUEN

### 1 · Projektgerüst prüfen (FR001)

- [x] Artelier mit `kat-create` anlegen.
- [x] Vite mit React und TypeScript im Projekt einrichten.
- [x] Abhängigkeiten installieren.
- [x] Entwicklungsserver starten und Anwendung im Browser prüfen.

#### 🧱 DAFÜR BRAUCHST DU

```bash
npm install
npm run dev
```

**Was macht das?**

- `npm install` installiert die Abhängigkeiten aus der `package.json`.
- `npm run dev` startet den lokalen Vite-Entwicklungsserver.

### 2 · Zod installieren (FR002)

- [x] Zod als Abhängigkeit installieren.
- [x] Prüfen, ob Zod in `package.json` steht.

#### 🧱 DAFÜR BRAUCHST DU

```bash
npm install zod
```

**Was macht das?**

Installiert Zod, damit eingehende Daten zur Laufzeit überprüft werden können.

## ✅ FERTIG, WENN

- [x] Die Vite-/React-App im Browser läuft.
- [x] Zod installiert ist.

---

# STAGE 02 · Datenmodell und API

## 🎯 ZIEL

Kunstwerkdaten von der API abrufen und mit Zod validieren.

## 🔨 BAUEN

### 1 · API-Antwort untersuchen (Vorbereitung für FR003–FR004)

- [x] Die Struktur der tatsächlichen API-Antwort ansehen.
- [x] Relevante Felder und mögliche fehlende Werte identifizieren.

### 2 · ArtworkSchema definieren (FR003, FR012)

- [x] Ein Zod-Schema für `id`, `title`, `artist_title` und `image_id` erstellen.
- [x] Sinnvolle Behandlung fehlender oder leerer Angaben festlegen.

**Festgelegt:** Fehlend/`null` erhält die vereinbarten Ersatzwerte; leere Strings bleiben erlaubt. ArtworkCard zeigt bei fehlenden und fehlgeschlagenen Bildern den gestalteten Platzhalter `No image available.`.
- [x] Den TypeScript-Typ aus dem Schema ableiten.

#### 🧱 DAFÜR BRAUCHST DU

**Zod importieren**

```ts
import { z } from 'zod';
```

**Objektschema**

```ts
z.object({
  feld: z.string(),
});
```

**Häufige Feldtypen**

```ts
z.string()
z.number()
z.string().nullable()
z.string().optional()
z.string().default('')
```

**TypeScript-Typ aus Zod ableiten**

```ts
type Typ = z.infer<typeof Schema>;
```

**Was macht das?**

- `z.object()` beschreibt die erwartete Struktur eines Objekts.
- `z.string()` erwartet einen String.
- `z.number()` erwartet eine Zahl.
- `.nullable()` erlaubt zusätzlich `null`.
- `.optional()` erlaubt, dass ein Feld fehlt.
- `.default()` stellt einen Standardwert bereit, wenn der Eingabewert `undefined` ist.
- `z.infer` erzeugt einen TypeScript-Typ aus dem Schema.

### 3 · API-Daten abrufen und prüfen (FR004)

- [x] Eine asynchrone Anfrage an die Such-API umsetzen.
- [x] Die JSON-Antwort lesen.
- [x] Eingehende Kunstwerke mit dem Schema prüfen.
- [x] Ungültige Daten kontrolliert behandeln.

**Abgeschlossen:** `fields`, Export und Validierung bleiben erhalten. Die Pages Function stellt denselben API-Pfad produktiv bereit; lokal im Pages-Runtime und aus Safari ohne Vite-Proxy mit echten Antworten geprüft. Veröffentlichung und Live-Abnahme stehen noch aus.

#### 🧱 DAFÜR BRAUCHST DU

**Daten abrufen**

```ts
const response = await fetch(url);
const json = await response.json();
```

**Daten mit Zod prüfen**

```ts
const result = Schema.safeParse(value);
```

**Validierungsergebnis prüfen**

```ts
if (result.success) {
  result.data;
} else {
  result.error;
}
```

**Was macht das?**

- `fetch()` sendet eine HTTP-Anfrage.
- `.json()` liest die Antwort als JSON.
- `safeParse()` prüft Daten gegen das Zod-Schema.
- `result.success` zeigt an, ob die Validierung erfolgreich war.
- `result.data` enthält bei Erfolg die validierten Daten.
- `result.error` enthält bei einem Fehler die Validierungsprobleme.

## ✅ FERTIG, WENN

- [x] Das Schema die benötigten Felder korrekt beschreibt.
- [x] Der Artwork-Typ aus Zod abgeleitet wird.
- [x] API-Daten abgerufen und vor der Verwendung validiert werden.

---

# STAGE 03 · Suche und ArtworkCards

## 🎯 ZIEL

Nach Kunstwerken suchen und die Ergebnisse als Karten anzeigen.

## 🔨 BAUEN

### 1 · Suchoberfläche bauen (FR005)

**Abgeschlossen:** Enter und Whooosh über Formular-Submit, typisierter Ergebnis-State, Kartenliste sowie Lade-/Fehleranzeige vorhanden und lokal geprüft.

- [x] Ein Eingabefeld für den Suchbegriff erstellen.
- [x] Den Suchbegriff in React-State verwalten.
- [x] Die Suche auslösen und Ergebnisse im State speichern.
- [x] Lade- und Fehlerzustände sinnvoll anzeigen.

#### 🧱 DAFÜR BRAUCHST DU

**React-State**

```tsx
const [wert, setWert] = useState<string>('');
```

**Kontrolliertes Eingabefeld**

```tsx
<input
  value={wert}
  onChange={(event) => setWert(event.target.value)}
/>
```

**Formular mit Submit-Handler**

```tsx
<form onSubmit={handleSubmit}>
  ...
</form>
```

**Standardverhalten verhindern**

```ts
event.preventDefault();
```

**Was macht das?**

- `useState()` speichert einen Wert innerhalb einer React-Komponente.
- `value` verbindet ein Eingabefeld mit dem State.
- `onChange` reagiert auf Änderungen.
- `onSubmit` reagiert auf das Absenden eines Formulars.
- `preventDefault()` verhindert das normale Absendeverhalten des Browsers.

### 2 · ArtworkCard bauen (FR006)

- [x] Eine wiederverwendbare Kartenkomponente erstellen.
- [x] Titel, Künstlerangabe und Bild darstellen.
- [x] Fehlende Bilddaten sinnvoll behandeln.
- [x] Validierte Suchergebnisse als Kartenliste rendern.

#### 🧱 DAFÜR BRAUCHST DU

**Props typisieren**

```tsx
type Props = {
  eintrag: Typ;
};
```

**Komponente mit Props**

```tsx
function Card({ eintrag }: Props) {
  return <article>{/* Darstellung */}</article>;
}
```

**Array als Komponentenliste rendern**

```tsx
{eintraege.map((eintrag) => (
  <Card key={eintrag.id} eintrag={eintrag} />
))}
```

**Bedingte Darstellung**

```tsx
{bedingung && <Element />}
```

**Was macht das?**

- `Props` beschreibt, welche Daten eine Komponente erwartet.
- `.map()` erzeugt aus einem Array eine Liste von Elementen.
- `key` hilft React, Listenelemente wiederzuerkennen.
- `&&` ermöglicht eine bedingte Darstellung.

## ✅ FERTIG, WENN

- [x] Ein Suchbegriff eine API-Suche auslöst.
- [x] Gültige Ergebnisse als Karten erscheinen.
- [x] Fehlende Daten oder Anfragefehler die Oberfläche nicht abstürzen lassen.

---

# STAGE 04 · Favoriten und Galerie

## 🎯 ZIEL

Kunstwerke als Favoriten speichern und in einer eigenen Galerie anzeigen.

## 🔨 BAUEN

### 1 · Galerie-Datenmodell und State (FR007, FR012)

- [x] Festlegen, welche Daten ein gespeichertes Kunstwerk benötigt.
- [x] Einen passend typisierten Galerie-State erstellen.
- [x] Die Galerie in der Oberfläche zugänglich machen.

#### 🧱 DAFÜR BRAUCHST DU

**Typisierter Array-State**

```tsx
const [eintraege, setEintraege] = useState<Typ[]>([]);
```

**Array-State erweitern**

```tsx
setEintraege((vorherige) => [...vorherige, neuerEintrag]);
```

**Was macht das?**

- `Typ[]` beschreibt ein Array mit einem bestimmten Elementtyp.
- Der Spread-Operator `...` übernimmt vorhandene Arrayelemente.
- Der State wird durch ein neues Array aktualisiert.

### 2 · Favoriten speichern (FR008)

- [x] Ein Kunstwerk aus den Suchergebnissen zur Galerie hinzufügen.
- [x] Doppelte Einträge sinnvoll behandeln.
- [x] Die Galerie in `localStorage` speichern.
- [x] Gespeicherte Daten beim Start wieder laden und prüfen.

#### 🧱 DAFÜR BRAUCHST DU

**Daten speichern**

```ts
localStorage.setItem('schluessel', JSON.stringify(wert));
```

**Daten lesen**

```ts
const rohwert = localStorage.getItem('schluessel');
```

**JSON zurück in JavaScript-Daten umwandeln**

```ts
const wert = rohwert ? JSON.parse(rohwert) : [];
```

**Auf State-Änderungen reagieren**

```tsx
useEffect(() => {
  // Auf eine State-Änderung reagieren.
}, [eintraege]);
```

**Was macht das?**

- `localStorage` speichert Daten im Browser.
- `JSON.stringify()` wandelt JavaScript-Daten in einen JSON-String um.
- `JSON.parse()` wandelt einen JSON-String zurück in JavaScript-Daten.
- `useEffect()` kann auf Änderungen bestimmter State-Werte reagieren.

**Wichtig:** Daten aus `localStorage` sind nicht automatisch gültig. Nach `JSON.parse()` sollten sie ebenfalls überprüft werden.

### 3 · Galerie anzeigen (FR009)

- [x] Gespeicherte Kunstwerke in der Galerie rendern.
- [x] Einen sinnvollen Leerzustand anzeigen.

#### 🧱 DAFÜR BRAUCHST DU

**Array auf Einträge prüfen**

```ts
eintraege.length === 0
```

**Bedingte Darstellung**

```tsx
{bedingung ? <ElementA /> : <ElementB />}
```

**Was macht das?**

- `.length` gibt die Anzahl der Arrayelemente zurück.
- Der ternäre Operator `? :` wählt abhängig von einer Bedingung zwischen zwei Darstellungen.

## ✅ FERTIG, WENN

- [x] Kunstwerke zur Galerie hinzugefügt werden können.
- [x] Die Galerie nach einem Neuladen erhalten bleibt.
- [x] Gespeicherte Kunstwerke in der Galerie sichtbar sind.

---

# STAGE 05 · Notizen und Abschluss

## 🎯 ZIEL

Notizen zu Favoriten bearbeiten, Einträge entfernen und die App abschließend prüfen.

## 🔨 BAUEN

### 1 · Notizen validieren und bearbeiten (FR010)

- [x] Ein Zod-Schema für Notizen definieren.
- [x] Eine Eingabe zum Bearbeiten von Notizen bereitstellen.
- [x] Notizen vor dem Speichern validieren.
- [x] Änderungen dauerhaft in der Galerie speichern.

#### 🧱 DAFÜR BRAUCHST DU

**String-Validierung**

```ts
z.string()
z.string().min(1)
z.string().max(500)
```

**Schema-Validierung**

```ts
const ergebnis = Schema.safeParse(eingabe);
```

**Array-Eintrag aktualisieren**

```ts
const aktualisiert = eintraege.map((eintrag) =>
  eintrag.id === id
    ? { ...eintrag, feld: neuerWert }
    : eintrag
);
```

**Was macht das?**

- `.min()` legt eine Mindestlänge fest.
- `.max()` legt eine Maximallänge fest.
- `safeParse()` prüft den eingegebenen Wert.
- `.map()` kann einen bestimmten Eintrag aktualisieren, während andere unverändert bleiben.
- `{ ...eintrag }` übernimmt die bisherigen Objekteigenschaften.

### 2 · Kunstwerke entfernen (FR011)

- [x] Einen Entfernen-Button für gespeicherte Kunstwerke ergänzen.
- [x] Den betroffenen Eintrag aus dem Galerie-State entfernen.
- [x] Prüfen, ob die Änderung in `localStorage` erhalten bleibt.

#### 🧱 DAFÜR BRAUCHST DU

**Array filtern**

```ts
const gefiltert = eintraege.filter((eintrag) => eintrag.id !== id);
```

**Was macht das?**

- `.filter()` erstellt ein neues Array.
- Nur Elemente, bei denen die Bedingung `true` ergibt, bleiben enthalten.

### 3 · Abschlussprüfung (FR001–FR012)

- [x] Alle zwölf Functional Requirements gegen die Aufgabenstellung prüfen.
- [x] Suche, Favoriten, Notizen und Löschen testen.
- [x] Seiten-Neuladen und fehlende API-Daten testen.
- [x] Typ- und Lintermeldungen prüfen.
- [ ] Die Anwendung für die Präsentation vorbereiten.

#### 🧱 DAFÜR BRAUCHST DU

**Produktions-Build prüfen**

```bash
npm run build
```

**Was macht das?**

Führt das im Projekt konfigurierte Build-Skript aus und zeigt mögliche Build- oder TypeScript-Fehler an.

## ✅ FERTIG, WENN

- [x] Notizen validiert, bearbeitet und dauerhaft gespeichert werden.
- [x] Galerie-Einträge entfernt werden können.
- [ ] Alle zwölf Anforderungen funktionieren.

**Abnahme offen:** Implementierung und lokale Prüfungen sind abgeschlossen. Erst nach Deployment Suche, eingebettete Bilder und Galerieablauf auf `artelier.katcoded.de` bestätigen. Bildserver-Sperren bleiben extern; Fallbacks sind geprüft.
- [x] Die App ohne Build-Fehler läuft.

---

<!--
KAT-REGELN FÜR DEN BAUPLAN

- Die BUILD ROUTE oben bleibt als schnelle Gesamtübersicht erhalten.
- Der Guide wird von oben nach unten benutzt. Seine Reihenfolge soll deshalb der echten Bearbeitungsreihenfolge entsprechen.
- Erst steht, WAS ich konkret bauen soll. Direkt danach kommt, WAS ich dafür technisch brauchen könnte.
- CODE-BAUSTEINE sind allgemeine Syntaxmuster, keine fertigen Lösungen für das aktuelle Projekt.
- Nicht jeder Bauschritt braucht zwingend einen Code-Baustein.
- Planungslücken sind erlaubt. Wenn das echte Bauen einen fehlenden Schritt zeigt, darf der Bauplan angepasst werden.
- Der Bauplan ist eine Route, kein Vertrag.
-->

---

> 👻 Part of **KAT · DEV TOOLS** · katcoded.de  
> See `DEV_TOOLS_README.md` for information about this toolkit.
