"use client"

import { Music, Mic2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingMusicIcons } from "@/components/collaborate/floating-music-icons"

export function HeroSection() {
  const scrollToForm = () => {
    document.getElementById("collaboration-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <FloatingMusicIcons variant="hero" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Phase: Beta Testing / Accepting Inquiries
          </div>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
          Write Your Next Song With{" "}
          <span className="text-primary">Rising J.</span>
        </h1>

        <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
          You bring the spark. I&apos;ll bring the studio.
        </p>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I know what it&apos;s like to have a melody in your head but no way to hear it back.
          I&apos;m Rising J, and I&apos;m opening up my creative process to you. Let&apos;s sit down,
          hash out your ideas, and turn them into two professional-grade demos that sound
          like the real deal.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={scrollToForm}
            size="lg"
            className="group gap-2 px-8 py-6 text-lg font-semibold"
          >
            <Mic2 className="h-5 w-5 transition-transform group-hover:scale-110" />
            Request a Session with Rising J
          </Button>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Music className="h-4 w-4" />
            <span>Invite-only collaborations</span>
          </div>
        </div>
      </div>
    </section>
  )
}
