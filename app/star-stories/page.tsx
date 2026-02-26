"use client";

import { useMemo, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { starStories as initialStories, StarStory } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { StarStoryModal } from "@/components/star-stories/StarStoryModal";
import { Card } from "@/components/ui/Card";
import { Plus, Edit2, Grid3x3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { trackPageView } from "@/lib/launchdarkly/tracking";
import { useFlagsReady } from "@/hooks/useFlagsReady";

const categories = ["All", "Enterprise", "Analytics", "AI", "Delivery"] as const;

type ViewMode = "grid" | "list";

export default function StarStoriesPage() {
  // All hooks must be called before any conditional returns
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_STAR_STORIES_PAGE, true);
  const flagsReady = useFlagsReady();
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE, false);
  const ldClient = useLDClient() ?? null;
  const userContext = getOrCreateUserContext();

  // State/hooks must be declared before any early returns to avoid hook-order issues
  const [stories, setStories] = useState<StarStory[]>(initialStories);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StarStory | undefined>();

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesCategory =
        category === "All" ||
        story.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase())) ||
        story.industries.some((industry) =>
          industry.toLowerCase().includes(category.toLowerCase())
        );
      const searchValue = search.toLowerCase();
      const matchesSearch =
        story.title.toLowerCase().includes(searchValue) ||
        story.tags.some((tag) => tag.toLowerCase().includes(searchValue)) ||
        story.industries.some((industry) => industry.toLowerCase().includes(searchValue));
      return matchesCategory && matchesSearch;
    });
  }, [category, search, stories]);

  // Track page view
  useEffect(() => {
    if (flagsReady && canAccess && !isBusinessMode) {
      trackPageView(ldClient, userContext, "star-stories");
    }
  }, [ldClient, userContext, canAccess, flagsReady, isBusinessMode]);

  // Prevent UI flash while flags initialize (and enforce role-based app mode)
  if (!flagsReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-foreground-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Business users should not access Job Seeker pages
  if (isBusinessMode) {
    return notFound();
  }
  
  // Page access check (after all hooks)
  if (!canAccess) {
    return notFound();
  }

  const handleCreate = () => {
    setEditingStory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (story: StarStory) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleSave = (storyData: Omit<StarStory, "id"> & { id?: string }) => {
    if (editingStory) {
      setStories(stories.map((s) => (s.id === editingStory.id ? { ...storyData, id: editingStory.id } as StarStory : s)));
    } else {
      const newStory: StarStory = {
        ...storyData,
        id: `story-${Date.now()}`,
      } as StarStory;
      setStories([...stories, newStory]);
    }
    setIsModalOpen(false);
    setEditingStory(undefined);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Story Bank</p>
          <h1 className="text-3xl font-semibold">STAR Story Builder</h1>
          <p className="text-sm text-foreground-secondary">
            Tag stories by industry, outcome, and theme so you can drop them into prep docs fast.
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Story
        </Button>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-sm border transition-colors",
                cat === category
                  ? "bg-primary text-white border-primary"
                  : "border-border text-foreground-secondary hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by industry, tag, or keyword"
            className="h-10 rounded-xl border border-border bg-background-secondary px-4 text-sm"
          />
          <div className="flex border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-foreground-secondary hover:text-foreground hover:bg-background-tertiary"
              )}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-foreground-secondary hover:text-foreground hover:bg-background-tertiary"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} onEdit={handleEdit} />
          ))}
        </section>
      ) : (
        <section className="space-y-3">
          {filteredStories.map((story) => (
            <StoryListItem key={story.id} story={story} onEdit={handleEdit} />
          ))}
        </section>
      )}

      {filteredStories.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-foreground-secondary">
            {search || category !== "All"
              ? "No stories match your filters"
              : "No STAR stories yet. Create your first one!"}
          </p>
        </Card>
      )}

      <StarStoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStory(undefined);
        }}
        onSave={handleSave}
        story={editingStory}
      />
    </div>
  );
}

function StoryCard({
  story,
  onEdit,
}: {
  story: StarStory;
  onEdit: (story: StarStory) => void;
}) {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-foreground-secondary">
            {story.industries.join(" • ")}
          </p>
          <h3 className="text-lg font-semibold mt-1">{story.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(story)}
          className="ml-2"
        >
          <Edit2 className="w-4 h-4" />
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
          <span
            key={tag}
            className="text-xs bg-background-secondary px-2 py-1 rounded-md border border-border"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const summary = `${story.title}\n\nSituation: ${story.situation}\nTask: ${story.task}\nAction: ${story.action}\nResult: ${story.result}`;
            navigator.clipboard.writeText(summary);
            alert("Story copied to clipboard!");
          }}
        >
          Copy Summary
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`Would launch add-to-job modal for ${story.title}.`)}
        >
          Attach to Job
        </Button>
      </div>
    </Card>
  );
}

function StoryListItem({
  story,
  onEdit,
}: {
  story: StarStory;
  onEdit: (story: StarStory) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">{story.title}</h3>
            <span className="text-xs text-foreground-secondary">
              {story.industries.join(" • ")}
            </span>
          </div>
          <p className="text-sm text-foreground-secondary line-clamp-2">{story.result}</p>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-background-secondary px-2 py-1 rounded-md border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(story)}>
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
