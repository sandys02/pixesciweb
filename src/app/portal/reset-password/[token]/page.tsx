import type { Metadata } from "next"

import { PortalPasswordResetForm } from "@/features/portal/password-reset-form"

export const metadata: Metadata = {
  title: "Reset portal password",
  description: "Set a new PixeSci portal password.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function PortalResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return <PortalPasswordResetForm token={token} />
}
