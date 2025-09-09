interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'What is your typical process for a new project?',
    answer:
      'Our process typically includes discovery, planning, design, development, testing, and deployment phases. We work closely with clients throughout to ensure the final product meets their needs.',
  },
  {
    question: 'How long does it take to complete a project?',
    answer:
      "Project timelines vary depending on complexity and scope. A simple website might take 4-6 weeks, while a complex application could take several months. We'll provide a detailed timeline during the planning phase.",
  },
  {
    question: 'Do you provide ongoing support after launch?',
    answer:
      'Yes, we offer various support and maintenance packages to keep your application running smoothly after launch. We can also implement updates and new features as needed.',
  },
  {
    question: 'What technologies do you specialize in?',
    answer:
      'We work with modern web frameworks including Elixir/Phoenix, Ruby on Rails, React/Next.js, Vue.js, and Node.js. Our expertise covers multiple languages (Elixir, Ruby, JavaScript/TypeScript, Python), cloud infrastructure (AWS, Docker, Kubernetes), and CI/CD automation (GitHub Actions). We select the optimal technology stack for each project based on requirements and long-term maintainability.',
  },
  {
    question: 'How do you handle project pricing?',
    answer:
      "We typically work on a fixed-price basis for well-defined projects or time and materials for more complex or evolving projects. We'll discuss the best approach for your specific needs.",
  },
  {
    question: 'Can you work with clients outside of Hawaii?',
    answer:
      "While we're based in Honolulu, we work with clients worldwide. We use various collaboration tools to ensure smooth communication regardless of location.",
  },
];

export const FAQ_PREVIEW_DATA: FaqItem[] = [
  {
    question: 'What technologies do you specialize in?',
    answer:
      'We work with modern web frameworks including Elixir/Phoenix, Ruby on Rails, React/Next.js, Vue.js, and cloud infrastructure (AWS, Docker, CI/CD). We also have expertise in DevOps automation and real-time systems. We select the optimal technology stack for each project\'s requirements.',
  },
  {
    question: 'Do you work with clients worldwide?',
    answer:
      'Absolutely! While we\'re based in Honolulu, we collaborate with clients globally. We use modern tools to ensure seamless communication and delivery regardless of timezone or location.',
  },
];
