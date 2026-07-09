"use client"

import * as React from "react"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type FloatingLabelTextareaProps = {
  id: string
  name?: string
  label: string
  value: string
  onChangeAction: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
  rows?: number
  maxLength?: number
  minLength?: number
  labelLeftClassName?: string
  labelClassName?: string
  autoComplete?: string
  className?: string
  textareaClassName?: string
}

export function FloatingLabelTextarea({
  id,
  name,
  label,
  value,
  onChangeAction,
  placeholder = "",
  required,
  disabled,
  error,
  helperText,
  rows = 3,
  maxLength,
  minLength,
  labelLeftClassName = "left-4",
  labelClassName,
  autoComplete,
  className,
  textareaClassName,
}: FloatingLabelTextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const showLabel = Boolean(value) || isFocused
  const helperTextId = helperText ? `${id}-helper` : undefined

  return (
    <div className={cn("mt-1 w-full", className)}>
      <div className="relative w-full">
        <label
          htmlFor={id}
          className={cn(
            "absolute -top-2 z-10 rounded-md bg-background px-2 py-0.5 text-xs transition-all duration-200",
            labelLeftClassName,
            isFocused ? "text-primary" : "text-muted-foreground",
            error && "text-destructive",
            !showLabel && "pointer-events-none invisible opacity-0",
            labelClassName
          )}
        >
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </label>

        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChangeAction(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          aria-invalid={error || undefined}
          aria-describedby={helperTextId}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/30",
            textareaClassName
          )}
        />
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
