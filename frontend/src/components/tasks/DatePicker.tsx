"use client"

import React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * DatePicker component for date selection.
 *
 * [Task]: T030
 * [From]: specs/008-advanced-features/tasks.md (User Story 1)
 *
 * Wraps the Calendar component in a Popover for a clean date selection UI.
 * Supports date selection, clear button, and keyboard navigation.
 */
interface DatePickerProps {
  value?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  // Disable dates before this date (e.g., today)
  disabledDates?: "before-today" | "after-today" | "none"
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  disabledDates = "none",
}: DatePickerProps) {
  // Determine disabled dates
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (disabledDates === "before-today") {
      return date < today
    }
    if (disabledDates === "after-today") {
      return date > today
    }
    return false
  }

  const handleSelect = (date: Date | undefined) => {
    onChange(date || null)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <Popover modal={true}>
      <div className="relative inline-block w-full">
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal pr-10", // Add padding-right to prevent text overlap
              !value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
            aria-label="Clear date"
          >
            ×
          </button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={handleSelect}
          disabled={isDateDisabled}
          initialFocus
          // Highlight today
          today={new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}
