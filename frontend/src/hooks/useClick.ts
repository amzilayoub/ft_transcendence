import { useEffect, useRef } from "react";

export default function useClick(
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const element = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", handler);
    }
    const ref = element.current;
    return () => {
      if (ref) ref.removeEventListener("click", handler);
    };
  }, [handler]);
  return element;
}
