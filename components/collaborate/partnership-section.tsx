"use client"

import { Handshake, FileMusic, Compass } from "lucide-react"
import { FloatingMusicIcons } from "@/components/collaborate/floating-music-icons"

const benefits = [
  {
    icon: Handshake,
    title: "Shared Vision",
    description: "We split the song's future (publishing) 50/50.",
  },
  {
    icon: FileMusic,
    title: "Your Demos",
    description: "You walk away with two pro-produced versions of our song to keep and share.",
  },
  {
    icon: Compass,
    title: "Creative Guidance",
    description: "I'll be there to help you navigate the \"what next\" of your music journey.",
  },
]

export function PartnershipSection() {
  return (
    <section className="relative bg-secondary/30 px-6 py-20 md:py-28">
      <FloatingMusicIcons variant="partnership" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
          The Partnership
        </h2>
        <p className="mb-16 text-xl text-muted-foreground">
          I&apos;m looking for creative collaborators, not just customers.
        </p>

        <div className="grid gap-8 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center">
              <div className="mb-5 inline-flex rounded-full bg-primary/10 p-4">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
