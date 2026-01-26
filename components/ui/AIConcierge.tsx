"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  Calendar,
  ArrowRight,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

// Helper function to get speech recognition language code
function getSpeechRecognitionLang(locale: string): string {
  return locale === "pl" ? "pl-PL" : "en-US";
}

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  action: string;
}

// ============================================
// SOUND ENGINE - Web Audio API
// ============================================
class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Subtle "pop" sound for sending message
  playSend() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.05);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  // Gentle "ding" for receiving message
  playReceive() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  // Soft "whoosh" for opening chat
  playOpen() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Click sound
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }

  // Voice start beep
  playVoiceStart() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Voice end beep
  playVoiceEnd() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(440, ctx.currentTime + 0.08);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Notification sound
  playNotification() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Two-tone notification
    [0, 0.15].forEach((delay, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(i === 0 ? 523.25 : 659.25, ctx.currentTime + delay);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);

      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + 0.12);
    });
  }
}

// Global sound engine instance
const soundEngine = typeof window !== "undefined" ? new SoundEngine() : null;

// Enhanced knowledge base with comprehensive responses
const getAIResponse = (input: string): { response: string; quickActions?: QuickAction[] } => {
  const lowerInput = input.toLowerCase();

  // Greetings
  if (lowerInput.match(/cze[sś][cć]|hej|dzie[nń] dobry|witaj|siema|hello|hi\b/)) {
    return {
      response: "Witaj! 👋 Jestem AI asystentem CatMan Consulting.\n\nMogę pomóc Ci poznać nasze usługi, odpowiedzieć na pytania lub umówić bezpłatną konsultację.\n\nW czym mogę Ci dziś pomóc?",
      quickActions: [
        { label: "🔍 Poznaj usługi", action: "Jakie usługi oferujecie?" },
        { label: "📅 Umów konsultację", action: "Chcę umówić konsultację" },
        { label: "🎯 Executive Coaching", action: "Opowiedz o executive coaching" },
      ],
    };
  }

  // Services overview
  if (lowerInput.match(/czym|zajmuj|us[łl]ug|ofert|co robi/)) {
    return {
      response: "Specjalizujemy się w transformacji organizacji i rozwoju liderów. Nasze główne obszary to:\n\n🔍 **Diagnoza organizacji** - kompleksowa analiza kultury i procesów\n\n🎯 **Executive Coaching** - indywidualny rozwój kadry zarządzającej (ICF PCC/MCC)\n\n👥 **Team Coaching** - budowanie wysokowydajnych zespołów\n\n✨ **Change Management** - wsparcie w transformacji\n\n🎓 **Warsztaty i szkolenia** - praktyczny rozwój kompetencji\n\nKtóry obszar Cię najbardziej interesuje?",
      quickActions: [
        { label: "Executive Coaching", action: "Opowiedz więcej o executive coaching" },
        { label: "Diagnoza", action: "Na czym polega diagnoza organizacji?" },
        { label: "Team Coaching", action: "Jak wygląda team coaching?" },
      ],
    };
  }

  // Executive Coaching
  if (lowerInput.match(/executive|coaching.*lider|coaching.*kadra|coaching.*zarz[aą]d/)) {
    return {
      response: "Executive Coaching to nasz flagowy program dla kadry zarządzającej.\n\n**Co obejmuje:**\n• Sesje 1:1 z certyfikowanym coachem ICF PCC/MCC\n• Diagnozę stylu przywódczego (Hogan, DISC, EQ-i 2.0)\n• Feedback 360° od zespołu\n• Indywidualny plan rozwoju\n• Wsparcie między sesjami\n\n**Czas trwania:** 6-12 miesięcy\n**Efekty:** Średni wzrost efektywności lidera o **+40%**\n\nCzy chciałbyś poznać szczegóły lub umówić rozmowę?",
      quickActions: [
        { label: "📅 Umów rozmowę", action: "Chcę porozmawiać z konsultantem" },
        { label: "💰 Ile to kosztuje?", action: "Jaki jest koszt executive coachingu?" },
        { label: "📊 Case studies", action: "Pokaż przykłady sukcesów" },
      ],
    };
  }

  // Diagnosis
  if (lowerInput.match(/diagnoz/)) {
    return {
      response: "Diagnoza organizacji to punkt wyjścia do świadomej transformacji.\n\n**W ciągu 2-4 tygodni przeprowadzamy:**\n• Wywiady z kluczowymi interesariuszami\n• Ankiety kulturowe i klimatyczne\n• Analizę procesów decyzyjnych\n• Mapowanie kompetencji\n• Identyfikację ukrytych barier\n\n**Efekt:** Raport z konkretnymi rekomendacjami strategicznymi.\n\nCzy Twoja organizacja stoi przed konkretnymi wyzwaniami?",
      quickActions: [
        { label: "Mamy wyzwania", action: "Tak, mamy kilka wyzwań w firmie" },
        { label: "Ile trwa proces?", action: "Jak długo trwa cały proces?" },
        { label: "📅 Umów konsultację", action: "Chcę umówić bezpłatną konsultację" },
      ],
    };
  }

  // Team coaching
  if (lowerInput.match(/team|zespo[łl]/)) {
    return {
      response: "Team Coaching przekształca grupy ludzi w zintegrowane, wysokowydajne zespoły.\n\n**Pracujemy nad:**\n• Budowaniem zaufania i psychologicznego bezpieczeństwa\n• Komunikacją i rozwiązywaniem konfliktów\n• Wspólną wizją i celami\n• Kulturą feedbacku\n• Efektywnością współpracy\n\n**Format:** warsztaty + coaching zespołowy\n**Czas:** 3-6 miesięcy\n\nCzy Twój zespół mierzy się z konkretnymi wyzwaniami?",
      quickActions: [
        { label: "Konflikty w zespole", action: "Mamy konflikty w zespole" },
        { label: "Nowy zespół", action: "Budujemy nowy zespół" },
        { label: "📅 Umów warsztat", action: "Chcę umówić warsztat próbny" },
      ],
    };
  }

  // Change/Transformation
  if (lowerInput.match(/zmian|transformacj|restrukturyzacj|fuzj|przej[eę]ci/)) {
    return {
      response: "Transformacja organizacji to maraton, nie sprint.\n\n**Nasze podejście Change Management:**\n\n**Faza 1: Diagnoza** - mapujemy sytuację i gotowość\n**Faza 2: Strategia** - definiujemy wizję i plan zmian\n**Faza 3: Wdrożenie** - krok po kroku z pomiarem postępów\n**Faza 4: Utrwalenie** - embedding nowych nawyków\n\nWspieramy organizacje w M&A, restrukturyzacjach, transformacjach cyfrowych i kulturowych.\n\nPrzed jakim wyzwaniem stoi Twoja organizacja?",
      quickActions: [
        { label: "Fuzja/przejęcie", action: "Planujemy fuzję z inną firmą" },
        { label: "Zmiana kultury", action: "Chcemy zmienić kulturę organizacyjną" },
        { label: "📞 Porozmawiajmy", action: "Chcę omówić naszą sytuację" },
      ],
    };
  }

  // Pricing
  if (lowerInput.match(/cen|koszt|ile|bud[żz]et|wycen/)) {
    return {
      response: "Każdy projekt wyceniamy indywidualnie - zależy od skali, zakresu i czasu trwania.\n\n**Orientacyjne widełki:**\n• Executive Coaching: od 2,500 PLN/miesiąc\n• Team Coaching: od 8,000 PLN/warsztat\n• Diagnoza organizacji: od 15,000 PLN\n• Programy transformacyjne: wycena projektowa\n\n**Pierwsza konsultacja jest bezpłatna** i niezobowiązująca - porozmawiamy o Twoich potrzebach.\n\nCzy chcesz umówić rozmowę?",
      quickActions: [
        { label: "✅ Tak, umówmy się", action: "Chcę umówić bezpłatną konsultację" },
        { label: "Mam więcej pytań", action: "Mam jeszcze kilka pytań" },
      ],
    };
  }

  // Booking/Contact
  if (lowerInput.match(/um[oó]w|rozmo|spotka|termin|konsultac|kontakt|porozmaw/)) {
    return {
      response: "Świetnie! 🎯\n\n**Bezpłatna konsultacja to 30-minutowa rozmowa, podczas której:**\n✓ Poznamy Twoje wyzwania\n✓ Zaproponujemy wstępne kierunki działań\n✓ Odpowiemy na wszystkie pytania\n\nŻeby umówić termin, kliknij przycisk poniżej lub zostaw kontakt.\n\n📅 **Najbliższe wolne terminy:** jutro 10:00, 14:00 lub pojutrze 9:00.",
      quickActions: [
        { label: "📅 Umów termin", action: "BOOK_MEETING" },
        { label: "📞 Zadzwońcie", action: "Proszę o kontakt telefoniczny" },
      ],
    };
  }

  // Case studies / Results
  if (lowerInput.match(/przyk[łl]ad|case|sukces|klient|efekt|rezultat/)) {
    return {
      response: "Oto przykłady naszych realizacji:\n\n🏢 **Firma technologiczna (500 os.)**\nProgram rozwoju 40 liderów\n→ +35% engagement, -50% rotacji w zarządzie\n\n🏦 **Bank regionalny**\nTransformacja kulturowa po fuzji\n→ 18 miesięcy, 2000 pracowników zintegrowanych\n\n🏭 **Producent FMCG**\nExecutive coaching dla CEO i zarządu\n→ Firma podwoiła przychody w 3 lata\n\nWszystkie case studies dostępne szczegółowo na życzenie.",
      quickActions: [
        { label: "Opowiedz więcej", action: "Opowiedz więcej o transformacji w banku" },
        { label: "Mamy podobne wyzwanie", action: "Mamy podobną sytuację" },
        { label: "📅 Umów rozmowę", action: "Chcę umówić konsultację" },
      ],
    };
  }

  // Process / How it works
  if (lowerInput.match(/jak.*wygl[aą]da|proces|etap|faz|wsp[oó][łl]prac|d[łl]ug/)) {
    return {
      response: "Typowa współpraca przebiega w 4 fazach:\n\n**1. DIAGNOZA** (2-4 tyg.)\nWywiady, analiza, raport sytuacyjny\n\n**2. STRATEGIA** (2-3 tyg.)\nPlan działań, cele, KPIs\n\n**3. WDROŻENIE** (3-12 mies.)\nSzkolenia, coaching, wsparcie\n\n**4. UTRWALENIE** (ongoing)\nMonitoring, adjustment, embedding\n\nTowarzyszymy do momentu, gdy zmiana staje się nową normą.\n\n95% klientów poleca nasze usługi.",
      quickActions: [
        { label: "Jakie są efekty?", action: "Jakie efekty osiągacie?" },
        { label: "Dla jakich firm?", action: "Z jakimi firmami pracujecie?" },
        { label: "📅 Umów rozmowę", action: "Chcę umówić konsultację" },
      ],
    };
  }

  // Target clients
  if (lowerInput.match(/dla kogo|jak.*firm|wielko[sś][cć]|bran[żz]/)) {
    return {
      response: "Pracujemy głównie z:\n\n• **Firmami 50-500+ pracowników**\n• **Zarządami i kadrą menedżerską**\n• **Działami HR i People & Culture**\n\nNajlepsze efekty osiągamy, gdy liderzy są gotowi na szczerą rozmowę o wyzwaniach organizacji.\n\nNasi klienci to firmy z różnych branż - od tech, przez produkcję, po usługi finansowe.",
      quickActions: [
        { label: "Jak wygląda współpraca?", action: "Jak wygląda typowa współpraca?" },
        { label: "Case studies", action: "Pokaż przykłady sukcesów" },
        { label: "📅 Umów rozmowę", action: "Chcę umówić konsultację" },
      ],
    };
  }

  // Team / About
  if (lowerInput.match(/zesp[oó][łl].*catman|kto.*jeste|partner|za[łl]o[żz]yciel/)) {
    return {
      response: "CatMan Consulting to butikowa firma doradcza:\n\n**Tomek** - Partner Zarządzający\n35 lat doświadczenia w zarządzaniu, ekspert transformacji organizacyjnych\n\n**Mariusz** - Partner\nPsycholog organizacji, specjalista kultury organizacyjnej i rozwoju liderów\n\nŁączymy twarde doświadczenie biznesowe z psychologicznym podejściem do zmiany.",
      quickActions: [
        { label: "Czym się zajmujecie?", action: "Jakie usługi oferujecie?" },
        { label: "📅 Umów rozmowę", action: "Chcę umówić konsultację" },
      ],
    };
  }

  // Default fallback
  return {
    response: "Dziękuję za wiadomość! 🙏\n\nChętnie pomogę Ci poznać nasze usługi lub odpowiem na pytania.\n\n**Możesz zapytać o:**\n• Nasze usługi i podejście\n• Executive coaching i rozwój liderów\n• Transformację organizacji\n• Przykłady realizacji\n• Umówienie bezpłatnej konsultacji\n\nO czym chciałbyś porozmawiać?",
    quickActions: [
      { label: "🔍 Poznaj usługi", action: "Jakie usługi oferujecie?" },
      { label: "📅 Umów konsultację", action: "Chcę umówić konsultację" },
    ],
  };
};

// Neural Network Thinking Animation - GOD TIER
function NeuralThinking() {
  const nodes = 8;
  const connections = 12;

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative w-12 h-12">
        {/* Neural network nodes */}
        {[...Array(nodes)].map((_, i) => {
          const angle = (i / nodes) * Math.PI * 2;
          const radius = 18;
          const x = Math.cos(angle) * radius + 24;
          const y = Math.sin(angle) * radius + 24;

          return (
            <motion.div
              key={`node-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: x - 4,
                top: y - 4,
                background: "linear-gradient(135deg, #b8860b, #d4a84b)",
                boxShadow: "0 0 10px rgba(184, 134, 11, 0.5)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          );
        })}

        {/* Central core with pulse */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            background: "radial-gradient(circle, #d4a84b 0%, #b8860b 100%)",
            boxShadow: "0 0 20px rgba(184, 134, 11, 0.8)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              "0 0 20px rgba(184, 134, 11, 0.8)",
              "0 0 40px rgba(184, 134, 11, 1)",
              "0 0 20px rgba(184, 134, 11, 0.8)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#b8860b]"
            style={{
              left: 22,
              top: 22,
            }}
            animate={{
              x: [0, Math.cos((i * 2 * Math.PI) / 3) * 20, 0],
              y: [0, Math.sin((i * 2 * Math.PI) / 3) * 20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#b8860b]"
          animate={{
            scale: [1, 2],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <motion.span
          className="text-sm font-medium text-white/70"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Analizuję zapytanie...
        </motion.span>
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#b8860b]"
              animate={{
                y: [0, -6, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Voice Waveform Visualization
function VoiceWaveform({ isActive }: { isActive: boolean }) {
  const bars = 16;

  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: isActive
              ? "linear-gradient(180deg, #d4a84b 0%, #b8860b 100%)"
              : "rgba(255,255,255,0.2)",
          }}
          animate={
            isActive
              ? {
                  height: [6, 24 + Math.sin(i * 0.5) * 12, 6],
                }
              : { height: 6 }
          }
          transition={{
            duration: 0.4 + Math.random() * 0.2,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  );
}

// Aurora Floating Orb - The main button
function AuroraOrb({
  onClick,
  hasNotification,
}: {
  onClick: () => void;
  hasNotification: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="relative w-16 h-16 rounded-full cursor-pointer outline-none"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      {/* Outer aurora glow */}
      <motion.div
        className="absolute -inset-2 rounded-full opacity-60 blur-xl"
        style={{
          background:
            "conic-gradient(from 0deg, #b8860b, #6366f1, #ec4899, #b8860b)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{
          background: "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main orb */}
      <motion.div
        className="absolute inset-1 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #b8860b 0%, #8b6914 100%)",
          boxShadow: `
            inset 0 2px 20px rgba(255,255,255,0.3),
            0 4px 30px rgba(184, 134, 11, 0.5)
          `,
        }}
        animate={{
          boxShadow: isHovered
            ? `inset 0 2px 20px rgba(255,255,255,0.4), 0 8px 50px rgba(184, 134, 11, 0.7)`
            : `inset 0 2px 20px rgba(255,255,255,0.3), 0 4px 30px rgba(184, 134, 11, 0.5)`,
        }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
          }}
        />

        {/* Icon */}
        <motion.div animate={{ rotate: isHovered ? 15 : 0 }}>
          <Sparkles className="w-7 h-7 text-white drop-shadow-lg" />
        </motion.div>
      </motion.div>

      {/* Notification badge */}
      {hasNotification && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 border-[#0a0a0f]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <span className="text-[10px] font-bold text-white">1</span>
        </motion.div>
      )}

      {/* Pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#b8860b]"
        animate={{
          scale: [1, 1.8],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#b8860b]"
        animate={{
          scale: [1, 1.8],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />
    </motion.button>
  );
}

// Message Bubble
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-[#6366f1]/30 to-[#6366f1]/10 border border-[#6366f1]/30"
            : "bg-gradient-to-br from-[#b8860b] to-[#8b6914]"
        }`}
        style={{
          boxShadow: isUser ? "none" : "0 4px 15px rgba(184, 134, 11, 0.3)",
        }}
      >
        {isUser ? (
          <User className="w-4 h-4 text-[#6366f1]" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white rounded-tr-sm"
            : "bg-white/[0.05] backdrop-blur-sm text-white/90 rounded-tl-sm border border-white/10"
        }`}
        style={{
          boxShadow: isUser
            ? "0 4px 20px rgba(99, 102, 241, 0.3)"
            : "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        <p
          className={`text-[10px] mt-2 ${
            isUser ? "text-white/50" : "text-white/30"
          }`}
        >
          {message.timestamp.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}

// Quick Action Buttons
function QuickActions({
  actions,
  onSelect,
}: {
  actions: QuickAction[];
  onSelect: (action: string) => void;
}) {
  const handleClick = (action: string) => {
    soundEngine?.playClick();
    onSelect(action);
  };

  return (
    <motion.div
      className="flex flex-wrap gap-2 mt-3 ml-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          className="px-3 py-2 text-xs font-medium rounded-xl bg-white/[0.03] text-white/70 border border-white/10 hover:bg-[#b8860b]/20 hover:border-[#b8860b]/40 hover:text-[#d4a84b] transition-all duration-200"
          onClick={() => handleClick(action.action)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {action.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

// Main AIConcierge Component
export function AIConcierge() {
  const t = useTranslations("aiConcierge");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check for voice support and setup recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = getSpeechRecognitionLang(locale);

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          if (final) {
            setInputValue(final);
            setInterimTranscript("");
          } else {
            setInterimTranscript(interim);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          soundEngine?.playVoiceEnd();
        };

        recognition.onerror = (event: any) => {
          console.log("Speech recognition error:", event.error);
          setIsListening(false);
          setInterimTranscript("");
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Update speech recognition language when locale changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getSpeechRecognitionLang(locale);
    }
  }, [locale]);

  // Sync sound enabled state
  useEffect(() => {
    soundEngine?.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNotification(false);
    }
  }, [isOpen]);

  // Show notification after delay if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && messages.length === 0) {
        setHasNotification(true);
        soundEngine?.playNotification();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, messages.length]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Handle booking action
    if (content === "BOOK_MEETING") {
      soundEngine?.playClick();
      const contactSection = document.getElementById("kontakt");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
      return;
    }

    // Play send sound
    soundEngine?.playSend();

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setQuickActions([]);

    // Simulate thinking
    setIsThinking(true);
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );
    setIsThinking(false);

    // Get AI response
    const { response, quickActions: newQuickActions } = getAIResponse(content);

    // Play receive sound
    soundEngine?.playReceive();

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    if (newQuickActions) {
      setQuickActions(newQuickActions);
    }
  }, []);

  // Handle opening with greeting
  const handleOpen = useCallback(() => {
    soundEngine?.playOpen();
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        const greeting: Message = {
          id: "greeting",
          role: "assistant",
          content: t("greeting"),
          timestamp: new Date(),
        };
        setMessages([greeting]);
        soundEngine?.playReceive();
        setQuickActions([
          { label: t("quickActions.services"), action: locale === "pl" ? "Jakie usługi oferujecie?" : "What services do you offer?" },
          { label: t("quickActions.booking"), action: locale === "pl" ? "Chcę umówić konsultację" : "I want to book a consultation" },
          { label: t("quickActions.coaching"), action: locale === "pl" ? "Opowiedz o executive coaching" : "Tell me about executive coaching" },
        ]);
      }, 400);
    }
  }, [messages.length, t, locale]);

  // Real voice input with Web Speech API
  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
    } else {
      try {
        setInterimTranscript("");
        recognitionRef.current.start();
        setIsListening(true);
        soundEngine?.playVoiceStart();
      } catch (e) {
        console.log("Speech recognition error:", e);
      }
    }
  }, [isListening]);

  return (
    <>
      {/* Floating Orb Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {!isOpen && (
            <AuroraOrb onClick={handleOpen} hasNotification={hasNotification} />
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-48px)] rounded-3xl overflow-hidden"
            style={{
              background: "rgba(10, 10, 15, 0.97)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `
                0 25px 100px rgba(0,0,0,0.6),
                0 0 80px rgba(184, 134, 11, 0.1),
                inset 0 1px 0 rgba(255,255,255,0.05)
              `,
            }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with Aurora Effect */}
            <div
              className="relative px-5 py-4 border-b border-white/[0.06] overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(10, 10, 15, 0.95) 100%)",
              }}
            >
              {/* Animated aurora gradient */}
              <motion.div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.2), rgba(99, 102, 241, 0.15), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "200% 0%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #b8860b 0%, #8b6914 100%)",
                        boxShadow: "0 4px 20px rgba(184, 134, 11, 0.4)",
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0f]">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-emerald-400"
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      AI Concierge
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-[#b8860b]/20 text-[#d4a84b]">
                        Pro
                      </span>
                    </h3>
                    <p className="text-xs text-white/40 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      {t("subtitle")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const newState = !soundEnabled;
                      setSoundEnabled(newState);
                      // Play click sound before disabling (or after enabling)
                      if (newState) {
                        setTimeout(() => soundEngine?.playClick(), 50);
                      }
                    }}
                    className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    title={soundEnabled ? (locale === "pl" ? "Wycisz dźwięki" : "Mute sounds") : (locale === "pl" ? "Włącz dźwięki" : "Enable sounds")}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-white/40" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      soundEngine?.playClick();
                      setIsOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-[420px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Quick actions */}
              {quickActions.length > 0 &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "assistant" &&
                !isThinking && (
                  <QuickActions
                    actions={quickActions}
                    onSelect={(action) => sendMessage(action)}
                  />
                )}

              {/* Booking button when relevant */}
              {messages.length > 0 &&
                (messages[messages.length - 1].content.includes("Najbliższe wolne terminy") ||
                 messages[messages.length - 1].content.includes("available slots")) &&
                !isThinking && (
                  <motion.div
                    className="ml-12 mt-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <a
                      href="#kontakt"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.02]"
                      style={{
                        background:
                          "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
                        color: "#0a0a0f",
                        boxShadow: "0 8px 30px rgba(184, 134, 11, 0.4)",
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      {locale === "pl" ? "Wybierz termin konsultacji" : "Book Your Consultation"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                )}

              {/* Neural thinking animation */}
              {isThinking && <NeuralThinking />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/[0.06] bg-white/[0.02]">
              {/* Voice waveform when listening */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    className="mb-3 p-4 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(10, 10, 15, 0.9) 100%)",
                      border: "1px solid rgba(184, 134, 11, 0.3)",
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <VoiceWaveform isActive={isListening} />
                    {interimTranscript ? (
                      <p className="text-sm text-center text-white/80 mt-2 font-medium">
                        &ldquo;{interimTranscript}&rdquo;
                      </p>
                    ) : (
                      <motion.p
                        className="text-xs text-center text-[#d4a84b] mt-2 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {t("listening")}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2">
                {/* Voice button - only show if supported */}
                {voiceSupported && (
                  <motion.button
                    className={`shrink-0 p-3 rounded-xl transition-all ${
                      isListening
                        ? "bg-[#b8860b] text-white shadow-lg"
                        : "bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60"
                    }`}
                    style={{
                      boxShadow: isListening
                        ? "0 0 30px rgba(184, 134, 11, 0.5)"
                        : "none",
                    }}
                    onClick={toggleVoice}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={locale === "pl" ? "Naciśnij aby mówić" : "Press to speak"}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </motion.button>
                )}

                {/* Text input */}
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(inputValue);
                      }
                    }}
                    placeholder={t("placeholder")}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-[#b8860b]/40 focus:bg-white/[0.05] transition-all text-sm"
                    disabled={isListening}
                  />
                </div>

                {/* Send button */}
                <motion.button
                  className="shrink-0 p-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background:
                      inputValue.trim() && !isThinking
                        ? "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)"
                        : "rgba(255,255,255,0.03)",
                    color: inputValue.trim() && !isThinking ? "#0a0a0f" : "rgba(255,255,255,0.3)",
                    boxShadow:
                      inputValue.trim() && !isThinking
                        ? "0 4px 20px rgba(184, 134, 11, 0.4)"
                        : "none",
                  }}
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isThinking}
                  whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
                  whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Powered by */}
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-white/20">
                <Sparkles className="w-3 h-3" />
                <span>{t("poweredBy")} • CatMan Consulting</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
