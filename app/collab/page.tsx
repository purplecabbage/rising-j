
import { HeroSection } from "@/components/collaborate/hero-section"
import { ProcessSection } from "@/components/collaborate/process-section"
import { PartnershipSection } from "@/components/collaborate/partnership-section"
import { FAQSection } from "@/components/collaborate/faq-section"
import { CollaborationForm } from "@/components/collaborate/collaboration-form"

export const metadata = {
  title: "Collaborate | Rising J",
  description: "Write your next song with Rising J. You bring the spark, I'll bring the studio.",
}

export default function CollaboratePage() {
  return (
    <div className="collab-theme min-h-screen bg-background text-foreground">
      <HeroSection />
      <ProcessSection />
      <PartnershipSection />
      <FAQSection />
      <CollaborationForm />
    </div>
  )
}
