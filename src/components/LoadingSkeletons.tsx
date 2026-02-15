export const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 w-3/4 bg-surface-muted rounded-xl" />
    <div className="h-4 w-1/2 bg-surface-muted rounded-lg" />
    <div className="space-y-3 mt-6">
      <div className="h-20 bg-surface-muted rounded-2xl" />
      <div className="h-20 bg-surface-muted rounded-2xl" />
      <div className="h-20 bg-surface-muted rounded-2xl" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="card-elevated rounded-2xl p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 w-1/3 bg-surface-muted rounded-lg" />
      <div className="h-4 w-2/3 bg-surface-muted rounded-lg" />
      <div className="h-4 w-1/2 bg-surface-muted rounded-lg" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="mx-auto max-w-5xl space-y-8">
    <div className="animate-pulse">
      <div className="h-10 w-1/3 bg-surface-muted rounded-xl mb-2" />
      <div className="h-4 w-1/4 bg-surface-muted rounded-lg" />
    </div>
    
    <div className="grid gap-4 md:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    
    <div className="grid gap-4 md:grid-cols-2">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

export const ChatSkeleton = () => (
  <div className="mx-auto max-w-3xl space-y-4">
    <div className="animate-pulse">
      <div className="h-8 w-1/4 bg-surface-muted rounded-xl mb-2" />
      <div className="h-4 w-1/3 bg-surface-muted rounded-lg" />
    </div>
    
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`h-16 ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'} bg-surface-muted rounded-2xl animate-pulse`} />
        </div>
      ))}
    </div>
  </div>
);

export const AnalyticsSkeleton = () => (
  <div className="mx-auto max-w-4xl space-y-8">
    <div className="animate-pulse">
      <div className="h-10 w-1/4 bg-surface-muted rounded-xl mb-2" />
      <div className="h-4 w-1/3 bg-surface-muted rounded-lg" />
    </div>
    
    <div className="grid gap-4 sm:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    
    <CardSkeleton />
    <CardSkeleton />
  </div>
);
