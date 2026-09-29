"use client"

import { useId, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactDialog({
  open,
  onOpenChange,
  onCloseAutoFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
}) {
  const id = useId()
  const submitting = useRef(false)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setPending(true)
    setError("")
    const fields = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(30_000),
      })
      const result = await response.json()
      if (!response.ok || !result.success)
        throw new Error(
          result.error || "Your message could not be sent. Please try again."
        )
      setSent(true)
    } catch (error) {
      setError(
        error instanceof Error && error.name === "Error"
          ? error.message
          : "Unable to send your message. Please check your connection and try again."
      )
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) {
          onOpenChange(next)
          if (!next) {
            setSent(false)
            setError("")
          }
        }
      }}
    >
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton={!pending}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader className="pr-6">
          <p className="eyebrow mb-2">Let’s talk</p>
          <DialogTitle className="text-2xl">Contact us</DialogTitle>
          <DialogDescription>
            Tell us what you need. Our team will get back to you by email.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="space-y-5 py-4" role="status">
            <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold">Message sent</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Thank you for getting in touch. We’ll reply to the email address
                you provided.
              </p>
            </div>
            <Button
              onClick={() => {
                onOpenChange(false)
                setSent(false)
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4" aria-busy={pending}>
            <fieldset disabled={pending} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>Full name</Label>
                <Input
                  id={`${id}-name`}
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-phone`}>
                  Phone number{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id={`${id}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-organization`}>Organization</Label>
                <Input
                  id={`${id}-organization`}
                  name="organization"
                  autoComplete="organization"
                  required
                  maxLength={200}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-message`}>Message</Label>
                <Textarea
                  id={`${id}-message`}
                  name="message"
                  required
                  maxLength={5000}
                  rows={4}
                  className="min-h-28 resize-y"
                />
              </div>
              <div hidden aria-hidden="true">
                <label htmlFor={`${id}-website`}>Website</label>
                <input
                  id={`${id}-website`}
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
            </fieldset>
            <p className="text-xs leading-5 text-muted-foreground">
              We use your details to respond to your inquiry. Read our{" "}
              <Link
                href="/privacy"
                className="text-primary underline underline-offset-4"
              >
                privacy notice
              </Link>
              .
            </p>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="w-full"
            >
              {pending && (
                <Loader2
                  className="size-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              )}
              {pending ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function ContactButton() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        Contact us
      </button>
      <ContactDialog
        open={open}
        onOpenChange={setOpen}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          triggerRef.current?.focus()
        }}
      />
    </>
  )
}
