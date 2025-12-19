"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarEvent = {
  date: string; // ISO yyyy-mm-dd preferred
  label: string;
  href?: string;
};

export function DashboardCalendarCard({
  title = "Calendar",
  events = [],
}: {
  title?: string;
  events?: CalendarEvent[];
}) {
  const [cursorMonth, setCursorMonth] = useState(() => startOfMonth(new Date()));

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(cursorMonth);
  }, [cursorMonth]);

  const grid = useMemo(() => buildMonthGrid(cursorMonth), [cursorMonth]);
  const todayKey = toISODateKey(new Date());
  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  const upcoming = useMemo(() => {
    const now = new Date();
    const sorted = [...events]
      .map((e) => ({ ...e, _date: parseISO(e.date) }))
      .filter((e) => e._date && !Number.isNaN(e._date.getTime()))
      .sort((a, b) => a._date!.getTime() - b._date!.getTime())
      .filter((e) => e._date!.getTime() >= startOfDay(now).getTime())
      .slice(0, 4);
    return sorted;
  }, [events]);

  return (
    <Card className="rounded-2xl border-border bg-background-tertiary p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-foreground-secondary">{monthLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCursorMonth((m) => addMonths(m, -1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCursorMonth((m) => addMonths(m, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs text-foreground-muted">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="px-2 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell) => {
            const key = cell.isoKey;
            const isToday = key === todayKey;
            const isOutside = !cell.inMonth;
            const count = eventsByDay.get(key)?.length ?? 0;
            return (
              <div
                key={key}
                className={cn(
                  "relative h-10 rounded-lg border border-border-subtle bg-background-secondary/60 px-2 py-1",
                  isOutside && "opacity-50",
                  isToday && "border-primary/40 bg-primary/10"
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn("text-xs", isToday ? "text-primary font-semibold" : "text-foreground-secondary")}>
                    {cell.day}
                  </span>
                  {count > 0 && (
                    <span className="flex items-center gap-1" aria-label={`${count} events`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {upcoming.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-foreground-secondary mb-2">Upcoming</p>
            <div className="space-y-2">
              {upcoming.map((e) => {
                const label = formatShort(e._date!);
                const content = (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-foreground-muted w-20">{label}</span>
                    <span className="text-foreground-secondary truncate">{e.label}</span>
                  </div>
                );
                return e.href ? (
                  <Link key={`${e.date}-${e.label}`} href={e.href} className="block hover:opacity-90 transition-opacity">
                    {content}
                  </Link>
                ) : (
                  <div key={`${e.date}-${e.label}`}>{content}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function buildMonthGrid(monthStart: Date) {
  const first = startOfMonth(monthStart);
  const last = endOfMonth(monthStart);
  const start = startOfWeekMonday(first);
  const end = endOfWeekSunday(last);

  const cells: { day: number; isoKey: string; inMonth: boolean }[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    cells.push({
      day: cursor.getDate(),
      isoKey: toISODateKey(cursor),
      inMonth: cursor.getMonth() === monthStart.getMonth(),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

function groupEventsByDay(events: CalendarEvent[]) {
  const m = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const d = parseISO(e.date);
    if (!d || Number.isNaN(d.getTime())) continue;
    const key = toISODateKey(d);
    const list = m.get(key) ?? [];
    list.push(e);
    m.set(key, list);
  }
  return m;
}

function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfMonth(d: Date) {
  const x = startOfMonth(d);
  x.setMonth(x.getMonth() + 1);
  x.setDate(0);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeekMonday(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 Sun .. 6 Sat
  const diffToMonday = (day + 6) % 7;
  x.setDate(x.getDate() - diffToMonday);
  return x;
}

function endOfWeekSunday(d: Date) {
  const x = startOfWeekMonday(d);
  x.setDate(x.getDate() + 6);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addMonths(d: Date, delta: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + delta);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toISODateKey(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseISO(s: string) {
  // Expect yyyy-mm-dd; tolerate full ISO timestamps too.
  const d = new Date(s);
  return d;
}

function formatShort(d: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}




