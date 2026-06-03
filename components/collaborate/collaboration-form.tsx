"use client"

import { useState } from "react"
import { Shield, Send, Music } from "lucide-react"
import { FloatingMusicIcons } from "@/components/collaborate/floating-music-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

export function CollaborationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      spark: formData.get("spark") as string,
      sonic_blueprint: formData.get("sonic-blueprint") as string,
      head_start: formData.get("head-start") as string,
      goal: formData.get("goal") as string,
      value: formData.get("value") as string,
    }

    try {
      const response = await fetch("/api/collab/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      setSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="collaboration-form" className="relative bg-secondary/30 px-6 py-20 md:py-28">
        <FloatingMusicIcons variant="form" />
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex rounded-full bg-primary/10 p-4">
            <Music className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Thanks for reaching out!
          </h2>
          <p className="text-lg text-muted-foreground">
            I&apos;ve received your submission and will be in touch soon to discuss
            bringing your song to life. Keep that creative spark alive!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="collaboration-form" className="relative bg-secondary/30 px-6 py-20 md:py-28">
      <FloatingMusicIcons variant="form" />
      <div className="relative mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Let&apos;s Get in the Room Together
          </h2>
          <p className="text-lg text-muted-foreground">
            The &ldquo;Rising J&rdquo; Collaboration Survey
          </p>
        </div>

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Tell me about your song</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Your Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="What should I call you?"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Where can I reach you?"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="spark">The Spark</FieldLabel>
                  <Textarea
                    id="spark"
                    name="spark"
                    placeholder="In 2-3 sentences, what is the 'heart' of the song you want to write? (Is it a tribute to someone, a breakup anthem, a specific vibe or story?)"
                    rows={3}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="sonic-blueprint">The Sonic Blueprint</FieldLabel>
                  <Textarea
                    id="sonic-blueprint"
                    name="sonic-blueprint"
                    placeholder="What are 2-3 artists or songs that capture the sound you're hearing in your head? (e.g., 'Lainey Wilson meets 80s Synthpop')"
                    rows={2}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="head-start">The Head Start</FieldLabel>
                  <Textarea
                    id="head-start"
                    name="head-start"
                    placeholder="Do you have any lyrics, voice memos, or rough chords already? Feel free to paste them here—I'd love to see where you're starting from."
                    rows={3}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="goal">The Goal</FieldLabel>
                  <Textarea
                    id="goal"
                    name="goal"
                    placeholder="What is your dream for this song? (e.g., 'Just for fun,' 'To pitch to a label,' 'To release on Spotify with a real band later')"
                    rows={2}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="value">The Value</FieldLabel>
                  <Textarea
                    id="value"
                    name="value"
                    placeholder="Since I'm still shaping this service, what would feel like a 'no-brainer' price for a session that results in a finished song and two pro demos?"
                    rows={2}
                  />
                </Field>
              </FieldGroup>

              {error && (
                <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 font-semibold text-foreground">
                      Your Music is Safe Here
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      I&apos;m an artist first, and I respect the craft. Any lyrics, recordings,
                      or ideas you share here remain 100% your intellectual property. I will
                      not use, share, or develop your ideas without a signed, mutual agreement
                      in place. This is currently an invite-only &ldquo;feeler&rdquo; phase—submitting
                      this form is a request for a conversation, not a binding contract.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-8 w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="h-5 w-5" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send My Song Idea
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
