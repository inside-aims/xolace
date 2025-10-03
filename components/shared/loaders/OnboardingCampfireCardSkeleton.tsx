export default function OnboardingCampfireCardSkeleton() {
    return (
      <div className="flex animate-pulse items-start justify-between gap-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <div className="flex flex-1 gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-700" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="h-4 w-32 rounded bg-gray-700" />
            <div className="h-3 w-full rounded bg-gray-700" />
            <div className="h-3 w-20 rounded bg-gray-700" />
          </div>
        </div>
        <div className="h-8 w-16 rounded-full bg-gray-700" />
      </div>
    );
  }