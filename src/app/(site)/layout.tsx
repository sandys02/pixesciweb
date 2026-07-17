import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import { PortalSignInRedirect } from "@/components/site/portal-sign-in-redirect"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SiteHeader />
      <div id="main-content">{children}</div>
      <SiteFooter />
      <PortalSignInRedirect />
    </>
  )
}
