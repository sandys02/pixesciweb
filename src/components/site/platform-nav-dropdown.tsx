"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { platformNavigation } from "@/content/site"

export function PlatformNavDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none data-[state=open]:bg-muted data-[state=open]:text-foreground">
        Platform
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-72 p-1.5">
        {platformNavigation.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="py-0">
            <Link
              href={item.href}
              className="flex flex-col items-start gap-0.5 rounded-sm px-2 py-2.5"
            >
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
              {item.description ? (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
