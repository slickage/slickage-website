import { ProjectsHero, ProjectCarousel, ProjectCta } from '@/components/projects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  featuredProjects,
  recentProjects,
  webProjects,
  mobileProjects,
  enterpriseProjects,
} from '@/data/projects';

export const metadata = {
  title: 'Projects | Slickage Portfolio',
  description:
    'Explore our portfolio of innovative software solutions and successful projects delivered by Slickage.',
  openGraph: {
    title: 'Projects | Slickage Portfolio',
    description:
      'Explore our portfolio of innovative software solutions and successful projects delivered by Slickage.',
    url: 'https://slickage.com/projects',
    type: 'website',
    images: [
      {
        url: '/logo-slickage-lines-blue-light.svg',
        width: 1200,
        height: 630,
        alt: 'Slickage Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Slickage Portfolio',
    description:
      'Explore our portfolio of innovative software solutions and successful projects delivered by Slickage.',
    images: ['/logo-slickage-lines-blue-light.svg'],
  },
};

export default function ProjectsPage() {
  return (
    <main className="flex-1">
      <ProjectsHero />

      <section className="py-16 md:py-24">
        <div className="container">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="web">Web</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <ProjectCarousel title="Featured Projects" projects={featuredProjects} />
              <ProjectCarousel title="Recent Projects" projects={recentProjects} />
            </TabsContent>

            <TabsContent value="web" className="mt-0">
              <ProjectCarousel title="Web Projects" projects={webProjects} />
            </TabsContent>

            <TabsContent value="mobile" className="mt-0">
              <ProjectCarousel title="Mobile Projects" projects={mobileProjects} />
            </TabsContent>

            <TabsContent value="enterprise" className="mt-0">
              <ProjectCarousel title="Enterprise Projects" projects={enterpriseProjects} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <ProjectCta />
    </main>
  );
}
