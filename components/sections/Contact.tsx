"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Loader2,
  Calendar,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Target,
  Users,
  Lightbulb,
  HelpCircle,
  Clock,
  Sparkles,
  Linkedin,
  Twitter,
  Check,
  AlertCircle,
  ChevronRight,
  Video,
  MessageSquare,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { contactContent } from "@/lib/constants";
import { CalendlyButton } from "@/components/ui/CalendlyButton";
import { trackFormSubmission } from "@/components/Analytics";
import { Konfetti } from "@/components/ui/Konfetti";
import { VideoRecorder } from "@/components/ui/VideoRecorder";
import { AvailabilityIndicator } from "@/components/ui/AvailabilityIndicator";
import { ClientPortalPreview } from "@/components/ui/ClientPortalPreview";
import { useLeadScoring } from "@/lib/useLeadScoring";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  message: string;
  consent: boolean;
  website: string;
  path: string;
  contactMethod: string;
  hasVideo: boolean;
}

interface ValidationState {
  [key: string]: {
    valid: boolean;
    message: string;
    touched: boolean;
  };
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const ACCENT_COLOR = "#b8860b";
const ACCENT_LIGHT = "#d4a843";
const ACCENT_DARK = "#8b6914";

// Contact method options
const contactMethods = [
  {
    id: "call",
    icon: Video,
    title: "Rozmowa wideo",
    description: "20-minutowa sesja online",
    recommended: true,
    color: ACCENT_COLOR,
  },
  {
    id: "email",
    icon: MessageSquare,
    title: "Napisz do nas",
    description: "Odpowiedz w ciagu 24h",
    recommended: false,
    color: "#2d5a7b",
  },
  {
    id: "calendar",
    icon: CalendarCheck,
    title: "Zaplanuj spotkanie",
    description: "Wybierz dogodny termin",
    recommended: false,
    color: "#1e3d52",
  },
];

// Conversation paths - what brings them here
const conversationPaths = [
  {
    id: "diagnoza",
    icon: Target,
    title: "Diagnoza sytuacji",
    subtitle: "Chce zrozumiec, co dzieje sie w mojej organizacji",
    response: "Swietny punkt wyjscia. Diagnoza to fundament kazdej skutecznej zmiany.",
    color: "#2d5a7b",
  },
  {
    id: "rozwoj",
    icon: Users,
    title: "Rozwoj liderow",
    subtitle: "Szukam wsparcia dla kadry zarzadzajacej",
    response: "Inwestycja w liderow to najszybsza droga do zmiany kultury organizacyjnej.",
    color: ACCENT_COLOR,
  },
  {
    id: "wdrozenie",
    icon: Lightbulb,
    title: "Wsparcie we wdrozeniu",
    subtitle: "Mam plan, potrzebuje pomocy w realizacji",
    response: "Towarzyszymy w procesie. Teoria bez praktyki nie dziala.",
    color: "#1e3d52",
  },
  {
    id: "rozmowa",
    icon: HelpCircle,
    title: "Nie jestem pewien",
    subtitle: "Chce po prostu porozmawiac",
    response: "To najlepsza opcja. 20 minut rozmowy wyjasni wiecej niz godziny czytania.",
    color: ACCENT_LIGHT,
  },
];

// Team profiles
const teamProfiles = [
  {
    name: "Tomek",
    role: "Partner Zarzadzajacy",
    specialty: "35 lat w zarzadzaniu",
    avatar: "T",
    color: "#2d5a7b",
    linkedin: "https://linkedin.com/in/tomek",
  },
  {
    name: "Mariusz",
    role: "Psycholog Organizacji",
    specialty: "Ekspert kultury organizacyjnej",
    avatar: "M",
    color: ACCENT_COLOR,
    linkedin: "https://linkedin.com/in/mariusz",
  },
];

// Social links
const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/catman-consulting", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/catmanconsult", label: "Twitter" },
];

// Form steps
const formSteps = [
  { id: 1, title: "Wybierz temat", description: "Co Cie do nas sprowadza?" },
  { id: 2, title: "Sposob kontaktu", description: "Jak wolisz sie skontaktowac?" },
  { id: 3, title: "Twoje dane", description: "Powiedz nam o sobie" },
];

// ============================================================================
// ANIMATED INPUT COMPONENT
// ============================================================================

interface AnimatedInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  validation?: { valid: boolean; message: string; touched: boolean };
  multiline?: boolean;
  rows?: number;
}

function AnimatedInput({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  validation,
  multiline = false,
  rows = 3,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const showError = validation?.touched && !validation?.valid;
  const showSuccess = validation?.touched && validation?.valid && hasValue;

  const inputClasses = cn(
    "w-full px-4 py-4 pt-6 rounded-xl bg-gray-900/50 border-2 outline-none transition-all duration-300 text-white placeholder-transparent peer",
    "focus:bg-gray-900/80",
    showError
      ? "border-red-500/50 focus:border-red-500"
      : showSuccess
      ? "border-emerald-500/50 focus:border-emerald-500"
      : isFocused
      ? `border-[${ACCENT_COLOR}]`
      : "border-gray-700/50 hover:border-gray-600"
  );

  const labelClasses = cn(
    "absolute left-4 transition-all duration-300 pointer-events-none",
    hasValue || isFocused
      ? "top-2 text-xs"
      : "top-1/2 -translate-y-1/2 text-base",
    showError
      ? "text-red-400"
      : showSuccess
      ? "text-emerald-400"
      : isFocused
      ? "text-[#b8860b]"
      : "text-gray-500"
  );

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className="relative group">
      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={cn(inputClasses, "resize-none")}
          style={{
            borderColor: isFocused && !showError && !showSuccess ? ACCENT_COLOR : undefined,
          }}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          style={{
            borderColor: isFocused && !showError && !showSuccess ? ACCENT_COLOR : undefined,
          }}
        />
      )}

      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Focus glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={false}
        animate={{
          boxShadow: isFocused
            ? `0 0 20px ${ACCENT_COLOR}20, inset 0 0 20px ${ACCENT_COLOR}05`
            : "none",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Validation icon */}
      <AnimatePresence>
        {(showError || showSuccess) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2",
              multiline && "top-6 translate-y-0"
            )}
          >
            {showError ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : (
              <Check className="w-5 h-5 text-emerald-400" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {showError && validation?.message && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="text-xs text-red-400 mt-1 pl-1"
          >
            {validation.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// ANIMATED CHECKBOX
// ============================================================================

interface AnimatedCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: React.ReactNode;
  required?: boolean;
}

function AnimatedCheckbox({
  id,
  name,
  checked,
  onChange,
  label,
  required,
}: AnimatedCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 cursor-pointer group"
    >
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          className="sr-only peer"
        />
        <motion.div
          className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
            checked
              ? "bg-[#b8860b] border-[#b8860b]"
              : "bg-gray-800/50 border-gray-600 group-hover:border-gray-500"
          )}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        {label}
      </span>
    </label>
  );
}

// ============================================================================
// STEP INDICATOR
// ============================================================================

function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: {
  currentStep: number;
  totalSteps: number;
  steps: typeof formSteps;
}) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: ACCENT_COLOR }}
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <motion.div
              key={step.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isCompleted
                    ? "bg-[#b8860b] text-white"
                    : isActive
                    ? "bg-[#b8860b]/20 text-[#b8860b] border-2 border-[#b8860b]"
                    : "bg-gray-800 text-gray-500 border-2 border-gray-700"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive || isCompleted ? "text-white" : "text-gray-500"
                  )}
                >
                  {step.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// PATH SELECTOR (STEP 1)
// ============================================================================

function PathSelector({
  selectedPath,
  onSelect,
}: {
  selectedPath: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h3 className="text-2xl font-bold text-white mb-2">
        Co Cie do nas sprowadza?
      </h3>
      <p className="text-gray-400 mb-8">
        Wybierz obszar, ktory Cie interesuje - pomoze nam to lepiej przygotowac sie do rozmowy.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {conversationPaths.map((path, index) => {
          const Icon = path.icon;
          const isSelected = selectedPath === path.id;

          return (
            <motion.button
              key={path.id}
              onClick={() => onSelect(path.id)}
              className={cn(
                "relative p-5 rounded-2xl text-left transition-all duration-300 overflow-hidden",
                "border-2 group"
              )}
              style={{
                borderColor: isSelected ? path.color : "rgba(55, 65, 81, 0.5)",
                backgroundColor: isSelected ? `${path.color}10` : "rgba(17, 24, 39, 0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Hover gradient */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${path.color}15 0%, transparent 70%)`,
                }}
              />

              {/* Selection indicator */}
              <motion.div
                className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: isSelected ? path.color : "#4b5563",
                  backgroundColor: isSelected ? path.color : "transparent",
                }}
                animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                )}
              </motion.div>

              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? `${path.color}30` : "rgba(255,255,255,0.05)",
                }}
              >
                <Icon
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: isSelected ? path.color : "#9ca3af" }}
                />
              </div>

              <h4
                className="relative font-semibold text-lg mb-1 transition-colors duration-300"
                style={{ color: isSelected ? "white" : "#d1d5db" }}
              >
                {path.title}
              </h4>
              <p className="relative text-sm text-gray-500">{path.subtitle}</p>

              {/* Selection glow */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    boxShadow: `0 0 30px ${path.color}30, inset 0 0 30px ${path.color}10`,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Response after selection */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {(() => {
              const path = conversationPaths.find((p) => p.id === selectedPath);
              if (!path) return null;
              return (
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: `${path.color}10`,
                    borderLeft: `3px solid ${path.color}`,
                  }}
                >
                  <p className="text-gray-200">{path.response}</p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// CONTACT METHOD SELECTOR (STEP 2)
// ============================================================================

function ContactMethodSelector({
  selectedMethod,
  onSelect,
  onCalendlyClick,
}: {
  selectedMethod: string | null;
  onSelect: (id: string) => void;
  onCalendlyClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold text-white mb-2">
        Jak chcesz sie skontaktowac?
      </h3>
      <p className="text-gray-400 mb-8">
        Wybierz preferowana forme kontaktu - odpowiemy najszybciej jak to mozliwe.
      </p>

      <div className="space-y-4">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <motion.button
              key={method.id}
              onClick={() => {
                onSelect(method.id);
                if (method.id === "calendar") {
                  onCalendlyClick();
                }
              }}
              className={cn(
                "relative w-full p-5 rounded-2xl text-left transition-all duration-300 overflow-hidden",
                "border-2 group flex items-center gap-5"
              )}
              style={{
                borderColor: isSelected ? method.color : "rgba(55, 65, 81, 0.5)",
                backgroundColor: isSelected ? `${method.color}10` : "rgba(17, 24, 39, 0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? method.color : `${method.color}20`,
                }}
              >
                <Icon
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: isSelected ? "white" : method.color }}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">{method.title}</h4>
                  {method.recommended && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${ACCENT_COLOR}30`, color: ACCENT_COLOR }}
                    >
                      Polecane
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{method.description}</p>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isSelected ? "text-white opacity-100" : "text-gray-500 opacity-0 group-hover:opacity-100"
                )}
              />

              {/* Selection indicator */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 left-0 w-1 rounded-r-full"
                style={{ backgroundColor: method.color }}
                initial={{ height: 0 }}
                animate={{ height: isSelected ? "60%" : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// CONTACT FORM (STEP 3)
// ============================================================================

function ContactFormStep({
  formData,
  validation,
  onChange,
  onValidate,
  onSubmit,
  onVideoReady,
  isSubmitting,
  error,
  hasVideo,
}: {
  formData: FormData;
  validation: ValidationState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onValidate: (field: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onVideoReady: (blob: Blob | null, url: string | null) => void;
  isSubmitting: boolean;
  error: string | null;
  hasVideo: boolean;
}) {
  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <h3 className="text-2xl font-bold text-white mb-2">
        Powiedz nam o sobie
      </h3>
      <p className="text-gray-400 mb-6">
        Wypelnij formularz, a odezwiemy sie najszybciej jak to mozliwe.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <AnimatedInput
          id="name"
          name="name"
          label="Imie i nazwisko"
          value={formData.name}
          onChange={onChange}
          onBlur={() => onValidate("name")}
          placeholder="Jan Kowalski"
          required
          validation={validation.name}
        />
        <AnimatedInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={onChange}
          onBlur={() => onValidate("email")}
          placeholder="jan@firma.pl"
          required
          validation={validation.email}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <AnimatedInput
          id="phone"
          name="phone"
          type="tel"
          label="Telefon"
          value={formData.phone}
          onChange={onChange}
          onBlur={() => onValidate("phone")}
          placeholder="+48 XXX XXX XXX"
          validation={validation.phone}
        />
        <AnimatedInput
          id="company"
          name="company"
          label="Firma"
          value={formData.company}
          onChange={onChange}
          placeholder="Nazwa firmy"
        />
      </div>

      <AnimatedInput
        id="role"
        name="role"
        label="Twoja rola"
        value={formData.role}
        onChange={onChange}
        placeholder="np. CEO, HR Director"
      />

      <AnimatedInput
        id="message"
        name="message"
        label="Wiadomosc"
        value={formData.message}
        onChange={onChange}
        placeholder="Opisz krotko sytuacje..."
        multiline
        rows={4}
      />

      {/* Video message option */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-[#b8860b]" />
          <span className="text-sm font-medium text-gray-300">
            Lub nagraj wiadomość wideo
          </span>
          <span className="text-xs text-gray-500">(opcjonalne)</span>
        </div>
        <VideoRecorder onVideoReady={onVideoReady} maxDuration={60} />
        {hasVideo && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center gap-2 text-sm text-emerald-400"
          >
            <Check className="w-4 h-4" />
            Wideo gotowe do wysłania
          </motion.div>
        )}
      </div>

      <AnimatedCheckbox
        id="consent"
        name="consent"
        checked={formData.consent}
        onChange={onChange}
        required
        label={
          <>
            Wyrazam zgode na przetwarzanie danych osobowych w celu kontaktu zgodnie z{" "}
            <a href="/polityka-prywatnosci" className="text-[#b8860b] hover:underline">
              polityka prywatnosci
            </a>
            .
          </>
        }
      />

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={onChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isSubmitting || !formData.consent}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg",
          "transition-all duration-300 relative overflow-hidden",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        style={{
          backgroundColor: ACCENT_COLOR,
          color: "white",
        }}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${ACCENT_COLOR} 0%, ${ACCENT_LIGHT} 50%, ${ACCENT_COLOR} 100%)`,
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: isSubmitting ? ["0% 0%", "100% 0%"] : "0% 0%",
          }}
          transition={{
            duration: 1,
            repeat: isSubmitting ? Infinity : 0,
            ease: "linear",
          }}
        />

        <span className="relative z-10 flex items-center gap-3">
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Wysylanie...
            </>
          ) : (
            <>
              Wyslij wiadomosc
              <Send className="w-5 h-5" />
            </>
          )}
        </span>
      </motion.button>
    </motion.form>
  );
}

// ============================================================================
// SUCCESS MESSAGE
// ============================================================================

function SuccessMessage({ t }: { t: (key: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        className="relative w-24 h-24 mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
      >
        {/* Animated rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
      </motion.div>

      <motion.h3
        className="text-3xl font-bold text-white mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {t("form.success")}
      </motion.h3>

      <motion.p
        className="text-gray-400 text-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {t("description")}
      </motion.p>

      {/* Team profiles */}
      <motion.div
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm text-gray-500">{t("info.title")}:</span>
        <div className="flex items-center -space-x-3">
          {teamProfiles.map((profile, i) => (
            <motion.div
              key={profile.name}
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-gray-900 flex items-center justify-center font-bold text-lg"
                style={{
                  backgroundColor: `${profile.color}30`,
                  color: profile.color,
                }}
              >
                {profile.avatar}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// INFO PANEL (RIGHT SIDE)
// ============================================================================

function InfoPanel() {
  return (
    <div className="space-y-6">
      {/* Hero card */}
      <motion.div
        className="relative p-8 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${ACCENT_COLOR}15 0%, #2d5a7b15 100%)`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Animated background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${ACCENT_COLOR}30` }}
            >
              <Clock className="w-6 h-6" style={{ color: ACCENT_COLOR }} />
            </div>
            <div>
              <p className="font-semibold text-white">Bezplatna konsultacja</p>
              <p className="text-sm text-gray-400">bez zobowiazan</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-5xl font-bold text-white mb-2">20 min</p>
            <p className="text-gray-400">
              wystarczy, zeby zrozumiec Twoje wyzwanie i zaproponowac kierunek dzialania
            </p>
          </div>

          <CalendlyButton
            url={contactContent.calendlyUrl}
            className="w-full justify-center bg-[#b8860b] hover:bg-[#d4a843] border-none"
            variant="primary"
          />
        </div>
      </motion.div>

      {/* Live Availability */}
      <motion.div
        className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <AvailabilityIndicator />
      </motion.div>

      {/* Client Portal Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <ClientPortalPreview />
      </motion.div>

      {/* Team profiles */}
      <motion.div
        className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-sm font-medium text-gray-400 mb-5 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Porozmawiasz z ekspertami
        </h4>
        <div className="space-y-4">
          {teamProfiles.map((profile, index) => (
            <motion.div
              key={profile.name}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/30 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${profile.color}20`,
                  color: profile.color,
                }}
              >
                {profile.avatar}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{profile.name}</div>
                <div className="text-sm text-gray-500">{profile.role}</div>
                <div className="text-xs text-gray-600 mt-0.5">{profile.specialty}</div>
              </div>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-gray-700/50"
              >
                <Linkedin className="w-4 h-4 text-gray-400" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact info */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <a
          href={`mailto:${contactContent.email}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/30 border border-gray-800/50 hover:border-[#b8860b]/30 transition-all group"
        >
          <div className="w-11 h-11 rounded-lg bg-gray-800/50 flex items-center justify-center group-hover:bg-[#b8860b]/20 transition-colors">
            <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#b8860b] transition-colors" />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Email</div>
            <div className="text-sm text-white font-medium">{contactContent.email}</div>
          </div>
        </a>

        <a
          href={`tel:${contactContent.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/30 border border-gray-800/50 hover:border-[#b8860b]/30 transition-all group"
        >
          <div className="w-11 h-11 rounded-lg bg-gray-800/50 flex items-center justify-center group-hover:bg-[#b8860b]/20 transition-colors">
            <Phone className="w-5 h-5 text-gray-400 group-hover:text-[#b8860b] transition-colors" />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Telefon</div>
            <div className="text-sm text-white font-medium">{contactContent.phone}</div>
          </div>
        </a>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/30 border border-gray-800/50">
          <div className="w-11 h-11 rounded-lg bg-gray-800/50 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Lokalizacja</div>
            <div className="text-sm text-white font-medium">Warszawa, Polska</div>
          </div>
        </div>
      </motion.div>

      {/* Social links & trust badge */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Social links */}
        <div className="flex items-center gap-2">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-[#b8860b]/20 transition-colors group"
                aria-label={social.label}
              >
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#b8860b] transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">95% poleca</span>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// MAIN CONTACT COMPONENT
// ============================================================================

export function Contact() {
  const t = useTranslations("contact");
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { leadData, trackContactFormProgress, trackVideoRecorded, trackCalendlyClick } = useLeadScoring();

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKonfetti, setShowKonfetti] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    message: "",
    consent: false,
    website: "",
    path: "",
    contactMethod: "",
    hasVideo: false,
  });

  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const [validation, setValidation] = useState<ValidationState>({
    name: { valid: true, message: "", touched: false },
    email: { valid: true, message: "", touched: false },
    phone: { valid: true, message: "", touched: false },
  });

  // Validation functions
  const validateField = (field: string) => {
    let valid = true;
    let message = "";

    switch (field) {
      case "name":
        if (!formData.name.trim()) {
          valid = false;
          message = "Imie i nazwisko jest wymagane";
        } else if (formData.name.trim().length < 2) {
          valid = false;
          message = "Imie jest za krotkie";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
          valid = false;
          message = "Email jest wymagany";
        } else if (!emailRegex.test(formData.email)) {
          valid = false;
          message = "Nieprawidlowy format email";
        }
        break;
      case "phone":
        if (formData.phone && formData.phone.replace(/\s/g, "").length < 9) {
          valid = false;
          message = "Numer telefonu jest za krotki";
        }
        break;
    }

    setValidation((prev) => ({
      ...prev,
      [field]: { valid, message, touched: true },
    }));

    return valid;
  };

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Reset validation on change
    if (validation[name]?.touched) {
      setValidation((prev) => ({
        ...prev,
        [name]: { ...prev[name], touched: false },
      }));
    }
  };

  const handlePathSelect = (id: string) => {
    setSelectedPath(id);
    setFormData((prev) => ({ ...prev, path: id }));
    // Track first step engagement
    trackContactFormProgress(1);
  };

  const handleMethodSelect = (id: string) => {
    setSelectedMethod(id);
    setFormData((prev) => ({ ...prev, contactMethod: id }));
  };

  const handleCalendlyClick = () => {
    // Calendly is handled by the CalendlyButton component
  };

  const handleVideoReady = (blob: Blob | null, url: string | null) => {
    setVideoBlob(blob);
    setFormData((prev) => ({ ...prev, hasVideo: blob !== null }));
    if (blob) {
      trackVideoRecorded();
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      trackContactFormProgress(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const nameValid = validateField("name");
    const emailValid = validateField("email");

    if (!nameValid || !emailValid) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Include lead score data in submission
      const submissionData = {
        ...formData,
        leadScore: leadData ? {
          score: leadData.score,
          grade: leadData.grade,
          totalTimeOnSite: leadData.totalTimeOnSite,
          pageViews: leadData.pageViews,
          scrollDepth: leadData.scrollDepth,
          visitCount: leadData.visitCount,
          returnVisit: leadData.returnVisit,
          quizCompleted: leadData.quizCompleted,
          quizScore: leadData.quizScore,
          calculatorUsed: leadData.calculatorUsed,
          calculatorSavings: leadData.calculatorSavings,
          calendlyClicked: leadData.calendlyClicked,
          videoRecorded: leadData.videoRecorded,
          easterEggFound: leadData.easterEggFound,
          alerts: leadData.alerts,
        } : undefined,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        trackFormSubmission("contact_form", false);
        throw new Error(data.error || "Wystapil blad podczas wysylania");
      }

      trackFormSubmission("contact_form", true);
      setIsSubmitted(true);
      setShowKonfetti(true);
      setTimeout(() => setShowKonfetti(false), 4000);
    } catch (err) {
      trackFormSubmission("contact_form", false);
      setError(err instanceof Error ? err.message : "Wystapil nieoczekiwany blad");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Can proceed to next step?
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedPath !== null;
      case 2:
        return selectedMethod !== null;
      default:
        return false;
    }
  };

  return (
    <section
      ref={containerRef}
      id="kontakt"
      className="relative py-24 md:py-32 lg:py-40 bg-gray-950 overflow-hidden"
    >
      {/* Konfetti celebration */}
      <Konfetti active={showKonfetti} particleCount={200} />

      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{ background: `radial-gradient(circle, ${ACCENT_COLOR} 0%, transparent 70%)` }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
          style={{ background: `radial-gradient(circle, #2d5a7b 0%, transparent 70%)` }}
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm text-sm font-medium text-gray-400 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
            transition={{ delay: 0.2 }}
          >
            <MessageCircle className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
            {t("tagline")}
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t("title")}{" "}
            <span
              className="relative"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLOR} 0%, ${ACCENT_LIGHT} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Main content - Split screen layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Left side - Form */}
          <div className="order-2 lg:order-1">
            <div className="p-8 md:p-10 rounded-3xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <SuccessMessage key="success" t={t} />
                ) : (
                  <motion.div key="form-flow">
                    {/* Step indicator */}
                    <StepIndicator
                      currentStep={currentStep}
                      totalSteps={3}
                      steps={formSteps}
                    />

                    {/* Form steps */}
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <PathSelector
                          key="step1"
                          selectedPath={selectedPath}
                          onSelect={handlePathSelect}
                        />
                      )}

                      {currentStep === 2 && (
                        <ContactMethodSelector
                          key="step2"
                          selectedMethod={selectedMethod}
                          onSelect={handleMethodSelect}
                          onCalendlyClick={handleCalendlyClick}
                        />
                      )}

                      {currentStep === 3 && (
                        <ContactFormStep
                          key="step3"
                          formData={formData}
                          validation={validation}
                          onChange={handleChange}
                          onValidate={validateField}
                          onSubmit={handleSubmit}
                          onVideoReady={handleVideoReady}
                          isSubmitting={isSubmitting}
                          error={error}
                          hasVideo={formData.hasVideo}
                        />
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    {currentStep < 3 && (
                      <motion.div
                        className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {currentStep > 1 ? (
                          <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Wstecz
                          </button>
                        ) : (
                          <div />
                        )}

                        <motion.button
                          onClick={handleNext}
                          disabled={!canProceed()}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                            canProceed()
                              ? "bg-[#b8860b] text-white hover:bg-[#d4a843]"
                              : "bg-gray-800 text-gray-500 cursor-not-allowed"
                          )}
                          whileHover={canProceed() ? { scale: 1.02 } : {}}
                          whileTap={canProceed() ? { scale: 0.98 } : {}}
                        >
                          Dalej
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        className="mt-6 pt-6 border-t border-gray-800/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <button
                          onClick={handleBack}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Wroc do poprzedniego kroku
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side - Info panel */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <InfoPanel />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
