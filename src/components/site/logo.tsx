// @/components/site/logo.tsx

import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="PixeSci home"
    >
      <Image
        src="/pixesci-logo.png"
        alt=""
        width={32}
        height={32}
        className="size-10 rounded-md object-cover"
      />
      <span className="text-[15px] font-semibold tracking-[-0.01em]">PixeSci</span>
    </Link>
  )
}
