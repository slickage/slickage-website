import type { Insight } from '@/types/insight';

if (!process.env.NEXT_PUBLIC_S3_BUCKET_URL) {
  throw new Error('NEXT_PUBLIC_S3_BUCKET_URL is not defined');
}
const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

export const featuredInsights: Insight[] = [
  {
    id: 'pharmgkb',
    title: 'DDrX: Pharmacogenomic knowledgebase',
    description: 'Building a  mobile interface to pharmacogenomic research data',
    image: '/placeholder.svg',
    tags: ['React', 'Storybook', 'Vite'],
  },
  {
    id: 'epochtalk',
    title: 'Epochtalk Forum Administration',
    description: 'Redesigning a powerful—but unwieldy—admin interface',
    image: S3_BUCKET_URL
      ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Settings.png`
      : '/placeholder.svg',
    tags: ['Elixir', 'Vue', 'Phoenix', 'Ecto'],
  },
  {
    id: 'raisegiving',
    title: 'Raisegiving Checkout Flow Redesign',
    description: 'Streamlining the donor experience for a nonprofit fundraising platform',
    image: S3_BUCKET_URL
      ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Overview.gif`
      : '/placeholder.svg',
    tags: ['Vue', 'Rails'],
  },
  {
    id: 'beam',
    title: 'BEAM Cloud',
    description: 'Redesigning medical image collaboration for radiologists',
    image: '/placeholder.svg',
    tags: [],
  },
];

export async function getInsightById(id: string) {
  return featuredInsights.find((insight) => insight.id === id);
}

export async function getFeaturedInsights() {
  return featuredInsights.slice(0, 7);
}
