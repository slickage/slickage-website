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
    tags: ['Elixir', 'Vue', 'Phoenix', 'Ecto'],
    quickFacts: {
      Client: 'EpochTalk',
      // Year: '2022',
      'Project Type': 'Community Forum',
    },
    content: [
      {
        type: 'section',
        title: 'Key Objectives',
        content: `   • Improve navigation across top-level and nested admin views \n\n   • Organize information more intuitively to reduce cognitive load \n\n   • Create a more flexible layout system to support future features \n\n   • Maintain full feature parity with the existing toolset`,
      },
      {
        type: 'section',
        title: 'Navigation Overhaul',
        content: `The first step was rethinking how users moved through the admin interface. The original horizontal tab structure was replaced with a vertical sidebar, using compact icons with tooltips to save space and stay accessible as users scrolled. Sub-navigation elements were moved to a clearly defined header area at the top of each view, making it easier to orient within the interface.\n\nTo improve usability, primary actions like “Save” and “Reset” were relocated to a persistent action bar fixed to the bottom of the screen—ensuring they were always within reach, regardless of scroll depth.`,
      },
      {
        type: 'image',
        src: `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Navigation-Overhaul.png`,
        alt: 'EpochTalk Navigation Overhaul',
        // caption: 'Implementation illustration',
      },
      {
        type: 'section',
        title: 'Layout & Structural Improvements',
        content: `A new responsive layout was introduced, based on a two-column grid with a 2:1 width ratio. This allowed less frequently used settings to live in the narrower sidebar, while keeping core content front and center. For data-heavy views like tables, a single-column layout was used to maximize horizontal space.\n\n This layout flexibility not only improved information hierarchy, but also made it easier to accommodate new functionality as the product evolved.`,
      },
      {
        type: 'image',
        src: `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Layout-Boards.png`,
        alt: 'EpochTalk Layout & Structural Improvements Boards',
      },
      {
        type: 'image',
        src: `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Layout-Posts.png`,
        alt: 'EpochTalk Layout & Structural Improvements Posts',
      },
      {
        type: 'section',
        title: 'Refined UI Components',
        content: `The redesign also included a full visual refresh of the admin UI. The interface was simplified by removing unnecessary lines, shading, and background fills. A restrained color palette helped draw attention to active elements and key actions. Panels—used to group related controls—were simplified to increase scanability, with smaller headers and contextual helper text to orient the user.\n\n Form fields were redesigned to include persistent labels, embedded helper text, and contextual secondary actions—all while minimizing vertical space. Active and error states were made more legible without adding clutter, improving form usability across the board.`,
      },
      {
        type: 'image',
        src: `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-UI-Portal.png`,
        alt: 'EpochTalk Refined UI Components Portal',
      },
      {
        type: 'image',
        src: `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-UI-Boards.png`,
        alt: 'EpochTalk Refined UI Components Board',
      },
      {
        type: 'section',
        title: 'Table Enhancements',
        content: `The table UI was cleaned up to support faster scanning and higher information density. Row separators were replaced with whitespace, and filtering/sorting controls were moved to the panel header—freeing up vertical space and aligning with the overall UI structure.`,
      },
      {
        type: 'image',
        src: `https://${process.env.S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Table-Enhancements.png`,
        alt: 'EpochTalk Table Enhancements',
      },
      {
        type: 'section',
        title: 'Outcome & Impact',
        content:
          'The redesign was enthusiastically received by internal teams and stakeholders, who praised the improved clarity, usability, and modern aesthetic. Development began in late 2022, with deployment expected in upcoming releases. Once live, the new admin experience will provide a more intuitive, efficient foundation for managing the Epochtalk platform—one that better supports both current workflows and future growth.',
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
