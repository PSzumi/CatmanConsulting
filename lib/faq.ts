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

// Mapa zamiast funkcji zwracajacej komponent - wywolanie w renderze lamie
// regule react-compilera "Cannot create components during render".
export const FAQ_ICONS: Record<string, LucideIcon> = {
  Award,
  Building2,
  Clock,
  Globe,
  MessageCircle,
  Shield,
  Target,
  Wallet,
};

export const FAQ_ICON_FALLBACK = HelpCircle;

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
