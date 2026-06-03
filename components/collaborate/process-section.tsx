"use client"

import { PenLine, Wand2, Rocket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingMusicIcons } from "@/components/collaborate/floating-music-icons"

const steps = [
  {
    icon: PenLine,
    title: "The Session",
    description:
      "We'll co-write together. Whether you've got a full notebook or just a vibe, I'll help you craft the lyrics, chords, and melody. This is 100% human songwriting—the way it's meant to be.",
  },
  {
    icon: Wand2,
    title: "The Production",
    description:
      "Once our song is solid, I'll head into the AI lab to produce two high-fidelity demos. You'll get two different \"looks\" at your track so you can hear its full potential.",
  },
  {
    icon: Rocket,
    title: "The Future",
    description:
      "These aren't just files; they are your blueprints. When you're ready to take it to the radio, I'll connect you with the human session players and engineers who can re-record it for a commercial release.",
  },
]

export function ProcessSection() {
  return (
    <section className="relative px-6 py-20 md:py-28">
      <FloatingMusicIcons variant="process" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How We&apos;ll Build Your Track
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From spark to studio-ready demo in three collaborative steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="relative overflow-hidden border-border/50 bg-card">
              <div className="absolute right-4 top-4 text-6xl font-bold text-primary/10">
                {index + 1}
              </div>
              <CardContent className="p-8">
                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-3">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
