import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Your Template</h1>
        <p className="text-foreground-secondary text-lg">
          This is a modular UI/UX template ready for your next project
        </p>
        <div className="mt-8 space-x-4">
          <Link
            href="/components"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover rounded-lg transition-colors"
          >
            View Components
          </Link>
          <Link
            href="/examples"
            className="inline-block px-6 py-3 bg-background-secondary hover:bg-background-tertiary rounded-lg border border-border transition-colors"
          >
            View Examples
          </Link>
        </div>
      </div>
    </div>
  );
}

