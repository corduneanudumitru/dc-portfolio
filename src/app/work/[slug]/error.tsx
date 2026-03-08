'use client';

import Link from 'next/link';

export default function ProjectError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-3xl font-serif font-bold text-text mb-4">Something went wrong</h1>
        <p className="text-muted mb-8">There was an error loading this project.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-accent text-bg text-sm font-medium hover:bg-accent/80 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/work"
            className="px-6 py-3 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors"
          >
            Back to Work
          </Link>
        </div>
      </div>
    </div>
  );
}
