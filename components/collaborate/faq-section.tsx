"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FloatingMusicIcons } from "@/components/collaborate/floating-music-icons"

const faqs = [
  {
    question: "What if I've never written a song before?",
    answer:
      "That's exactly why I'm here. We'll start with your story or a feeling, and I'll help you find the rhymes and rhythms to make it sing.",
  },
  {
    question: "Is this AI-written?",
    answer:
      "No. We write the heart of the song—the lyrics and melody—ourselves. I only use AI as a \"robotic session band\" to give us a high-quality recording of what we created.",
  },
]

export function FAQSection() {
  return (
    <section className="relative px-6 py-20 md:py-28">
      <FloatingMusicIcons variant="faq" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
