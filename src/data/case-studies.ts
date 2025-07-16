import type { CaseStudy } from '@/types/case-study';

export const caseStudies: CaseStudy[] = [
  {
    id: 'pharmgkb',
    title: 'PharmGKB Case Study',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    heroImages: ['/placeholder.svg'],
    overview:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet cursus, enim erat dictum urna, nec dictum massa enim nec sem.',
    tags: ['PharmGKB', 'Genomics', 'Research'],
    quickFacts: {
      Client: 'PharmGKB',
      Year: '2023',
      'Project Type': 'Genomics Platform',
    },
    content: [
      {
        type: 'section',
        title: 'Challenge',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.',
      },
      {
        type: 'image',
        src: '/placeholder.svg',
        alt: 'PharmGKB platform screenshot',
        caption: 'Challenge illustration',
      },
      {
        type: 'section',
        title: 'Solution',
        content:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
      },
      {
        type: 'image',
        src: '/placeholder.svg',
        alt: 'PharmGKB solution screenshot',
        caption: 'Solution illustration',
      },
      {
        type: 'quote',
        quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        author: 'Jane Doe',
        role: 'Project Lead, PharmGKB',
      },
      {
        type: 'section',
        title: 'Results',
        content:
          'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
      },
    ],
  },
  {
    id: 'epochtalk',
    title: 'EpochTalk Case Study',
    subtitle: 'Redesigning a powerful—but unwieldy—admin interface',
    heroImages: [
      `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Settings.png`,
      `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Admin-General.png`,
    ],
    overview:
      'Epochtalk is a forum platform known for its feature-rich administration tools, but its original admin UI was beginning to show its age. While functionally complete, the interface was difficult to navigate, visually cluttered, and made it hard for users to quickly locate the controls and information they needed. The goal of this redesign was to modernize the experience—improving clarity, organization, and scalability—without sacrificing the breadth of functionality that power users relied on.',
    tags: ['EpochTalk', 'Forum', 'Community'],
    quickFacts: {
      Client: 'EpochTalk',
      Year: '2022',
      'Project Type': 'Community Forum',
    },
    content: [
      {
        type: 'section',
        title: 'Background',
        content:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
      {
        type: 'image',
        src: `/placeholder.svg`,
        alt: 'EpochTalk forum screenshot',
        caption: 'Background illustration',
      },
      {
        type: 'section',
        title: 'Implementation',
        content:
          'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      {
        type: 'image',
        src: '/placeholder.svg',
        alt: 'EpochTalk implementation screenshot',
        caption: 'Implementation illustration',
      },
      {
        type: 'quote',
        quote:
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        author: 'John Smith',
        role: 'Community Manager, EpochTalk',
      },
      {
        type: 'section',
        title: 'Impact',
        content:
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
      },
    ],
  },
] as const;

export async function getCaseStudyById(id: string) {
  return caseStudies.find((cs) => cs.id === id);
}

export function getAllCaseStudies() {
  return caseStudies;
}
