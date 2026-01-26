# Konfiguracja Catman Consulting

Instrukcja konfiguracji przed publikacją strony.

---

## 1. Wysyłka maili (Resend)

Formularz kontaktowy używa [Resend](https://resend.com) do wysyłki maili.

### Kroki:

1. **Zarejestruj się** na [resend.com](https://resend.com)
2. **Skopiuj API Key** z panelu: Dashboard → API Keys
3. **Dodaj do `.env.local`**:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **Restart serwera** (`npm run dev`)

### Opcjonalnie - własna domena:

Domyślnie maile wysyłane są z `onboarding@resend.dev`. Aby używać własnej domeny:

1. W panelu Resend: Domains → Add Domain
2. Dodaj rekordy DNS (SPF, DKIM)
3. Po weryfikacji zmień w `app/api/contact/route.ts`:
   ```ts
   from: `Catman Consulting <kontakt@catman.consulting>`,
   ```

### Bez klucza Resend:

Formularz działa, ale zamiast wysyłać maile, loguje dane do konsoli serwera. Przydatne do testowania.

---

## 2. Google Analytics 4

### Kroki:

1. **Utwórz property** w [Google Analytics](https://analytics.google.com)
2. **Skopiuj Measurement ID** (format: `G-XXXXXXXXXX`):
   - Admin → Data Streams → Web → Measurement ID
3. **Dodaj do `.env.local`**:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. **Restart serwera**

### Trackowane eventy:

| Event | Opis |
|-------|------|
| `page_view` | Automatycznie przy każdej zmianie strony |
| `form_submission` | Wysłanie formularza (success/failure) |
| `calendly_open` | Kliknięcie przycisku "Umów 20 min" |

### Bez klucza GA:

Eventy są logowane do konsoli przeglądarki (`[GA Event] ...`).

---

## 3. Calendly

### Kroki:

1. **Utwórz konto** na [calendly.com](https://calendly.com)
2. **Stwórz event** "20-minutowa konsultacja"
3. **Skopiuj link** do eventu
4. **Zmień w `lib/constants.ts`**:
   ```ts
   calendlyUrl: "https://calendly.com/TWOJ-LINK/20min",
   ```

### Obecny placeholder:

```ts
calendlyUrl: "https://calendly.com/catman-consulting/20min",
```

---

## 4. Dane kontaktowe

W pliku `lib/constants.ts` zmień:

```ts
export const contactContent = {
  title: "Porozmawiajmy",
  subtitle: "Umów bezpłatną 20-minutową konsultację",
  email: "kontakt@catman.consulting",  // ← Zmień na prawdziwy email
  phone: "+48 XXX XXX XXX",             // ← Zmień na prawdziwy telefon
  calendlyUrl: "https://calendly.com/catman-consulting/20min",
};
```

---

## 5. SEO - Meta dane

W pliku `lib/constants.ts`:

```ts
export const siteConfig = {
  name: "Catman Consulting",
  tagline: "Prosto o rzeczach złożonych",
  description: "Budujemy kulturę odpowiedzialności...", // ← Dostosuj opis SEO
  url: "https://catman.consulting",  // ← Zmień na prawdziwą domenę
};
```

---

## 6. Zdjęcia

Dodaj zdjęcia do folderu `public/images/`:

- `tomek.jpg` - zdjęcie Tomka (min. 800x800px)
- `mariusz.jpg` - zdjęcie Mariusza (min. 800x800px)
- `og-image.jpg` - obrazek Open Graph (1200x630px)

---

## 7. Deploy na Vercel

### Kroki:

1. **Push do GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USER/catman-consulting.git
   git push -u origin main
   ```

2. **Importuj w Vercel**:
   - [vercel.com/new](https://vercel.com/new)
   - Połącz z repozytorium GitHub
   - Vercel automatycznie wykryje Next.js

3. **Dodaj zmienne środowiskowe** w Vercel:
   - Settings → Environment Variables
   - Dodaj:
     - `RESEND_API_KEY`
     - `NEXT_PUBLIC_GA_MEASUREMENT_ID`

4. **Konfiguracja domeny**:
   - Settings → Domains
   - Dodaj `catman.consulting`
   - Skonfiguruj DNS u rejestratora

---

## Checklist przed publikacją

- [ ] Email kontaktowy w `constants.ts`
- [ ] Telefon w `constants.ts`
- [ ] Link Calendly w `constants.ts`
- [ ] URL domeny w `constants.ts`
- [ ] Klucz Resend w Vercel
- [ ] Klucz GA4 w Vercel
- [ ] Zdjęcia Tomka i Mariusza
- [ ] Obrazek Open Graph
- [ ] Przetestowany formularz
- [ ] Przetestowany Calendly
- [ ] DNS skonfigurowany

---

## Pliki konfiguracyjne

| Plik | Opis |
|------|------|
| `.env.local` | Zmienne środowiskowe (lokalnie) |
| `.env.example` | Przykład zmiennych |
| `lib/constants.ts` | Treści strony, dane kontaktowe |
| `app/api/contact/route.ts` | Konfiguracja wysyłki maili |
