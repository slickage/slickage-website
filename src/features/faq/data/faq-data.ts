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
    question: 'How do you handle project pricing?',
    answer:
      "We typically work on a fixed-price basis for well-defined projects or time and materials for more complex or evolving projects. We'll discuss the best approach for your specific needs.",
  },
  {
    question: 'What makes your development process different?',
    answer:
      'We follow a structured approach that starts with discovery to understand your vision and pain points, then we identify critical issues, create a detailed plan of action, implement features using agile practices with continuous feedback, and finally launch with extensive testing. This ensures your application is built right the first time and evolves with your needs.',
  },
  {
    question: 'How long has Slickage been in business and what is your experience?',
    answer:
      "Slickage was founded in early 2012 by James Wang and has been growing ever since. We started as a one-man operation focused on iOS development (iOS 4 era!) and expanded to web applications in 2013. Today we're a small but experienced team based in Honolulu, Hawaii, working with clients around the globe. We believe technology has no boundaries and refuse to let our location limit our opportunities.",
  },
];

export const FAQ_PREVIEW_DATA: FaqItem[] = [
  {
    question: 'What technologies do you specialize in?',
    answer:
      "We work with modern web frameworks including Elixir/Phoenix, Ruby on Rails, React/Next.js, Vue.js, and cloud infrastructure (AWS, Docker, CI/CD). We also have expertise in DevOps automation and real-time systems. We select the optimal technology stack for each project's requirements.",
  },
  {
    question: 'Do you work with clients worldwide?',
    answer:
      "Absolutely! While we're based in Honolulu, we collaborate with clients globally. We use modern tools to ensure seamless communication and delivery regardless of timezone or location.",
  },
];
