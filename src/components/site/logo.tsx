import Link from "next/link"

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Pixesci home"
    >
      <span className="relative grid size-8 place-items-center rounded-md border border-foreground/15 bg-foreground text-background">
        <span className="absolute h-px w-4 bg-background/70" />
        <span className="absolute h-4 w-px bg-background/70" />
        <span className="size-1.5 rounded-full bg-cyan-300 ring-2 ring-foreground" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.01em]">Pixesci</span>
    </Link>
  )
}
