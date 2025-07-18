export type CaseStudyContentItem =
  | { type: 'section'; title: string; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'quote'; quote: string; author: string; role?: string };

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  heroImages: string[];
  overview: string;
  tags: string[];
  quickFacts?: Record<string, string>;
  content: CaseStudyContentItem[];
}
