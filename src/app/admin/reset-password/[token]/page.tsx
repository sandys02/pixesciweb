import type { Metadata } from "next"

import { AdminPasswordResetForm } from "@/features/admin/components/password-reset-form"

export const metadata: Metadata = {
  title: "Reset staff admin password",
  description: "Set a new PixeSci staff admin password.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return <AdminPasswordResetForm token={token} />
}
