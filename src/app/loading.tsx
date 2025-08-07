import { LoadingSpinnerOverlay } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-violet-500/10">
      <div className="relative w-32 h-32">
        <LoadingSpinnerOverlay />
      </div>
    </div>
  );
}
