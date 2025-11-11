export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-foreground-secondary">
          Use this space to outline how to work with the template, explain core concepts,
          and reference architecture decisions. Replace the placeholder sections with your own
          content or embed documentation from another source.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Getting Started</h2>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          Provide quick start instructions, development workflows, and environment configuration
          details that teammates or future projects will need. You can link directly to README
          sections or other internal resources.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Architecture Notes</h2>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          Summarize major architectural decisions, module breakdowns, and responsibilities for each
          layer. Add diagrams, decision records, or links to more detailed docs.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Customization Guide</h2>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          Explain how to extend the template, add new modules, and integrate domain-specific logic.
          Document reusable patterns and conventions so the template scales across projects.
        </p>
      </section>
    </div>
  );
}

