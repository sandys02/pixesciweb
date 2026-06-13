import Link from "next/link"

export default function NotFound() {
  return (
    <main className="site-container grid min-h-[65vh] place-items-center py-20 text-center">
      <div className="max-w-xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found.</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          The requested Pixesci marketing page does not exist.
        </p>
        <Link href="/" className="button button-primary mt-8">
          Return home
        </Link>
      </div>
    </main>
  )
}
