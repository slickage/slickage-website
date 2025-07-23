import type { CaseStudy } from '@/types/case-study';

const S3_BUCKET_URL = process.env.S3_BUCKET_URL;

export const caseStudies: CaseStudy[] = [
  {
    id: 'beam',
    title: 'BEAM Cloud',
    subtitle: 'Redesigning medical image collaboration for radiologists',
    heroImage: '/placeholder.svg',
    overview: `BEAM was originally developed to address a persistent operational challenge in healthcare: the manual, time-intensive process of transferring large medical imaging studies—such as MRIs and CT scans—between facilities. Through a secure point-to-point hardware network, BEAM enabled imaging librarians to move studies digitally, eliminating the need to burn and mail physical DVDs.

    However, while the system improved workflows for imaging staff, it was not optimized for physicians—particularly radiologists—who needed to view and share studies for consultations. Recognizing this opportunity, BEAM’s leadership engaged our team to design and build BEAM Cloud: a modern, cloud-based application specifically tailored to the needs of medical professionals.

    Our goal was to create an intuitive, doctor-friendly platform for viewing, organizing, and securely sharing imaging studies—while integrating with BEAM’s existing infrastructure.
`,
    tags: [],
    quickFacts: {},
    content: [
      {
        type: 'section',
        title: 'Discovery & Strategy',
        content: `We began by conducting user research to better understand radiologists’ workflows. Through interviews and process mapping, we identified two primary use cases: reviewing studies at the request of a hospital, and initiating a consultation with another specialist. In both scenarios, the process was heavily manual—typically involving DVDs, follow-up calls, and separate DICOM viewers.

Simultaneously, we evaluated the existing BEAM system. While it enabled bulk transfers between hospitals equipped with BEAM hardware, it lacked the ability to support external consultations. Its APIs were also inconsistent, slow to respond, and poorly suited for building modern, interactive applications.

These findings shaped the product strategy:

  • Enable physicians to receive, view, and manage imaging studies directly

  • Facilitate secure sharing with external collaborators

  • Normalize and improve performance of the legacy API layer without requiring a full backend rebuild`,
      },
      {
        type: 'section',
        title: 'Design Approach',
        content: `We began by identifying the primary components needed for the physician interface—study lists, study details, and a DICOM image viewer—and explored layouts that balanced power with ease of use.

We adopted a familiar three-panel layout, inspired by email clients, to help physicians quickly browse, review, and act on studies. This interface allowed users to bookmark, share, request, and archive studies with minimal effort. We also designed key workflows around importing, requesting, and securely sharing studies—ensuring a seamless experience from start to finish.

Interactive prototypes were reviewed with stakeholders, including radiologists, engineering leads, and business leaders. The proposed interface was well-received and aligned with the product’s goals: practical, approachable, and well-suited to real-world clinical use.`,
      },
      {
        type: 'section',
        title: 'Engineering Approach',
        content: `Given the limitations of the existing backend, a full rewrite was out of scope. Instead, we introduced a normalization layer between the legacy system and the new application. This abstraction handled API inconsistencies and returned data in a clean, consistent format to the frontend.

To further improve responsiveness, we built a job queueing system that performed long-running tasks asynchronously. This allowed physicians to continue navigating the app while background processes—such as fetching large studies—ran in parallel.

These architectural improvements:
  • Enhanced performance and responsiveness
  • Simplified frontend development
  • Reduced coupling to legacy backend systems
  • Provided a scalable foundation for future system upgrades`,
      },
      {
        type: 'section',
        title: 'Outcomes and Impact',
        content: `BEAM Cloud was successfully launched and adopted as part of BEAM’s product offering. While detailed usage metrics remain confidential due to privacy constraints, feedback from leadership and the sales team indicated that the platform significantly enhanced product appeal, improved radiologist engagement, and supported new sales opportunities.

BEAM Cloud was successfully deployed to many hospitals and imaging centers in the US, and across the entire healthcare system of Ireland.

The success of BEAM Cloud also influenced the company’s broader product roadmap, including the redesign of its core image librarian interface—further extending the impact of this initiative across the BEAM ecosystem.
`,
      },
    ],
  },
  {
    id: 'epochtalk',
    title: 'Epochtalk Forum Administration',
    subtitle: 'Redesigning a powerful—but unwieldy—admin interface',
    heroImage: `${
      S3_BUCKET_URL
        ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Settings.png`
        : '/placeholder.svg'
    }`,
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
        content: `  • Improve navigation across top-level and nested admin views

  • Organize information more intuitively to reduce cognitive load

  • Create a more flexible layout system to support future features

  • Maintain full feature parity with the existing toolset`,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Settings.png`
          : '/placeholder.svg',
        alt: 'EpochTalk Navigation Overhaul',
        // caption: 'Implementation illustration',
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Admin-General.png`
          : '/placeholder.svg',
        alt: 'EpochTalk Navigation Overhaul',
        // caption: 'Implementation illustration',
      },
      {
        type: 'section',
        title: 'Navigation Overhaul',
        content: `The first step was rethinking how users moved through the admin interface. The original horizontal tab structure was replaced with a vertical sidebar, using compact icons with tooltips to save space and stay accessible as users scrolled. Sub-navigation elements were moved to a clearly defined header area at the top of each view, making it easier to orient within the interface.

To improve usability, primary actions like “Save” and “Reset” were relocated to a persistent action bar fixed to the bottom of the screen—ensuring they were always within reach, regardless of scroll depth.`,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Navigation-Overhaul.png`
          : '/placeholder.svg',
        alt: 'EpochTalk Navigation Overhaul',
        // caption: 'Implementation illustration',
      },
      {
        type: 'section',
        title: 'Layout & Structural Improvements',
        content: `A new responsive layout was introduced, based on a two-column grid with a 2:1 width ratio. This allowed less frequently used settings to live in the narrower sidebar, while keeping core content front and center. For data-heavy views like tables, a single-column layout was used to maximize horizontal space.

This layout flexibility not only improved information hierarchy, but also made it easier to accommodate new functionality as the product evolved.`,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Layout-Boards.png`
          : '/placeholder.svg',
        alt: 'EpochTalk Layout & Structural Improvements Boards',
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Layout-Posts.png`
          : '/placeholder.svg',
        alt: 'EpochTalk Layout & Structural Improvements Posts',
      },
      {
        type: 'section',
        title: 'Refined UI Components',
        content: `The redesign also included a full visual refresh of the admin UI. The interface was simplified by removing unnecessary lines, shading, and background fills. A restrained color palette helped draw attention to active elements and key actions. Panels—used to group related controls—were simplified to increase scanability, with smaller headers and contextual helper text to orient the user.

Form fields were redesigned to include persistent labels, embedded helper text, and contextual secondary actions—all while minimizing vertical space. Active and error states were made more legible without adding clutter, improving form usability across the board.`,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-UI-Portal.png`
          : '/placeholder.svg',
        alt: 'EpochTalk Refined UI Components Portal',
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-UI-Boards.png`
          : '/placeholder.svg',
        alt: 'EpochTalk Refined UI Components Board',
      },
      {
        type: 'section',
        title: 'Table Enhancements',
        content: `The table UI was cleaned up to support faster scanning and higher information density. Row separators were replaced with whitespace, and filtering/sorting controls were moved to the panel header—freeing up vertical space and aligning with the overall UI structure.`,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/epochtalk/Epochtalk-Table-Enhancements.png`
          : '/placeholder.svg',
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
  {
    id: 'pharmgkb',
    title: 'DDrX: Pharmacogenomic knowledgebase',
    subtitle: 'Building a  mobile interface to pharmacogenomic research data',
    heroImage: '/placeholder.svg',
    overview:
      'The PharmGKB group at Stanford University is curating knowledge of how genetic variations affect how our bodies respond to medications.',
    tags: ['React', 'Storybook', 'Vite'],
    quickFacts: {
      Client: 'PharmGKB',
      Year: '2023',
      'Project Type': 'Genomics Platform',
    },
    content: [
      {
        type: 'section',
        title: 'Overview',
        content: `Existing desktop app tailored for researchers
  • Comprehensive and data-dense
    • Presents a lot of data, all at once

Building a mobile web app for clinicians to access reference information about drug recommendations based on genetic profile.

Streamline selection of genotypes

Present drug search results on mobile
  • Table → cards

Present drug details on mobile

Enter genetic profile information.
View detailed drug recommendations specific to the selected genetic profile
Filter drug sources (CPIC, DPWG, FDA)
`,
      },
    ],
  },
  {
    id: 'raisegiving',
    title: 'Raisegiving Checkout Flow Redesign',
    subtitle: 'Streamlining the donor experience for a nonprofit fundraising platform',
    heroImage: `${
      S3_BUCKET_URL
        ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Overview.gif`
        : '/placeholder.svg'
    }`,
    overview:
      'Raisegiving was a startup building a platform for nonprofit fundraising. They brought in Slickage to provide engineering and product design leadership, with the immediate goal of reducing technical debt and improving the end-user experience. After a comprehensive UX audit, it became clear that the checkout process was a major point of friction—over 60% of donors were abandoning the flow before completing their donation.',
    tags: ['Vue', 'Rails'],
    quickFacts: {
      Client: 'Raisegiving',
      Year: '2022',
      'Project Type': 'Donation Platform',
    },
    content: [
      {
        type: 'section',
        title: 'Identifying the problem',
        content: `Working closely with the CEO, Head of Customer Success, and engineering team, we identified the Campaign and Checkout pages as the most critical to redesign. User feedback and analytics showed that the checkout form was overwhelming: all options were presented at once in a single, lengthy page with little guidance.

The existing checkout was dense: a single long page with all options exposed by default—payment methods, recurring schedules, donation plans, team selections, dedication messages, and more. It was too much too soon, and people didn’t know where to start.

We confirmed the issue through interviews with the Head of Customer Success, user feedback, and a deeper look into analytics. Most donors weren’t confused about why to donate—they were just struggling with how.`,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Wireframe.png`
          : '/placeholder.svg',
        alt: 'Raisegiving Wireframe',
      },
      {
        type: 'section',
        title: 'Our Approach',
        content: `We started by mapping the full donation flow. This helped us untangle the sprawl of actions and decision points, and gave us a clear view of what needed to change. From there, we narrowed in on two big opportunities:
  • Reduce friction by simplifying and sequencing the flow
  • Optimize for mobile first, since the majority of donors were on mobile devices`,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Wireframe.png`
          : '/placeholder.svg',
        alt: 'Raisegiving Wireframe',
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Mockups.png`
          : '/placeholder.svg',
        alt: 'Raisegiving Mockups',
      },
      {
        type: 'section',
        title: '',
        content: `Rather than cramming everything into one screen, we broke the process into a step-by-step flow—each screen focused on a single, small decision. We used progressive disclosure to only show options when relevant (e.g. scheduling options only appear if recurring is selected). And we leaned into mobile-first design, knowing that a good mobile experience would scale up better than the other way around.`,
      },
      {
        type: 'section',
        title: 'What we redesigned',
        content: ``,
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Donation-Mobile.gif`
          : '/placeholder.svg',
        alt: 'Raisegiving Mockups',
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Donation-Plans-Mobile.gif`
          : '/placeholder.svg',
        alt: 'Raisegiving Mockups',
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Payment-Options.png`
          : '/placeholder.svg',
        alt: 'Raisegiving Mockups',
      },
      {
        type: 'image',
        src: S3_BUCKET_URL
          ? `https://${S3_BUCKET_URL}/images/case-studies/raisegiving/Raisegiving-Donor-Info.png`
          : '/placeholder.svg',
        alt: 'Raisegiving Mockups',
      },
      {
        type: 'section',
        title: '',
        content: `• Campaign summary up top: Shows campaign details and progress to keep donors connected to the cause.

• Donation type selection: One-time vs. Recurring with dynamic fields that only appear when needed.

• Donation plans: Optional swipeable cards for organizations that offer predefined giving tiers.

• Payment methods: Clean, accessible UI for adding new cards or selecting saved profiles for returning users.

• Donation summary: Recaps details, catches errors, and makes it easy to jump back and fix anything.

• Celebratory confirmation: A fun, lightweight animation created using Figma + After Effects + Lottie.

• Follow-up emails: Confirmation email includes campaign sharing and account creation. If donors abandon midway, we send a gentle reminder to come back and complete the donation.`,
      },
      {
        type: 'section',
        title: 'Results & Impact',
        content: `We ran several review rounds with internal stakeholders and previewed the redesign with a handful of trusted customers. The feedback was clear: this version was dramatically easier to use and better aligned with how people actually give.

Unfortunately, the company ran out of funding before the new flow could go live, so we didn’t get a chance to collect post-launch metrics. But the project served as a great example of how thoughtful UX, clean information architecture, and a mobile-first mindset can turn a frustrating experience into a seamless one.`,
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
