"use client";

import { useEffect, useState } from "react";

// True on small screens or when the user asks for reduced motion.
// Heavy hero effects (scroll parallax, backdrop blur, shard animation)
// are skipped when this is on — they tank scroll performance on phones.
export function useReducedFx() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(max-width: 768px), (prefers-reduced-motion: reduce)"
    );
    const update = () => setReduced(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
