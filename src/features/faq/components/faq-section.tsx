import { FaqItem } from './faq-item';
import { FAQ_DATA } from '../data/faq-data';

interface FaqItemData {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs?: FaqItemData[];
  title?: string;
  description?: string;
}

export function FaqSection({ 
  faqs = FAQ_DATA, 
  title = "Frequently Asked Questions",
  description = "Have questions? We've got answers. If you don't see what you're looking for, feel free to contact us."
}: FaqSectionProps) {

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            {description}
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
