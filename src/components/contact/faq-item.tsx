interface FaqItemProps {
  question: string
  answer: string
}

export default function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{question}</h3>
      <p className="text-gray-500">{answer}</p>
    </div>
  )
}

