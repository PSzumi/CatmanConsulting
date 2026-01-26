"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import {
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Jak często w Twojej organizacji zdarzają się konflikty między działami?",
    options: [
      { text: "Rzadko, współpracujemy sprawnie", score: 4 },
      { text: "Czasami, ale je rozwiązujemy", score: 3 },
      { text: "Regularnie, to częsty problem", score: 2 },
      { text: "Ciągle, to norma u nas", score: 1 },
    ],
  },
  {
    id: 2,
    question: "Czy pracownicy wiedzą, czego się od nich oczekuje?",
    options: [
      { text: "Tak, mamy jasne cele i miary", score: 4 },
      { text: "Raczej tak, choć mogłoby być lepiej", score: 3 },
      { text: "Nie zawsze, bywa zamieszanie", score: 2 },
      { text: "Nie, panuje chaos", score: 1 },
    ],
  },
  {
    id: 3,
    question: "Jak wygląda rotacja pracowników w Twojej firmie?",
    options: [
      { text: "Niska, ludzie zostają latami", score: 4 },
      { text: "Umiarkowana, w normie rynkowej", score: 3 },
      { text: "Wysoka, trudno utrzymać ludzi", score: 2 },
      { text: "Bardzo wysoka, ciągłe zmiany", score: 1 },
    ],
  },
  {
    id: 4,
    question: "Czy liderzy w Twojej organizacji dają i przyjmują feedback?",
    options: [
      { text: "Tak, to nasza kultura", score: 4 },
      { text: "Próbujemy, ale niekonsekwentnie", score: 3 },
      { text: "Rzadko, to trudny temat", score: 2 },
      { text: "Nie, feedback jest tabu", score: 1 },
    ],
  },
  {
    id: 5,
    question: "Jak szybko podejmowane są decyzje w Twojej firmie?",
    options: [
      { text: "Sprawnie, mamy jasny proces", score: 4 },
      { text: "Dość szybko, choć z wyjątkami", score: 3 },
      { text: "Wolno, dużo dyskusji", score: 2 },
      { text: "Bardzo wolno lub wcale", score: 1 },
    ],
  },
  {
    id: 6,
    question: "Czy zespoły biorą odpowiedzialność za wyniki?",
    options: [
      { text: "Tak, każdy wie za co odpowiada", score: 4 },
      { text: "Częściowo, bywa rozmycie", score: 3 },
      { text: "Rzadko, szukamy winnych", score: 2 },
      { text: "Nie, nikt nie bierze odpowiedzialności", score: 1 },
    ],
  },
];

interface Result {
  level: "excellent" | "good" | "warning" | "critical";
  title: string;
  description: string;
  recommendation: string;
  color: string;
}

function getResult(score: number): Result {
  const maxScore = questions.length * 4;
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) {
    return {
      level: "excellent",
      title: "Wysoka dojrzałość organizacyjna",
      description:
        "Twoja organizacja funkcjonuje bardzo dobrze. Jasne struktury, kultura feedbacku i odpowiedzialność to Wasze atuty.",
      recommendation:
        "Rozważ programy doskonalenia dla liderów, aby utrzymać wysoką poprzeczkę i przygotować następne pokolenie.",
      color: "#10b981",
    };
  } else if (percentage >= 60) {
    return {
      level: "good",
      title: "Dobra baza do rozwoju",
      description:
        "Fundamenty są solidne, ale widzisz obszary do poprawy. To normalne — każda organizacja może się rozwijać.",
      recommendation:
        "Zidentyfikuj 2-3 kluczowe obszary i zacznij od nich. Systemowe podejście da lepsze efekty niż gaszenie pożarów.",
      color: "#b8860b",
    };
  } else if (percentage >= 40) {
    return {
      level: "warning",
      title: "Czas na zmiany",
      description:
        "Problemy organizacyjne prawdopodobnie kosztują Cię więcej niż myślisz — w pieniądzach, czasie i energii ludzi.",
      recommendation:
        "Nie czekaj aż problemy się pogłębią. Zewnętrzna perspektywa pomoże zidentyfikować priorytety i zaplanować transformację.",
      color: "#f59e0b",
    };
  } else {
    return {
      level: "critical",
      title: "Potrzebna interwencja",
      description:
        "Twoja organizacja ma poważne wyzwania. Ale jest dobra wiadomość — świadomość problemu to pierwszy krok do zmiany.",
      recommendation:
        "Działaj teraz. Im dłużej zwlekasz, tym trudniejsza będzie zmiana. Potrzebujesz partnera, który pomoże Ci przez to przejść.",
      color: "#ef4444",
    };
  }
}

export function AssessmentQuiz() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const totalScore = answers.reduce((sum, score) => sum + score, 0);
  const result = getResult(totalScore);
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <section
      ref={containerRef}
      id="diagnoza"
      className="relative py-32 md:py-40 bg-background overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(45, 90, 123, 0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2d5a7b]/10 text-[#2d5a7b] text-sm font-medium mb-4">
            <ClipboardCheck className="w-4 h-4" />
            Szybka diagnoza
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Czy Twoja organizacja jest{" "}
            <span className="text-[#2d5a7b]">gotowa na zmianę?</span>
          </h2>
          <p className="text-lg text-foreground-secondary">
            6 pytań. 2 minuty. Szczera odpowiedź na to, gdzie jesteś.
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between text-sm text-foreground-muted mb-2">
            <span>Postęp</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2d5a7b] to-[#b8860b] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Quiz Card */}
        <motion.div
          className="rounded-3xl p-8 md:p-12"
          style={{
            background: "linear-gradient(145deg, rgba(45, 90, 123, 0.05) 0%, rgba(26,26,26,0.8) 100%)",
            border: "1px solid rgba(45, 90, 123, 0.2)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Question number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-mono text-foreground-muted">
                    Pytanie {currentQuestion + 1} z {questions.length}
                  </span>
                  {currentQuestion > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Wstecz
                    </button>
                  )}
                </div>

                {/* Question */}
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  {questions[currentQuestion].question}
                </h3>

                {/* Options */}
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option.score)}
                      className="w-full p-5 rounded-xl text-left transition-all group"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      whileHover={{
                        background: "rgba(45, 90, 123, 0.1)",
                        borderColor: "rgba(45, 90, 123, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground group-hover:text-white transition-colors">
                          {option.text}
                        </span>
                        <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-[#2d5a7b] transition-colors" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Result Icon */}
                <div className="text-center mb-8">
                  <motion.div
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${result.color}20` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    {result.level === "excellent" || result.level === "good" ? (
                      <CheckCircle2 className="w-10 h-10" style={{ color: result.color }} />
                    ) : result.level === "warning" ? (
                      <AlertCircle className="w-10 h-10" style={{ color: result.color }} />
                    ) : (
                      <TrendingUp className="w-10 h-10" style={{ color: result.color }} />
                    )}
                  </motion.div>

                  {/* Score */}
                  <div className="mb-4">
                    <span className="text-5xl font-bold" style={{ color: result.color }}>
                      {totalScore}
                    </span>
                    <span className="text-2xl text-foreground-muted">/{questions.length * 4}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {result.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="space-y-6 mb-10">
                  <p className="text-lg text-foreground-secondary leading-relaxed">
                    {result.description}
                  </p>
                  <div
                    className="p-6 rounded-xl"
                    style={{
                      backgroundColor: `${result.color}10`,
                      borderLeft: `4px solid ${result.color}`,
                    }}
                  >
                    <p className="text-sm font-medium text-foreground-muted mb-2">
                      Nasza rekomendacja
                    </p>
                    <p className="text-foreground">{result.recommendation}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#kontakt"
                    className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#b8860b] text-white font-semibold hover:bg-[#d4a843] transition-colors"
                  >
                    Porozmawiajmy
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <button
                    onClick={handleReset}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 text-foreground font-medium hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Wypełnij ponownie
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
