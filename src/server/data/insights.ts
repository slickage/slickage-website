  import type { NewInsight } from '@/server/db/schema';

  export const featuredInsights: NewInsight[] = [
  {
    slug: 'pharmgkb',
    title: 'DDrX: Pharmacogenomic knowledgebase',
    description: 'Building a  mobile interface to pharmacogenomic research data',
    imageSrc: '/placeholder.svg',
    tags: ['React', 'Storybook', 'Vite'],
  },
  {
    slug: 'epochtalk',
    title: 'Epochtalk Forum Administration',
    description: 'Redesigning a powerful—but unwieldy—admin interface',
    imageSrc: 'images/case-studies/epochtalk/Epochtalk-Settings.png',
    tags: ['Elixir', 'Vue', 'Phoenix', 'Ecto'],
  },
  {
    slug: 'raisegiving',
    title: 'Raisegiving Checkout Flow Redesign',
    description: 'Streamlining the donor experience for a nonprofit fundraising platform',
    imageSrc: 'images/case-studies/raisegiving/Raisegiving-Overview.gif',
    tags: ['Vue', 'Rails'],
  },
  {
    slug: 'beam',
    title: 'BEAM Cloud',
    description: 'Redesigning medical image collaboration for radiologists',
    imageSrc: '/placeholder.svg',
    tags: [],
  },
];

export async function getFeaturedInsights() {
  return featuredInsights;
}
