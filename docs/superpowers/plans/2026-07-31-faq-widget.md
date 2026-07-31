# Widget FAQ — plan wdrożenia

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zamienić udawanego asystenta AI w widgecie na kierowany FAQ czytający tę samą treść co sekcja `#faq`, z jednolitym CTA prowadzącym do formularza kontaktowego.

**Architecture:** Treść FAQ przenosi się do `messages/pl.json` i `messages/en.json`. Nowy moduł `lib/faq.ts` dostarcza typ, mapę ikon i hook czytający treść przez next-intl. Sekcja `FAQ.tsx` i widget `AIConcierge.tsx` stają się jego konsumentami. Widget traci pole tekstowe, mikrofon i drabinkę regexów, zyskuje dwa widoki (lista pytań / odpowiedź). CTA w widgecie emituje zdarzenie `window`, które `Contact.tsx` zamienia na przeskok do kroku 3 formularza.

**Tech Stack:** Next.js 16 App Router, TypeScript, next-intl 4, framer-motion, lucide-react, Tailwind 4.

## Global Constraints

- **Brak test runnera w projekcie.** `package.json` ma tylko `dev`, `build`, `start`, `lint`. Nie instalujemy Vitest ani Playwright — nie było takiego zlecenia. Każde zadanie weryfikujemy przez `npx tsc --noEmit`, `npm run lint`, `npm run build` oraz ręczną checklistę w przeglądarce.
- **Polskie diakrytyki obowiązkowe** w każdym nowym i edytowanym tekście widocznym dla użytkownika. W repo jest sporo starego copy bez ogonków — nie naprawiamy go poza plikami dotykanymi w tym planie.
- **Kolor akcentu:** `#b8860b`, jaśniejszy wariant `#d4a843`. Nie wprowadzamy nowych kolorów.
- **Nie ruszamy** `SoundEngine`, `AuroraOrb`, badge powiadomienia po 8 s ani animowanego gradientu nagłówka — warstwa efektów zostaje zgodnie z decyzją.
- **next-intl 4:** tablice i obiekty z messages czytamy przez `t.raw("klucz")`, bo `t()` zwraca wyłącznie string.
- **Commity:** repo jest na `main`. Przed pierwszym commitem załóż gałąź `feat/faq-widget`. Commituj po każdym zadaniu.
- **Ikony w JSON nie istnieją** — w messages trzymamy nazwę ikony jako string, mapowanie na komponent lucide siedzi w `lib/faq.ts`.

## Otwarte kwestie do potwierdzenia u klienta

Nie blokują wdrożenia — plan używa wartości wskazanych niżej jako tymczasowych, ale przed publikacją muszą zostać potwierdzone:

1. **Czas konsultacji.** `Contact.tsx` obiecuje 20 min, `FAQ.tsx` i widget mówią 30 min. Plan ujednolica na **20 min**, bo tyle deklaruje faktyczny formularz rezerwacji.
2. **Ceny.** Trzy sprzeczne zestawy (patrz spec). Plan przyjmuje wersję z `FAQ.tsx`: diagnoza 15-25 tys. PLN, transformacja 50-150 tys. PLN, coaching od 800 PLN/h.
3. **Liczby w odpowiedziach** — „95% projektów kończy się sukcesem", „15+ lat doświadczenia", zwrot pieniędzy po 3 sesjach. Przeniesione bez zmian z `FAQ.tsx`, ale nie zostały przez nikogo zweryfikowane.

## Struktura plików

| Plik | Odpowiedzialność | Status |
|---|---|---|
| `messages/pl.json`, `messages/en.json` | jedyne źródło treści FAQ (8 pozycji, 5 kategorii) + etykiety widgetu | modyfikacja |
| `lib/faq.ts` | typ `FaqItem`, mapa ikon, hook `useFaqItems`, `getRelated` | **nowy** |
| `lib/constants.ts` | stała `BOOK_CONSULTATION_EVENT` | modyfikacja |
| `components/sections/FAQ.tsx` | sekcja FAQ na stronie — konsument `lib/faq.ts` | modyfikacja |
| `components/ui/AIConcierge.tsx` | widget — konsument `lib/faq.ts`, dwa widoki | modyfikacja |
| `components/sections/Contact.tsx` | nasłuch zdarzenia rezerwacji | modyfikacja |

---

### Task 1: Wspólne źródło treści FAQ

**Files:**
- Create: `lib/faq.ts`
- Modify: `messages/pl.json` (klucz `faq`), `messages/en.json` (klucz `faq`)

**Interfaces:**
- Consumes: nic (pierwsze zadanie)
- Produces:
  - `interface FaqItem { id: string; category: string; icon: string; question: string; answer: string }`
  - `useFaqItems(): FaqItem[]`
  - `useFaqCategories(): { id: string; label: string }[]`
  - `faqIcon(name: string): LucideIcon`
  - `getRelated(items: FaqItem[], currentId: string, count?: number): FaqItem[]`

- [ ] **Step 1: Załóż gałąź roboczą**

```bash
git checkout -b feat/faq-widget
```

- [ ] **Step 2: Podmień klucz `faq` w `messages/pl.json`**

Zachowaj istniejące klucze `tagline`, `title`, `titleHighlight`, `subtitle`, `description`, `searchPlaceholder`, `contact`, `contactCta`. Podmień `categories` i `items`, dołóż `noResults` i `clearFilters`:

```json
"categories": {
  "all": "Wszystkie",
  "start": "Rozpoczęcie",
  "cost": "Koszty",
  "work": "Współpraca",
  "results": "Rezultaty"
},
"noResults": "Nie znaleziono wyników",
"noResultsHint": "Spróbuj innego wyszukiwania lub",
"clearFilters": "wyczyść filtry",
"items": [
  {
    "id": "pierwsza-rozmowa",
    "category": "start",
    "icon": "MessageCircle",
    "question": "Jak wygląda pierwsza rozmowa?",
    "answer": "Pierwsza rozmowa to bezpłatna, 20-minutowa sesja online. Poznajemy Twoje wyzwania, cele i kontekst organizacji. Nie ma żadnych zobowiązań — to czas na wzajemne poznanie się i sprawdzenie, czy możemy Ci pomóc. Po rozmowie otrzymasz konkretne rekomendacje, niezależnie od dalszej współpracy."
  },
  {
    "id": "koszty",
    "category": "cost",
    "icon": "Wallet",
    "question": "Ile kosztują Wasze usługi?",
    "answer": "Nasze stawki zależą od zakresu i złożoności projektu. Typowa diagnoza organizacji to 15-25 tys. PLN. Projekt transformacyjny (3-6 miesięcy) to zazwyczaj 50-150 tys. PLN. Coaching indywidualny dla liderów — od 800 PLN/h. Zawsze przedstawiamy szczegółową wycenę przed rozpoczęciem współpracy, bez ukrytych kosztów."
  },
  {
    "id": "czas-trwania",
    "category": "work",
    "icon": "Clock",
    "question": "Jak długo trwa typowy projekt?",
    "answer": "Diagnoza i strategia: 3-5 tygodni. Pełna transformacja: 4-8 miesięcy. Coaching liderów: minimum 3 miesiące dla trwałych efektów. Dostosowujemy tempo do Waszych możliwości — nie narzucamy sztywnych ram. Każdy projekt kończy się etapem utrwalania zmian, by organizacja mogła samodzielnie kontynuować rozwój."
  },
  {
    "id": "praca-zdalna",
    "category": "work",
    "icon": "Globe",
    "question": "Czy pracujecie zdalnie?",
    "answer": "Tak, pracujemy w modelu hybrydowym. Warsztaty strategiczne i kluczowe sesje prowadzimy na miejscu — energia grupy jest wtedy nieporównywalna. Coaching, konsultacje i spotkania robocze świetnie sprawdzają się online. Pracujemy z klientami w całej Polsce, a część sesji prowadzimy również w języku angielskim dla międzynarodowych zespołów."
  },
  {
    "id": "wyroznik",
    "category": "results",
    "icon": "Award",
    "question": "Co Was wyróżnia od innych firm consultingowych?",
    "answer": "Trzy rzeczy: 1) Nie zostawiamy raportów na półce — pracujemy Z organizacją, nie NAD organizacją. 2) Łączymy twarde narzędzia biznesowe z psychologią zmiany. 3) Mierzymy efekty i bierzemy za nie odpowiedzialność. Nasz zespół to praktycy z 15+ letnim doświadczeniem, nie konsultanci prosto po studiach."
  },
  {
    "id": "pomiar-efektow",
    "category": "results",
    "icon": "Target",
    "question": "Jak mierzycie efekty swojej pracy?",
    "answer": "Każdy projekt zaczyna się od zdefiniowania konkretnych KPI — to mogą być wskaźniki biznesowe (sprzedaż, rotacja, NPS) lub behawioralne (zmiana zachowań liderów, jakość komunikacji). Prowadzimy pomiary przed, w trakcie i po projekcie. Regularnie raportujemy postępy i dostosowujemy działania do wyników."
  },
  {
    "id": "dla-kogo",
    "category": "start",
    "icon": "Building2",
    "question": "Dla jakich firm pracujecie?",
    "answer": "Najczęściej współpracujemy z firmami średnimi i dużymi (50-5000 pracowników) z branż: technologicznej, produkcyjnej, finansowej i profesjonalnych usług. Nasi klienci to zazwyczaj organizacje w fazie szybkiego wzrostu, transformacji lub zmiany pokoleniowej. Nie pracujemy z firmami, którym nie możemy realnie pomóc."
  },
  {
    "id": "gwarancja",
    "category": "results",
    "icon": "Shield",
    "question": "Czy oferujecie gwarancję rezultatów?",
    "answer": "Oferujemy coś lepszego — transparentność i współodpowiedzialność. Definiujemy wspólnie cele i miary sukcesu, a część naszego wynagrodzenia uzależniamy od ich osiągnięcia. W przypadku coachingu — jeśli po 3 sesjach nie widzisz wartości, zwracamy pieniądze bez pytań. 95% naszych projektów kończy się sukcesem."
  }
]
```

- [ ] **Step 3: Podmień klucz `faq` w `messages/en.json`**

Te same `id`, `category` i `icon` — muszą się zgadzać co do znaku, bo widget dobiera powiązane pytania po `category`, a `openItem` trzyma `id`.

```json
"categories": {
  "all": "All",
  "start": "Getting started",
  "cost": "Pricing",
  "work": "Collaboration",
  "results": "Results"
},
"noResults": "No results found",
"noResultsHint": "Try a different search or",
"clearFilters": "clear filters",
"items": [
  {
    "id": "pierwsza-rozmowa",
    "category": "start",
    "icon": "MessageCircle",
    "question": "What does the first conversation look like?",
    "answer": "The first conversation is a free, 20-minute online session. We get to know your challenges, goals and organizational context. There are no obligations — it is time to get to know each other and check whether we can help. After the call you receive concrete recommendations, regardless of any further collaboration."
  },
  {
    "id": "koszty",
    "category": "cost",
    "icon": "Wallet",
    "question": "How much do your services cost?",
    "answer": "Our rates depend on the scope and complexity of the project. A typical organizational diagnosis is 15-25k PLN. A transformation project (3-6 months) is usually 50-150k PLN. Individual coaching for leaders starts at 800 PLN/h. We always present a detailed quote before we start, with no hidden costs."
  },
  {
    "id": "czas-trwania",
    "category": "work",
    "icon": "Clock",
    "question": "How long does a typical project take?",
    "answer": "Diagnosis and strategy: 3-5 weeks. Full transformation: 4-8 months. Leadership coaching: at least 3 months for lasting effects. We adapt the pace to your capacity — we do not impose rigid timelines. Every project ends with a consolidation stage so the organization can continue developing on its own."
  },
  {
    "id": "praca-zdalna",
    "category": "work",
    "icon": "Globe",
    "question": "Do you work remotely?",
    "answer": "Yes, we work in a hybrid model. Strategic workshops and key sessions run on site — the energy of the group is incomparable then. Coaching, consultations and working meetings work very well online. We work with clients across Poland, and we run part of our sessions in English for international teams."
  },
  {
    "id": "wyroznik",
    "category": "results",
    "icon": "Award",
    "question": "What sets you apart from other consulting firms?",
    "answer": "Three things: 1) We do not leave reports on a shelf — we work WITH the organization, not ON it. 2) We combine hard business tools with the psychology of change. 3) We measure results and take responsibility for them. Our team are practitioners with 15+ years of experience, not consultants straight out of university."
  },
  {
    "id": "pomiar-efektow",
    "category": "results",
    "icon": "Target",
    "question": "How do you measure the impact of your work?",
    "answer": "Every project starts by defining concrete KPIs — these can be business metrics (sales, turnover, NPS) or behavioural ones (changes in leader behaviour, quality of communication). We measure before, during and after the project. We report progress regularly and adjust our actions to the results."
  },
  {
    "id": "dla-kogo",
    "category": "start",
    "icon": "Building2",
    "question": "What kind of companies do you work with?",
    "answer": "We most often work with medium and large companies (50-5000 employees) from technology, manufacturing, finance and professional services. Our clients are usually organizations in a phase of rapid growth, transformation or generational change. We do not work with companies we cannot genuinely help."
  },
  {
    "id": "gwarancja",
    "category": "results",
    "icon": "Shield",
    "question": "Do you guarantee results?",
    "answer": "We offer something better — transparency and shared accountability. We define goals and success measures together, and we tie part of our fee to reaching them. For coaching — if you see no value after 3 sessions, we refund the money, no questions asked. 95% of our projects end in success."
  }
]
```

- [ ] **Step 4: Sprawdź, że oba pliki to poprawny JSON i mają zgodne `id`**

```bash
python3 -c "
import json
pl = json.load(open('messages/pl.json'))['faq']
en = json.load(open('messages/en.json'))['faq']
assert [i['id'] for i in pl['items']] == [i['id'] for i in en['items']], 'id nie zgadzaja sie miedzy jezykami'
assert [i['category'] for i in pl['items']] == [i['category'] for i in en['items']], 'kategorie nie zgadzaja sie'
assert set(pl['categories']) == set(en['categories']), 'klucze kategorii nie zgadzaja sie'
cats = set(pl['categories']) - {'all'}
assert all(i['category'] in cats for i in pl['items']), 'pozycja wskazuje nieistniejaca kategorie'
print('OK —', len(pl['items']), 'pozycji, kategorie:', sorted(cats))
"
```

Expected: `OK — 8 pozycji, kategorie: ['cost', 'results', 'start', 'work']`

- [ ] **Step 5: Utwórz `lib/faq.ts`**

```ts
import { useTranslations } from "next-intl";
import {
  Award,
  Building2,
  Clock,
  Globe,
  HelpCircle,
  MessageCircle,
  Shield,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface FaqItem {
  id: string;
  category: string;
  icon: string;
  question: string;
  answer: string;
}

const FAQ_ICONS: Record<string, LucideIcon> = {
  Award,
  Building2,
  Clock,
  Globe,
  MessageCircle,
  Shield,
  Target,
  Wallet,
};

export function faqIcon(name: string): LucideIcon {
  return FAQ_ICONS[name] ?? HelpCircle;
}

export function useFaqItems(): FaqItem[] {
  const t = useTranslations("faq");
  return t.raw("items") as FaqItem[];
}

export function useFaqCategories(): { id: string; label: string }[] {
  const t = useTranslations("faq");
  const labels = t.raw("categories") as Record<string, string>;
  return Object.entries(labels).map(([id, label]) => ({ id, label }));
}

// Powiazane pytania: najpierw ta sama kategoria, potem reszta jako uzupelnienie.
export function getRelated(
  items: FaqItem[],
  currentId: string,
  count = 2
): FaqItem[] {
  const current = items.find((item) => item.id === currentId);
  const others = items.filter((item) => item.id !== currentId);
  const sameCategory = others.filter((item) => item.category === current?.category);
  const rest = others.filter((item) => item.category !== current?.category);
  return [...sameCategory, ...rest].slice(0, count);
}
```

- [ ] **Step 6: Weryfikacja typów**

Run: `npx tsc --noEmit`
Expected: brak błędów dotyczących `lib/faq.ts`. Wcześniejsze ostrzeżenia o nieużywanych importach w innych plikach są zastane i nie blokują.

- [ ] **Step 7: Commit**

```bash
git add lib/faq.ts messages/pl.json messages/en.json
git commit -m "feat(faq): wspolne zrodlo tresci FAQ w messages + lib/faq.ts"
```

---

### Task 2: Sekcja FAQ czyta ze wspólnego źródła

**Files:**
- Modify: `components/sections/FAQ.tsx`

**Interfaces:**
- Consumes: `useFaqItems`, `useFaqCategories`, `faqIcon`, `FaqItem` z `lib/faq.ts`
- Produces: nic dla dalszych zadań — to konsument

- [ ] **Step 1: Usuń zahardkodowane tablice**

Skasuj z góry pliku stałe `categories` (obecnie linie 24-30) i `faqItems` (linie 33-98) w całości.

- [ ] **Step 2: Dodaj import i zamień ikony kategorii na lokalną mapę**

Import z lucide zostaje, ale zawężony do tego, co nadal używane w tym pliku: `Plus`, `Search`, `MessageCircle`, `ArrowRight`, `Sparkles`, `Clock`, `Wallet`, `Users`, `Target`. Usuń `ChevronDown`, `Globe`, `Award`, `Shield`, `Building2` — po przeniesieniu danych nie mają tu zastosowania.

Dołóż:

```ts
import { useFaqItems, useFaqCategories, faqIcon, type FaqItem } from "@/lib/faq";

// Ikony filtrow kategorii - warstwa prezentacji, zostaje w komponencie sekcji.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  all: Sparkles,
  start: Clock,
  cost: Wallet,
  work: Users,
  results: Target,
};
```

`LucideIcon` importuj jako typ z `lucide-react`.

- [ ] **Step 3: Przestaw `FAQItem` na nowy typ**

Sygnatura propsa zmienia się z `item: (typeof faqItems)[0]` na `item: FaqItem`, a ikona bierze się z mapy:

```tsx
function FAQItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = faqIcon(item.icon);
```

Reszta ciała komponentu bez zmian.

- [ ] **Step 4: Przestaw `CategoryFilter` na dane z i18n**

```tsx
function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
```

W ciele: `const Icon = CATEGORY_ICONS[category.id] ?? Sparkles;` zamiast `category.icon`.

- [ ] **Step 5: Przestaw komponent `FAQ` na hooki**

W `export function FAQ()`:

```tsx
const items = useFaqItems();
const categories = useFaqCategories();
const [openItem, setOpenItem] = useState<string | null>(null);
```

`openItem` zmienia typ z `number | null` na `string | null`, bo `id` jest teraz stringiem. Analogicznie `handleToggle`:

```tsx
const handleToggle = (id: string) => {
  setOpenItem(openItem === id ? null : id);
};
```

`filteredItems` filtruje `items` zamiast `faqItems`, dodaj `items` do tablicy zależności `useMemo`:

```tsx
const filteredItems = useMemo(() => {
  return items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });
}, [items, searchQuery, activeCategory]);
```

W JSX przekaż kategorie: `<CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />`.

- [ ] **Step 6: Przetłumacz pusty stan**

Zamień zahardkodowane „Nie znaleziono wynikow", „Sprobuj innego wyszukiwania lub" i „wyczysc filtry" na `t("noResults")`, `t("noResultsHint")` i `t("clearFilters")` — klucze dodane w Task 1.

- [ ] **Step 7: Weryfikacja**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: build przechodzi. W `FAQ.tsx` nie ma już żadnego polskiego stringa poza komentarzami:

```bash
grep -nE "[ąćęłńóśźż]" components/sections/FAQ.tsx
```

Expected: trafienia wyłącznie w komentarzach, zero w JSX.

- [ ] **Step 8: Sprawdź w przeglądarce**

`npm run dev`, wejdź na sekcję `#faq`. Potwierdź: 8 pytań, filtry kategorii działają, wyszukiwarka działa, rozwijanie działa, przełączenie języka na EN zmienia pytania i etykiety filtrów.

- [ ] **Step 9: Commit**

```bash
git add components/sections/FAQ.tsx
git commit -m "refactor(faq): sekcja czyta tresc z i18n zamiast hardkodu"
```

---

### Task 3: Widget — kierowany FAQ zamiast udawanego czatu

**Files:**
- Modify: `components/ui/AIConcierge.tsx`
- Modify: `messages/pl.json`, `messages/en.json` (klucz `aiConcierge`)

**Interfaces:**
- Consumes: `useFaqItems`, `faqIcon`, `getRelated`, `FaqItem` z `lib/faq.ts`
- Produces: emisja zdarzenia `BOOK_CONSULTATION_EVENT` — konsumowana w Task 4

- [ ] **Step 1: Przebuduj klucz `aiConcierge` w obu plikach messages**

`messages/pl.json`:

```json
"aiConcierge": {
  "title": "Szybkie odpowiedzi",
  "subtitle": "Najczęstsze pytania",
  "greeting": "Wybierz pytanie — odpowiedź pojawi się od razu.",
  "related": "Powiązane pytania",
  "back": "Wróć do pytań",
  "noAnswer": "Nie ma Twojego pytania?",
  "bookCta": "Umów bezpłatną konsultację",
  "closeButton": "Zamknij"
}
```

`messages/en.json`:

```json
"aiConcierge": {
  "title": "Quick answers",
  "subtitle": "Frequently asked questions",
  "greeting": "Pick a question — the answer shows up right away.",
  "related": "Related questions",
  "back": "Back to questions",
  "noAnswer": "Question not listed?",
  "bookCta": "Book a free consultation",
  "closeButton": "Close"
}
```

Usuwane klucze (`welcome`, `placeholder`, `listening`, `poweredBy`, `quickActions`, `suggestions`, `thinking`, `error`, `offline`, `typing`, `sendButton`, `minimizeButton`) nie mają już konsumentów po tym zadaniu.

- [ ] **Step 2: Wytnij warstwę udawanego AI**

Skasuj z `AIConcierge.tsx`:

- `getSpeechRecognitionLang` (linie 21-24)
- `interface Message`, `interface QuickAction`
- `getAIResponse` — cała funkcja (linie 226-378)
- `NeuralThinking` (linie 380-501)
- `VoiceWaveform` (linie 503-534)
- `MessageBubble` (linie 665-723)
- `QuickActions` (linie 725-761)

Zostaw nietknięte: `SoundEngine` wraz z instancją `soundEngine` i `AuroraOrb`.

- [ ] **Step 3: Dodaj komponenty widoków**

```tsx
function QuestionRow({
  item,
  onSelect,
}: {
  item: FaqItem;
  onSelect: (id: string) => void;
}) {
  const Icon = faqIcon(item.icon);

  return (
    <motion.button
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-white/[0.03] border border-white/[0.06] hover:bg-[#b8860b]/10 hover:border-[#b8860b]/30 transition-colors"
      onClick={() => {
        soundEngine?.playClick();
        onSelect(item.id);
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="shrink-0 w-9 h-9 rounded-lg bg-[#b8860b]/15 flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#d4a84b]" />
      </span>
      <span className="text-sm text-white/80 leading-snug">{item.question}</span>
    </motion.button>
  );
}

function BookCta({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        soundEngine?.playClick();
        window.dispatchEvent(new CustomEvent(BOOK_CONSULTATION_EVENT));
      }}
      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-transform hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
        color: "#0a0a0f",
        boxShadow: "0 8px 30px rgba(184, 134, 11, 0.4)",
      }}
    >
      <Calendar className="w-4 h-4" />
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
```

Uwaga: `BookCta` nie zamyka panelu samo — zamknięcie robi `AIConcierge` w handlerze, żeby scroll w `Contact.tsx` nie walczył z animacją wyjścia panelu.

- [ ] **Step 4: Przepisz stan i ciało `AIConcierge`**

Stany `messages`, `inputValue`, `isThinking`, `isListening`, `quickActions`, `voiceSupported`, `interimTranscript` oraz refy `messagesEndRef`, `inputRef`, `recognitionRef` znikają. Zostają `isOpen`, `hasNotification`, `soundEnabled`. Dochodzi `activeId`:

```tsx
const [activeId, setActiveId] = useState<string | null>(null);
const items = useFaqItems();
const activeItem = activeId ? items.find((item) => item.id === activeId) ?? null : null;
const related = activeId ? getRelated(items, activeId) : [];
```

`null` w `activeId` oznacza widok listy — nie potrzeba osobnego stanu `view`.

Znikają też trzy `useEffect`: inicjalizacja Web Speech API, synchronizacja `recognition.lang` z locale oraz auto-scroll do `messagesEndRef`. Zostaje `useEffect` synchronizujący `soundEnabled` i `useEffect` od badge po 8 s — z tym, że warunek `messages.length === 0` zamienia się na `activeId === null`:

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    if (!isOpen && activeId === null) {
      setHasNotification(true);
      soundEngine?.playNotification();
    }
  }, 8000);
  return () => clearTimeout(timer);
}, [isOpen, activeId]);
```

Handlery:

```tsx
const handleOpen = useCallback(() => {
  soundEngine?.playOpen();
  setIsOpen(true);
  setHasNotification(false);
}, []);

const handleSelect = useCallback((id: string) => {
  setActiveId(id);
  soundEngine?.playReceive();
}, []);

const handleBack = useCallback(() => {
  soundEngine?.playClick();
  setActiveId(null);
}, []);
```

`useEffect` ustawiający focus na inpucie po otwarciu znika razem z inputem — `setHasNotification(false)` przeniesione do `handleOpen`.

- [ ] **Step 5: Zamień zawartość panelu**

Nagłówek: `AI Concierge` + badge `Pro` zamień na `{t("title")}` bez badge'a. Ikona `Sparkles`, wskaźnik online, przycisk wyciszenia i przycisk zamknięcia zostają bez zmian.

Obszar treści (ten z `data-lenis-prevent`) — zachowaj wszystkie klasy, podmień zawartość:

```tsx
<div
  data-lenis-prevent
  className="flex-1 min-h-0 sm:flex-none sm:h-[420px] overflow-y-auto overscroll-contain p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
>
  <AnimatePresence mode="wait">
    {activeItem ? (
      <motion.div
        key="answer"
        className="space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("back")}
        </button>

        <h4 className="text-base font-semibold text-white leading-snug">
          {activeItem.question}
        </h4>

        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
          {activeItem.answer}
        </p>

        {related.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-[11px] uppercase tracking-wider text-white/30">
              {t("related")}
            </p>
            {related.map((item) => (
              <QuestionRow key={item.id} item={item} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </motion.div>
    ) : (
      <motion.div
        key="list"
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm text-white/50 pb-1">{t("greeting")}</p>
        {items.map((item) => (
          <QuestionRow key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

Stopka zamiast pola tekstowego i mikrofonu:

```tsx
<div className="shrink-0 p-4 border-t border-white/[0.06] bg-white/[0.02] space-y-2">
  <p className="text-center text-xs text-white/40">{t("noAnswer")}</p>
  <BookCta label={t("bookCta")} />
</div>
```

Stopka „Powered by AI" znika w całości.

- [ ] **Step 6: Uporządkuj importy**

Z `lucide-react` zostają: `X`, `Sparkles`, `Volume2`, `VolumeX`, `Calendar`, `ArrowRight`, `ArrowLeft`. Usuń `Send`, `Mic`, `MicOff`, `Bot`, `User`, `Zap`. Z `react` usuń `useMemo` (był nieużywany już wcześniej). `useLocale` z next-intl usuń — po wycięciu Web Speech API i polskich literałów nie ma konsumenta.

Dołóż:

```tsx
import { useFaqItems, faqIcon, getRelated, type FaqItem } from "@/lib/faq";
import { BOOK_CONSULTATION_EVENT } from "@/lib/constants";
```

- [ ] **Step 7: Dodaj stałą zdarzenia w `lib/constants.ts`**

```ts
export const BOOK_CONSULTATION_EVENT = "catman:book-consultation";
```

- [ ] **Step 8: Weryfikacja, że stary kod zniknął**

```bash
grep -nE "getAIResponse|SpeechRecognition|NeuralThinking|VoiceWaveform|MessageBubble|inputValue|isThinking" components/ui/AIConcierge.tsx
```

Expected: zero trafień.

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: build przechodzi.

- [ ] **Step 9: Sprawdź w przeglądarce**

Otwórz widget. Potwierdź: lista 8 pytań, klik pokazuje odpowiedź i 2 powiązane, `Wróć do pytań` wraca na listę, kółko myszy scrolluje wewnątrz panelu (nie stronę pod spodem), dźwięki grają, przełącznik wyciszenia działa, badge pojawia się po 8 s przy zamkniętym widgecie. Przełącz język na EN — pytania i etykiety po angielsku.

- [ ] **Step 10: Commit**

```bash
git add components/ui/AIConcierge.tsx lib/constants.ts messages/pl.json messages/en.json
git commit -m "feat(widget): kierowany FAQ zamiast udawanego asystenta AI"
```

---

### Task 4: Jednolita akcja „Umów konsultację"

**Files:**
- Modify: `components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `BOOK_CONSULTATION_EVENT` z `lib/constants.ts`, emisja zdarzenia z Task 3
- Produces: nic dla dalszych zadań — domyka przepływ

Kontekst: `handleBookConsultation` i podświetlenie formularza już istnieją w pliku (dodane przy naprawie martwego przycisku w panelu informacyjnym). To zadanie opakowuje handler w `useCallback` i podpina nasłuch zdarzenia.

- [ ] **Step 1: Uzupełnij importy**

```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { BOOK_CONSULTATION_EVENT } from "@/lib/constants";
```

- [ ] **Step 2: Przepisz `handleBookConsultation` na `useCallback`**

Wywołania `handlePathSelect` i `handleMethodSelect` zamień na bezpośrednie settery — te funkcje są tworzone od nowa przy każdym renderze, więc jako zależności psułyby stabilność handlera i powodowały ciągłe przepinanie nasłuchu:

```tsx
// CTA "Umow konsultacje" - preselekcja domyslnej sciezki i skok do danych kontaktowych
const handleBookConsultation = useCallback(() => {
  if (isSubmitted) return;
  setSelectedPath("rozmowa");
  setSelectedMethod("call");
  setFormData((prev) => ({ ...prev, path: "rozmowa", contactMethod: "call" }));
  setCurrentStep(3);
  trackContactFormProgress(3);
  formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  setHighlightForm(true);
  setTimeout(() => setHighlightForm(false), 1500);
}, [isSubmitted, trackContactFormProgress]);
```

- [ ] **Step 3: Podepnij nasłuch zdarzenia**

Wstaw pod definicją handlera:

```tsx
useEffect(() => {
  window.addEventListener(BOOK_CONSULTATION_EVENT, handleBookConsultation);
  return () =>
    window.removeEventListener(BOOK_CONSULTATION_EVENT, handleBookConsultation);
}, [handleBookConsultation]);
```

- [ ] **Step 4: Weryfikacja**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: build przechodzi.

- [ ] **Step 5: Sprawdź oba wejścia do rezerwacji w przeglądarce**

Na szerokości desktopowej (≥1024px), bo tam przycisk był martwy:

1. Sekcja kontaktu → „Umów konsultację" w prawym panelu → formularz przeskakuje na krok 3, karta błyska obwódką.
2. Przewiń na górę strony, otwórz widget → „Umów bezpłatną konsultację" → strona scrolluje do formularza, ten sam krok 3, ta sama obwódka.
3. Powtórz oba na szerokości mobilnej (390px).
4. Wyślij formularz do końca, potem kliknij CTA jeszcze raz — nic się nie dzieje, bo `isSubmitted` blokuje (ekran sukcesu zostaje).

- [ ] **Step 6: Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat(kontakt): widget i panel odpalaja ten sam przeplyw rezerwacji"
```

---

## Weryfikacja końcowa

Po wszystkich zadaniach, względem kryteriów akceptacji ze specyfikacji:

```bash
npx tsc --noEmit && npm run lint && npm run build
grep -rn "getAIResponse\|SpeechRecognition\|NeuralThinking\|Powered by AI" components/ app/ lib/
```

Expected: build czysty, grep bez trafień.

Checklist w przeglądarce:

1. Widget otwiera się na liście 8 pytań; klik pokazuje odpowiedź i 2 powiązane pytania.
2. Powrót do listy działa; panel scrolluje się wewnątrz, strona pod spodem stoi.
3. Przełączenie języka na EN zmienia treść w widgecie i w sekcji `#faq`.
4. CTA w widgecie i CTA w panelu kontaktu dają identyczny efekt: krok 3 + podświetlenie.
5. Nigdzie nie ma już określenia „AI" w odniesieniu do widgetu.
