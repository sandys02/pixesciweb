import { ceoContact } from "@/content/site"

export function ContactBar() {
  const linkClass =
    "font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none dark:text-icy"

  return (
    <div className="border-b border-border/60 bg-muted/40">
      <div className="site-container flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Reach our CEO at:</span>
        <a href={`mailto:${ceoContact.email}`} className={linkClass}>
          {ceoContact.email}
        </a>
        <span aria-hidden="true" className="size-[3px] rounded-full bg-silver" />
        <a href={ceoContact.phoneHref} className={linkClass}>
          {ceoContact.phone}
        </a>
      </div>
    </div>
  )
}
