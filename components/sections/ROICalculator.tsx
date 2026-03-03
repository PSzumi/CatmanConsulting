"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Calculator, TrendingDown, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useVisitorPersonalization } from "@/lib/useVisitorPersonalization";
import { useLeadScoring } from "@/lib/useLeadScoring";
import { useTranslations } from "next-intl";

interface CalculatorInputs {
  employees: number;
  avgSalary: number;
  turnoverRate: number;
  conflictHours: number;
}

const defaultInputs: CalculatorInputs = {
  employees: 100,
  avgSalary: 12000,
  turnoverRate: 20,
  conflictHours: 5,
};

// Cost calculations based on organizational research
function calculateCosts(inputs: CalculatorInputs) {
  const { employees, avgSalary, turnoverRate, conflictHours } = inputs;

  // Cost of turnover (hiring, training, lost productivity) = ~150% of annual salary
  const turnoverCostPerEmployee = avgSalary * 12 * 1.5;
  const employeesLeaving = Math.round(employees * (turnoverRate / 100));
  const turnoverCost = employeesLeaving * turnoverCostPerEmployee;

  // Cost of conflict/inefficiency = hours * hourly rate * employees affected
  const hourlyRate = avgSalary / 160; // ~160 working hours per month
  const conflictCost = conflictHours * hourlyRate * employees * 12; // annual

  // Lost productivity due to disengagement (~20% of salary for disengaged employees)
  const disengagementRate = Math.min(turnoverRate * 1.5, 40) / 100; // correlated with turnover
  const productivityLoss = employees * disengagementRate * avgSalary * 12 * 0.2;

  const totalCost = turnoverCost + conflictCost + productivityLoss;

  // Potential savings with transformation (conservative 40% improvement)
  const potentialSavings = totalCost * 0.4;

  return {
    turnoverCost,
    conflictCost,
    productivityLoss,
    totalCost,
    potentialSavings,
    employeesLeaving,
  };
}

function formatPLN(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

// Animated number component
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<{ value: number }>({ value: 0 });

  useEffect(() => {
    gsap.to(ref.current, {
      value: value,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => setDisplayValue(Math.round(ref.current.value)),
    });
  }, [value]);

  return (
    <span>
      {prefix}
      {formatPLN(displayValue)}
      {suffix}
    </span>
  );
}

export function ROICalculator() {
  const t = useTranslations("roiCalculator");
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [showResults, setShowResults] = useState(false);
  const [costs, setCosts] = useState(calculateCosts(defaultInputs));
  const { saveCalculatorResults } = useVisitorPersonalization();
  const { trackCalculatorUse } = useLeadScoring();

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    setCosts(calculateCosts(newInputs));
  };

  const handleCalculate = () => {
    setShowResults(true);
    // Save results for personalization and lead scoring
    saveCalculatorResults(inputs.employees, costs.potentialSavings);
    trackCalculatorUse(costs.potentialSavings);
  };

  return (
    <section
      ref={containerRef}
      id="kalkulator"
      className="relative py-32 md:py-40 bg-background-secondary overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(139, 26, 26, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8b1a1a]/10 text-[#8b1a1a] text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            {t("tagline")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("title")}{" "}
            <span className="text-[#8b1a1a]">{t("titleHighlight")}</span>
          </h2>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          className="rounded-3xl p-8 md:p-12"
          style={{
            background: "linear-gradient(145deg, rgba(139, 26, 26, 0.05) 0%, rgba(26,26,26,0.8) 100%)",
            border: "1px solid rgba(139, 26, 26, 0.2)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Inputs Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Employees */}
            <div>
              <label className="block text-sm font-medium text-foreground-secondary mb-2">
                {t("inputs.employees.label")}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={inputs.employees}
                onChange={(e) => handleInputChange("employees", Number(e.target.value))}
                className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-[#8b1a1a]"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-foreground-muted">10</span>
                <span className="text-2xl font-bold text-foreground">{inputs.employees}</span>
                <span className="text-sm text-foreground-muted">500</span>
              </div>
            </div>

            {/* Average Salary */}
            <div>
              <label className="block text-sm font-medium text-foreground-secondary mb-2">
                {t("inputs.avgSalary.label")}
              </label>
              <input
                type="range"
                min="5000"
                max="30000"
                step="500"
                value={inputs.avgSalary}
                onChange={(e) => handleInputChange("avgSalary", Number(e.target.value))}
                className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-[#8b1a1a]"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-foreground-muted">5 000</span>
                <span className="text-2xl font-bold text-foreground">{inputs.avgSalary.toLocaleString("pl-PL")}</span>
                <span className="text-sm text-foreground-muted">30 000</span>
              </div>
            </div>

            {/* Turnover Rate */}
            <div>
              <label className="block text-sm font-medium text-foreground-secondary mb-2">
                {t("inputs.turnover.label")}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={inputs.turnoverRate}
                onChange={(e) => handleInputChange("turnoverRate", Number(e.target.value))}
                className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-[#8b1a1a]"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-foreground-muted">5%</span>
                <span className="text-2xl font-bold text-foreground">{inputs.turnoverRate}%</span>
                <span className="text-sm text-foreground-muted">50%</span>
              </div>
            </div>

            {/* Conflict Hours */}
            <div>
              <label className="block text-sm font-medium text-foreground-secondary mb-2">
                {t("inputs.conflictHours.label")}
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={inputs.conflictHours}
                onChange={(e) => handleInputChange("conflictHours", Number(e.target.value))}
                className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-[#8b1a1a]"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-foreground-muted">1h</span>
                <span className="text-2xl font-bold text-foreground">{inputs.conflictHours}h</span>
                <span className="text-sm text-foreground-muted">15h</span>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          {!showResults && (
            <motion.button
              onClick={handleCalculate}
              className="w-full py-4 rounded-xl bg-[#8b1a1a] text-white font-semibold text-lg hover:bg-[#b32424] transition-colors btn-shine"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t("calculate")}
            </motion.button>
          )}

          {/* Results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8b1a1a]/30 to-transparent my-8" />

              {/* Cost Breakdown */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-foreground-muted">{t("results.turnoverCost")}</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400">
                    <AnimatedNumber value={costs.turnoverCost} />
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {t("results.employeesLeaving", { count: costs.employeesLeaving })}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-foreground-muted">{t("results.conflictCost")}</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-400">
                    <AnimatedNumber value={costs.conflictCost} />
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {t("results.conflictHoursPerWeek", { hours: inputs.conflictHours, employees: inputs.employees })}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-foreground-muted">{t("results.productivityLoss")}</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">
                    <AnimatedNumber value={costs.productivityLoss} />
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {t("results.disengagedEmployees")}
                  </p>
                </div>
              </div>

              {/* Total and Savings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-foreground-muted mb-2">{t("results.totalCost")}</p>
                  <p className="text-4xl md:text-5xl font-bold text-red-400">
                    <AnimatedNumber value={costs.totalCost} />
                  </p>
                </div>

                <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <p className="text-sm text-foreground-muted">{t("results.potentialSavings")}</p>
                  </div>
                  <p className="text-4xl md:text-5xl font-bold text-emerald-400">
                    <AnimatedNumber value={costs.potentialSavings} />
                  </p>
                  <p className="text-xs text-foreground-muted mt-2">
                    {t("results.savingsNote")}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 text-center">
                <p className="text-foreground-secondary mb-6">
                  {t("ctaDescription")}
                </p>
                <a
                  href="#kontakt"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#8b1a1a] text-white font-semibold text-lg hover:shadow-2xl hover:shadow-[#8b1a1a]/30 transition-all hover:scale-[1.02]"
                >
                  {t("cta")}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-foreground-muted mt-6">
          * {t("results.disclaimer")}
        </p>
      </div>
    </section>
  );
}
