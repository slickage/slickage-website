import type { Insight } from '@/types/insight';

export const featuredInsights: Insight[] = [
  {
    id: 'pharmgkb',
    title: 'DDrX: Pharmacogenomic knowledgebase',
    description: 'Building a  mobile interface to pharmacogenomic research data',
    imageSrc: '/placeholder.svg',
    tags: ['React', 'Storybook', 'Vite'],
  },
  {
    id: 'epochtalk',
    title: 'Epochtalk Forum Administration',
    description: 'Redesigning a powerful—but unwieldy—admin interface',
    imageSrc: 'images/case-studies/epochtalk/Epochtalk-Settings.png',
    tags: ['Elixir', 'Vue', 'Phoenix', 'Ecto'],
  },
  {
    id: 'raisegiving',
    title: 'Raisegiving Checkout Flow Redesign',
    description: 'Streamlining the donor experience for a nonprofit fundraising platform',
    imageSrc: 'images/case-studies/raisegiving/Raisegiving-Overview.gif',
    tags: ['Vue', 'Rails'],
  },
  {
    id: 'beam',
    title: 'BEAM Cloud',
    description: 'Redesigning medical image collaboration for radiologists',
    imageSrc: '/placeholder.svg',
    tags: [],
  },
];

export async function getInsightById(id: string) {
  return featuredInsights.find((insight) => insight.id === id);
}

export async function getFeaturedInsights() {
  return featuredInsights.slice(0, 7);
}
