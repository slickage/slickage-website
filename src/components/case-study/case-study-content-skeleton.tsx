export function CaseStudyContentSkeleton({ contentLength }: { contentLength: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: Math.min(contentLength, 8) }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
