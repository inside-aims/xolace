"use client";

import { ArrowRight } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface CtaButtonProps {
  label: string;
  showArrow?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  form?: string;
}

export const CtaButton: React.FC<CtaButtonProps> = ({
  label,
  showArrow = true,
  className = "",
  type = "button",
  onClick,
  form = "cta-button",
}) => {
  return (
    <Button
      className={`w-fit font-bold group/arrow ${className}`}
      onClick={onClick}
      type={type}
      form={form}
    >
      {label}
      {showArrow && (
        <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
      )}
    </Button>
  );
};
