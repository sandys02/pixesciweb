"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatDate(value: string) {
  const date = parseDate(value)

  return date
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    : "Select date"
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function LicenseDatePicker({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
}) {
  const [open, setOpen] = React.useState(false)
  const helperTextId = helperText ? `${id}-helper` : undefined
  const selectedDate = parseDate(value)
  const showLabel = Boolean(value) || open

  return (
    <div className="mt-1 w-full">
      <div className="relative w-full">
        <label
          htmlFor={id}
          className={cn(
            "absolute -top-2 left-4 z-10 rounded-md bg-background px-2 py-0.5 text-xs transition-all duration-200",
            open ? "text-primary" : "text-muted-foreground",
            error && "text-destructive",
            !showLabel && "pointer-events-none invisible opacity-0"
          )}
        >
          {label}
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              className={cn(
                "h-10 w-full justify-start font-normal",
                !selectedDate && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive/30"
              )}
              aria-invalid={error || undefined}
              aria-describedby={helperTextId}
            >
              <CalendarIcon className="size-4" />
              {formatDate(value)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return
                onChange(toDateInputValue(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
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
