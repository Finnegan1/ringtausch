import React from "react";

import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "inlineCode"
    | "lead"
    | "large"
    | "small"
    | "muted";
  children: React.ReactNode;
}

export const Typography = ({ variant, children, className, ...props }: TypographyProps) => {
  const getVariantStyles = (): string => {
    switch (variant) {
      case "h1":
        return "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl";
      case "h2":
        return "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0";
      case "h3":
        return "scroll-m-20 text-2xl font-semibold tracking-tight";
      case "h4":
        return "scroll-m-20 text-xl font-semibold tracking-tight";
      case "p":
        return "leading-7 [&:not(:first-child)]:mt-6";
      case "blockquote":
        return "mt-6 border-l-2 pl-6 italic";
      case "inlineCode":
        return "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold";
      case "lead":
        return "text-xl text-muted-foreground";
      case "large":
        return "text-lg font-semibold";
      case "small":
        return "text-sm font-medium leading-none";
      case "muted":
        return "text-sm text-muted-foreground";
      default:
        return "";
    }
  };

  const Component =
    variant == "large"
      ? "div"
      : variant == "muted"
        ? "p"
        : variant == "inlineCode"
          ? "code"
          : variant == "lead"
            ? "p"
            : variant;

  return (
    <Component className={cn(getVariantStyles(), className)} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
