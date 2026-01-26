"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(184, 134, 11, 0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(45, 90, 123, 0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative text-center max-w-2xl">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#b8860b] via-[#d4a843] to-[#2d5a7b]">
              404
            </span>
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Zabłądziłeś?
          </h2>
          <p className="text-lg text-foreground-secondary mb-8">
            Ta strona nie istnieje. Ale spokojnie — nawet najlepsze organizacje czasem
            gubią się w drodze do celu. Ważne, żeby znaleźć właściwy kierunek.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b8860b] text-white font-semibold hover:bg-[#d4a843] transition-colors"
          >
            <Home className="w-5 h-5" />
            Strona główna
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-foreground font-medium hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Wróć
          </button>
        </motion.div>

        {/* Fun quote */}
        <motion.p
          className="mt-12 text-sm text-foreground-muted italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          „Nie każdy, kto błądzi, jest zgubiony." — J.R.R. Tolkien
        </motion.p>
      </div>
    </div>
  );
}
