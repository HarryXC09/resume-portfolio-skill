import { useEffect, useState } from "react";
export function useReduced() {
  const [value, set] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => set(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return value;
}
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
