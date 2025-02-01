import { Locale, format } from "date-fns";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TimeProps extends Omit<React.ComponentPropsWithoutRef<"time">, "children"> {
  children: Parameters<typeof format>[0];
  dateTimeFormatStr?: string;
  formatStr?: string;
  locale?: Locale;
}

export const Time = React.forwardRef<React.ElementRef<"time">, TimeProps>(
  (
    { children, dateTimeFormatStr = "yyyy-MM-dd", formatStr = "PPP", locale, className, ...props },
    ref
  ) => (
    <time
      ref={ref}
      dateTime={format(children, dateTimeFormatStr)}
      className={cn("whitespace-nowrap", className)}
      {...props}
    >
      {format(children, formatStr, { locale })}
    </time>
  )
);
Time.displayName = "Time";
