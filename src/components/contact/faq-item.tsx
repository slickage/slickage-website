import { memo } from 'react';

const FaqItem = memo(function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-white">{question}</h3>
      <p className="text-gray-400">{answer}</p>
    </div>
  );
});

export { FaqItem };
