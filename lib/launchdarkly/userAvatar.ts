import type { UserContext } from "./userContext";

export function getUserAvatarDisplay(user: UserContext | null | undefined): {
  initial: string;
  colorClass: string;
} {
  if (!user) {
    return { initial: "C", colorClass: "bg-slate-600" };
  }

  const initial = user.name.charAt(0).toUpperCase();

  // Avatar colors should be distinct and visible in both light/dark themes.
  // Intentionally avoid white/black and avoid very-light shades (so white initials remain readable).
  let colorClass = "bg-slate-600";

  // Beta overrides tier for demo clarity.
  if (user.role === "beta-tester" || user.betaTester) {
    return { initial, colorClass: "bg-sky-600" };
  }

  switch (user.subscriptionTier) {
    case "free":
      colorClass = "bg-amber-600";
      break;
    case "premium":
      colorClass = "bg-violet-600";
      break;
    case "enterprise":
      colorClass = "bg-teal-600";
      break;
    case "business":
      colorClass = "bg-emerald-600";
      break;
  }

  return { initial, colorClass };
}


