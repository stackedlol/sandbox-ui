"use client";

import { useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, style, ...props }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${(y - 0.5) * -8}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
    });
  }, []);

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <div className="h-full" style={{ perspective: "800px" }}>
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          "glass glass-3d rounded-2xl p-6 h-full",
          "hover:[translate:0_-4px]",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
