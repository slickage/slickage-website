import { LoadingSpinnerOverlay } from '@/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-32 h-32">
        <LoadingSpinnerOverlay />
      </div>
    </div>
  );
}
