import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "success" | "info" | "warning" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "gradient-bg text-white hover:opacity-90": variant === "default",
            "bg-white/10 text-white hover:bg-white/20": variant === "outline",
            "bg-transparent text-white hover:bg-white/10": variant === "ghost",
            "bg-transparent text-white underline-offset-4 hover:underline": variant === "link",
            "bg-secondary text-white hover:opacity-90": variant === "secondary",
            "bg-success text-white hover:opacity-90": variant === "success",
            "bg-info text-white hover:opacity-90": variant === "info",
            "bg-warning text-white hover:opacity-90": variant === "warning",
            "bg-destructive text-white hover:opacity-90": variant === "destructive",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-12 rounded-lg px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
