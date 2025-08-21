import { FaqItem } from './faq-item';

export function FaqSection() {
  const faqs = [
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

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            Have questions? We've got answers. If you don't see what you're looking for, feel free
            to contact us.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
