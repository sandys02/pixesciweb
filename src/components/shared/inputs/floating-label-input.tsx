"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type FloatingLabelInputProps = {
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
  helperTextColor?: string
  type?: React.ComponentProps<"input">["type"]
  leftAdornment?: React.ReactNode
  leftAdornmentClassName?: string
  rightAdornment?: React.ReactNode
  rightAdornmentClassName?: string
  min?: string | number
  max?: string | number
  minLength?: number
  maxLength?: number
  step?: string | number
  labelLeftClassName?: string
  labelClassName?: string
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  onBlurAction?: () => void
  autoComplete?: string
  autoFocus?: boolean
  inputMode?: React.ComponentProps<"input">["inputMode"]
  spellCheck?: boolean
  className?: string
  inputClassName?: string
}

export function FloatingLabelInput({
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
  helperTextColor,
  type = "text",
  leftAdornment,
  leftAdornmentClassName,
  rightAdornment,
  rightAdornmentClassName,
  labelLeftClassName = "left-4",
  labelClassName,
  min,
  max,
  minLength,
  maxLength,
  step,
  onKeyDown,
  onBlurAction,
  autoComplete,
  autoFocus,
  inputMode,
  spellCheck,
  className,
  inputClassName,
}: FloatingLabelInputProps) {
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

        {leftAdornment ? (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground",
              leftAdornmentClassName
            )}
          >
            {leftAdornment}
          </div>
        ) : null}

        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChangeAction(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          step={step}
          inputMode={inputMode}
          spellCheck={spellCheck}
          aria-invalid={error || undefined}
          aria-describedby={helperTextId}
          onFocus={() => setIsFocused(true)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            setIsFocused(false)
            onBlurAction?.()
          }}
          className={cn(
            "py-5",
            leftAdornment && "pl-8",
            rightAdornment && "pr-12",
            error && "border-destructive focus-visible:ring-destructive/30",
            inputClassName
          )}
        />

        {rightAdornment ? (
          <div
            className={cn(
              "absolute top-1/2 right-1 -translate-y-1/2",
              rightAdornmentClassName
            )}
          >
            {rightAdornment}
          </div>
        ) : null}
      </div>

      {helperText ? (
        <p
          id={helperTextId}
          className={cn(
            "mt-2 text-xs",
            helperTextColor || "text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
