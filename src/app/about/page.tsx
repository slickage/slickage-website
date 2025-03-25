import type React from "react"
import AboutHero from "@/components/about/about-hero"
import AboutStory from "@/components/about/about-story"
import ValueGrid from "@/components/about/value-grid"
import TeamGrid from "@/components/about/team-grid"
import JoinTeamSection from "@/components/about/join-team-section"

export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutHero />
      <AboutStory />
      <ValueGrid />
      <TeamGrid />
      <JoinTeamSection />
    </main>
  )
}
