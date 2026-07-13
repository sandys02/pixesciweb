"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Option<TValue extends string> = {
  value: TValue
  label: string
}

type FloatingLabelSelectProps<TValue extends string> = {
  id: string
  label: string
  value: TValue
  onValueChange: (value: TValue) => void
  options: ReadonlyArray<Option<TValue>>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
  labelLeftClassName?: string
  labelClassName?: string
  className?: string
  triggerClassName?: string
  contentAlign?: "start" | "center" | "end"
}

export function FloatingLabelSelect<TValue extends string>({
  id,
  label,
  value,
  onValueChange,
  options,
  placeholder = "",
  required,
  disabled,
  error,
  helperText,
  labelLeftClassName = "left-4",
  labelClassName,
  className,
  triggerClassName,
  contentAlign = "start",
}: FloatingLabelSelectProps<TValue>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const showLabel = Boolean(value) || isOpen
  const helperTextId = helperText ? `${id}-helper` : undefined

  return (
    <div className={cn("mt-1 w-full", className)}>
      <div className="relative w-full">
        <label
          htmlFor={id}
          className={cn(
            "absolute -top-2 z-10 rounded-md bg-background px-2 py-0.5 text-xs transition-all duration-200",
            labelLeftClassName,
            isOpen ? "text-primary" : "text-muted-foreground",
            error && "text-destructive",
            !showLabel && "pointer-events-none invisible opacity-0",
            labelClassName
          )}
        >
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </label>

        <Select
          value={value}
          onValueChange={(nextValue) => onValueChange(nextValue as TValue)}
          open={isOpen}
          onOpenChange={setIsOpen}
          disabled={disabled}
        >
          <SelectTrigger
            id={id}
            aria-invalid={error || undefined}
            aria-describedby={helperTextId}
            className={cn(
              "h-10 w-full",
              error && "border-destructive focus-visible:ring-destructive/30",
              triggerClassName
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent align={contentAlign} position="popper">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {helperText ? (
        <p
          id={helperTextId}
          className={cn(
            "mt-2 text-xs text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
