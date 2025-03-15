
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const TransitionWrapper = ({
  children,
  className,
  delay = 0,
}: TransitionWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out opacity-0",
        isVisible ? "opacity-100 translate-y-0" : "translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
