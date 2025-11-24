"use client";

import { generalDocs, starStories } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const interviewQuestions = [
  "Tell me about a complex technical challenge you solved for a customer and how you approached it.",
  "Walk me through a time you uncovered the real problem behind a vague customer request.",
  "Describe a time you translated a very technical concept to a business audience.",
  "Tell me about a situation where two teams shipped conflicting changes and you helped resolve it.",
  "Give an example of a project where you partnered closely with product or engineering to influence the roadmap.",
  "Describe a time when an implementation or POC was going off track and you got it back under control.",
  "Walk me through how you run a discovery call with a technical buyer. What do you prioritize?",
  "Tell me about a time you had to push back on a feature request without losing trust.",
  "Give me an example of how you have used data to influence a technical decision.",
  "Describe a time you managed a customer who was not happy with performance or reliability.",
];

const questionsForThem = [
  "What does strong discovery look like on your team?",
  "Where do contributors most influence strategy?",
  "What defines a successful ninety day ramp?",
  "How do cross-functional teams partner here?",
  "How technical do implementations or PoCs usually get?",
];

export default function PrepPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Preparation</p>
        <h1 className="text-3xl font-semibold">Master Prep Library</h1>
        <p className="text-sm text-foreground-secondary">
          Personal narrative, strengths, question banks, and reusable STAR stories to plug into any
          company workspace.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {generalDocs.map((doc) => (
          <Card key={doc.id} className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-foreground-secondary">Prep doc</p>
              <h3 className="text-xl font-semibold">{doc.title}</h3>
              <p className="text-sm text-foreground-secondary">{doc.summary}</p>
            </div>
            <p className="text-sm text-foreground">{doc.content}</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground-secondary">
              {doc.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full bg-background-tertiary">
                  {tag}
                </span>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert("Rich text editor placeholder")}
              className="w-full justify-start"
            >
              Edit content
            </Button>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Interview question bank</h2>
              <p className="text-sm text-foreground-secondary">Rotate through prompts during prep.</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => alert("Shuffle placeholder")}>
              Shuffle
            </Button>
          </header>
          <ul className="space-y-3">
            {interviewQuestions.map((question) => (
              <li
                key={question}
                className="rounded-xl border border-border-subtle bg-background-elevated/40 p-3 text-sm"
              >
                {question}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Questions I’ll ask them</h2>
          <p className="text-sm text-foreground-secondary">
            Keep discovery focused on how teams operate and where you can drive impact.
          </p>
          <ul className="space-y-3">
            {questionsForThem.map((question) => (
              <li key={question} className="text-sm">
                • {question}
              </li>
            ))}
          </ul>
          <Button variant="outline" onClick={() => alert("Add question placeholder")}>
            Add question
          </Button>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">STAR story shelf</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert("Create story placeholder")}
          >
            New story
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {starStories.map((story) => (
            <Card key={story.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground-secondary">
                    {story.industries.join(" • ")}
                  </p>
                  <h3 className="text-lg font-semibold">{story.title}</h3>
                </div>
                <Button size="sm" variant="ghost" onClick={() => alert("Send to job prep placeholder")}>
                  Send to job
                </Button>
              </div>
              <p className="text-xs text-foreground-secondary">{story.metrics}</p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Situation:</strong> {story.situation}
                </p>
                <p>
                  <strong>Task:</strong> {story.task}
                </p>
                <p>
                  <strong>Action:</strong> {story.action}
                </p>
                <p>
                  <strong>Result:</strong> {story.result}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span key={`${story.id}-${tag}`} className="text-xs px-2 py-1 rounded-full bg-background-tertiary">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

