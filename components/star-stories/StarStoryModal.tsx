"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StarStory } from "@/lib/mock-data";

interface StarStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (story: Omit<StarStory, "id"> & { id?: string }) => void;
  story?: StarStory;
}

export function StarStoryModal({ isOpen, onClose, onSave, story }: StarStoryModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    metrics: "",
    tags: "",
    industries: "",
  });

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        situation: story.situation,
        task: story.task,
        action: story.action,
        result: story.result,
        metrics: story.metrics,
        tags: story.tags.join(", "),
        industries: story.industries.join(", "),
      });
    } else {
      setFormData({
        title: "",
        situation: "",
        task: "",
        action: "",
        result: "",
        metrics: "",
        tags: "",
        industries: "",
      });
    }
  }, [story, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: story?.id,
      title: formData.title,
      situation: formData.situation,
      task: formData.task,
      action: formData.action,
      result: formData.result,
      metrics: formData.metrics,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      industries: formData.industries.split(",").map((i) => i.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={story ? "Edit STAR Story" : "Create New STAR Story"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Situation</label>
            <textarea
              value={formData.situation}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Task</label>
            <textarea
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Action</label>
          <textarea
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Result</label>
          <textarea
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Metrics / Key Numbers</label>
          <input
            type="text"
            value={formData.metrics}
            onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm"
            placeholder="e.g., 530k upsell, 800k ACV"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm"
              placeholder="Sales, Solutions, Technical"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industries (comma-separated)</label>
            <input
              type="text"
              value={formData.industries}
              onChange={(e) => setFormData({ ...formData, industries: e.target.value })}
              className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm"
              placeholder="Enterprise, Analytics, AI"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {story ? "Update" : "Create"} Story
          </Button>
        </div>
      </form>
    </Modal>
  );
}

