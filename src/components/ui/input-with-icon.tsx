"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  iconPosition?: "left" | "right";
  containerClassName?: string;
  iconClassName?: string;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  (
    {
      className,
      containerClassName,
      iconClassName,
      icon: Icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        {iconPosition === "left" && (
          <Icon
            className={cn(
              "absolute left-3 h-5 w-5 text-gray-400",
              iconClassName
            )}
          />
        )}
        <Input
          className={cn(
            iconPosition === "left" ? "pl-10" : "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {iconPosition === "right" && (
          <Icon
            className={cn(
              "absolute right-3 h-5 w-5 text-gray-400",
              iconClassName
            )}
          />
        )}
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };