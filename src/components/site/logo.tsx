// @/components/site/logo.tsx

import Image from "next/image"
import Link from "next/link"

import { tagline as taglineText } from "@/content/site"

import { BrandName } from "./brand-name"

type LogoProps = {
  tagline?: boolean
}

export function Logo({ tagline = true }: LogoProps) {
  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="PixeSci TM home"
    >
      <Image
        src="/pixesci-logo.png"
        alt=""
        width={40}
        height={40}
        className="size-9 rounded-[9px] object-cover shadow-[0_1px_2px_rgb(0_30_90/0.28)]"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[19px] font-semibold tracking-[-0.02em] text-primary">
          <BrandName />
        </span>
        {tagline ? (
          <span className="mt-1.5 whitespace-nowrap text-[7.5px] font-medium tracking-[0.26em] text-muted-foreground uppercase">
            {taglineText}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
