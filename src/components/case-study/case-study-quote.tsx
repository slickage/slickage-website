export default function CaseStudyQuote({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role?: string;
}) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-8 shadow-xl border-l-4 border-blue-500">
          <blockquote className="text-xl text-gray-200 italic mb-4">“{quote}”</blockquote>
          <div className="text-blue-400 font-semibold">{author}</div>
          {role && <div className="text-gray-400 text-sm">{role}</div>}
        </div>
      </div>
    </section>
  );
}
