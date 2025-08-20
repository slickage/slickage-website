import TrackedFAQLink from './TrackedFAQLink';

export default function FaqPreview() {
  return (
    <div className="container mx-auto px-4 mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Quick FAQ</h2>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-800/30 hover:border-blue-500/30 transition-colors">
          <h3 className="font-semibold mb-3 text-white">What technologies do you specialize in?</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            We work with modern web frameworks including Elixir/Phoenix, Ruby on Rails,
            React/Next.js, Vue.js, and cloud infrastructure (AWS, Docker, CI/CD). We also have
            expertise in DevOps automation and real-time systems. We select the optimal technology
            stack for each project's requirements.
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-800/30 hover:border-blue-500/30 transition-colors">
          <h3 className="font-semibold mb-3 text-white">Do you work with clients worldwide?</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Absolutely! While we're based in Honolulu, we collaborate with clients globally. We use
            modern tools to ensure seamless communication and delivery regardless of timezone or
            location.
          </p>
        </div>
      </div>
      <div className="text-center mt-6">
        <TrackedFAQLink
          href="#faq"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
        >
          View all frequently asked questions
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </TrackedFAQLink>
      </div>
    </div>
  );
}
