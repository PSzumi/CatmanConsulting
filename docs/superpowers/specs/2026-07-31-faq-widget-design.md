# Widget FAQ zamiast udawanego czatu AI

Data: 2026-07-31
Status: zatwierdzony, gotowy do planu wdrożenia

## Problem

`components/ui/AIConcierge.tsx` udaje asystenta AI. W środku nie ma żadnego modelu ani API —
`getAIResponse()` to drabinka ~12 regexów po polskich słowach kluczowych zwracająca zahardkodowane
odpowiedzi, plus `setTimeout(1000 + random*1000)` udający myślenie. Skutki:

- Każde pytanie spoza wzorców trafia w fallback.
- Odpowiedzi istnieją wyłącznie po polsku — użytkownik EN dostaje polskie ściany tekstu.
- Nagłówek „AI Concierge Pro" i stopka „Powered by AI" wprowadzają w błąd.
- Treść rozjeżdża się z sekcją FAQ na stronie (osobne, sprzeczne dane).

## Rozwiązanie

Zamiana wolnego pola tekstowego na kierowany FAQ: użytkownik wybiera pytanie z listy, dostaje gotową
odpowiedź. Warstwa efektów (dźwięki, orb, animacje) zostaje bez zmian — znika tylko warstwa
udawanego AI.

## 1. Model treści — jedno źródło

Treść przenosi się w całości do `messages/pl.json` i `messages/en.json`, klucz `faq`:

```json
{
  "faq": {
    "categories": { "all": "...", "start": "...", "cost": "...", "work": "...", "results": "..." },
    "items": [
      {
        "id": "pierwsza-rozmowa",
        "category": "start",
        "icon": "MessageCircle",
        "question": "Jak wygląda pierwsza rozmowa?",
        "answer": "..."
      }
    ]
  }
}
```

8 pozycji, bazą są pytania obecnie zahardkodowane w `FAQ.tsx` (najbardziej konkretne z trzech
istniejących zestawów). Istniejące `faq.items` w messages (6 pozycji, nigdzie nieużywane) zostają
zastąpione.

Nowy moduł `lib/faq.ts`:

- typ `FaqItem`
- `FAQ_ICONS: Record<string, LucideIcon>` — ikony nie mogą siedzieć w JSON, więc nazwa jako string
  plus mapa po stronie TS
- `getRelated(items, current)` — zwraca 2 pozycje z tej samej kategorii z pominięciem bieżącej,
  a gdy kategoria ma za mało pozycji, uzupełnia pierwszymi z pozostałych

Konsumenci: `components/sections/FAQ.tsx` oraz `components/ui/AIConcierge.tsx`. Zahardkodowane
tablice `faqItems` i `categories` znikają z `FAQ.tsx` — sekcja przestaje być PL-only przy okazji.

### Rozstrzygnięcie: sprzeczne ceny

Trzy źródła podawały różne stawki:

| Źródło | Coaching | Diagnoza |
|---|---|---|
| `FAQ.tsx` (zahardkodowane) | od 800 PLN/h | 15–25 tys. PLN |
| `AIConcierge.tsx` (zahardkodowane) | od 2500 PLN/mies. | od 15 tys. PLN |
| `messages/*.json` (nieużywane) | sesja od 1500 PLN | — |

Obowiązuje wersja z `FAQ.tsx` — zatwierdzona 2026-07-31. Pozostałe dwa zestawy usunięte.
Zatwierdzone tym samym są liczby w odpowiedziach (95% projektów kończy się sukcesem, 15+ lat
doświadczenia, zwrot pieniędzy po 3 sesjach coachingu) oraz czas bezpłatnej konsultacji: **20 minut**
w całym serwisie, zamiast wcześniejszego rozjazdu 20 min w formularzu i 30 min w FAQ.

## 2. Widget — dwa widoki

Stan `view: "list" | "answer"` plus `activeId: string | null`.

**Lista** — powitanie, 8 pytań jako klikalne wiersze z ikoną, przypięte na dole CTA
„Umów konsultację".

**Odpowiedź** — nagłówek z pytaniem, treść odpowiedzi, sekcja „Powiązane pytania" (2 pozycje z
`getRelated`), CTA, przycisk powrotu `← Wróć do pytań`.

Bez wyszukiwarki i bez filtra kategorii: 8 pozycji w panelu szerokości 420px tego nie potrzebuje.
Sekcja FAQ na stronie zachowuje jedno i drugie, bo operuje na pełnej szerokości.

## 3. Jednolita akcja „Umów konsultację"

Widget nie scrolluje do kotwicy — wysyła zdarzenie:

```ts
window.dispatchEvent(new CustomEvent("catman:book-consultation"))
```

`Contact.tsx` nasłuchuje w `useEffect` i wywołuje istniejące `handleBookConsultation()`: preselekcja
ścieżki `rozmowa` i metody `call`, skok na krok 3, scroll do formularza, podświetlenie karty.
Dzięki temu CTA z widgetu i CTA z panelu informacyjnego robią dokładnie to samo.

## 4. Zakres usunięcia

Zostaje: `SoundEngine` wraz z dźwiękami, `AuroraOrb`, badge powiadomienia po 8 sekundach, animowany
gradient nagłówka, dymki i animacje wejścia, przełącznik wyciszenia.

Znika:

- pole tekstowe `input` i stan `inputValue`
- mikrofon, Web Speech API, `VoiceWaveform`, stany `isListening` / `interimTranscript` /
  `voiceSupported`, `getSpeechRecognitionLang`
- `getAIResponse()` — cała drabinka regexów
- `NeuralThinking` i sztuczny `setTimeout` (odpowiedź pojawia się natychmiast po kliknięciu)
- `Message[]` jako historia rozmowy — zastąpione stanem widoku

## 5. Nazewnictwo

Nagłówek: „AI Concierge Pro" → „Szybkie odpowiedzi" / „Quick answers". Stopka „Powered by AI"
znika. Nazwa pliku `AIConcierge.tsx` i nazwa eksportu `AIConcierge` zostają, żeby nie ruszać
importów w `ClientProviders.tsx`. Klucze i18n pozostają pod `aiConcierge`; nieużywane po zmianie
(`placeholder`, `listening`, `thinking`, `typing`, `poweredBy`, `suggestions`, `sendButton`) zostają
usunięte z obu plików messages.

## Kryteria akceptacji

1. Widget otwiera się na liście 8 pytań; klik w pytanie pokazuje odpowiedź i 2 powiązane pytania.
2. Powrót do listy działa, panel scrolluje się wewnątrz (`data-lenis-prevent` już dodane).
3. Przełączenie języka na EN zmienia zarówno pytania w widgecie, jak i w sekcji `#faq`.
4. CTA w widgecie ustawia krok 3 formularza z preselekcją i podświetla kartę — identycznie jak
   przycisk w panelu informacyjnym.
5. `npx tsc --noEmit` bez błędów; `npm run build` przechodzi.
6. W repo nie ma już `getAIResponse`, `SpeechRecognition` ani `NeuralThinking`.
