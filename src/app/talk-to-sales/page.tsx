import { permanentRedirect } from "next/navigation"

import { demoBookingUrl } from "@/content/site"

export default function Page() {
  permanentRedirect(demoBookingUrl)
}
