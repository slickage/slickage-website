import { AboutHero, AboutStory, ValueGrid, TeamGrid, JoinTeamSection } from '@/components/about';

export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutHero />
      <AboutStory />
      <ValueGrid />
      <TeamGrid />
      <JoinTeamSection />
    </main>
  );
}
