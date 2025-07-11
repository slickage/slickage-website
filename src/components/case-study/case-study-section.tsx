export default function CaseStudySection({ title, content }: { title: string; content: string }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">{title}</h2>
          <p className="text-gray-300 text-lg">{content}</p>
        </div>
      </div>
    </section>
  );
}
