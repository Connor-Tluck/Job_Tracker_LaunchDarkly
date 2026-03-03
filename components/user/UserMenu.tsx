"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { LogOut, RefreshCw, Users, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDemoUsers,
  setUserContext,
  clearUserContext,
  type UserContext,
} from "@/lib/launchdarkly/userContext";
import { getUserAvatarDisplay } from "@/lib/launchdarkly/userAvatar";
import { createMultiContext, createAnonymousContext } from "@/lib/launchdarkly/multiContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type UserMenuVariant = "icon" | "pill";

export function UserMenu({
  align = "right",
  variant = "icon",
  className,
}: {
  align?: "left" | "right";
  variant?: UserMenuVariant;
  className?: string;
}) {
  const router = useRouter();
  const ldClient = useLDClient();

  const [currentUser, setCurrentUserState] = useState<UserContext | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const isInternalUpdateRef = useRef(false);

  const ANONYMOUS_KEY = '__anonymous__';
  const demoUsers = useMemo(() => getDemoUsers(), []);

  const loadUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('ld-user-context');
    if (!stored) {
      setCurrentUserState(null);
      setIsAnonymous(true);
      return;
    }
    try {
      const user = JSON.parse(stored) as UserContext;
      setCurrentUserState(user);
      setIsAnonymous(false);
    } catch {
      setCurrentUserState(null);
      setIsAnonymous(true);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const handleUserContextChange = () => {
      if (isInternalUpdateRef.current) {
        isInternalUpdateRef.current = false;
        return;
      }
      setTimeout(() => {
        loadUser();
      }, 0);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ld-user-context") {
        loadUser();
      }
    };

    window.addEventListener("ld-user-context-changed", handleUserContextChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("ld-user-context-changed", handleUserContextChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadUser]);

  const switchUser = useCallback(
    async (user: UserContext) => {
      if (isSwitching) return;
      if (!isAnonymous && currentUser?.key === user.key) return;

      setIsSwitching(true);

      setUserContext(user);
      setCurrentUserState({ ...user });
      setIsAnonymous(false);
      isInternalUpdateRef.current = true;

      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent("ld-user-context-changed"));
      });

      if (ldClient) {
        try {
          const ldContext = createMultiContext({
            user: {
              key: user.key,
              name: user.name,
              email: user.email,
              role: user.role,
              subscriptionTier: user.subscriptionTier,
              industry: user.industry,
              companySize: user.companySize,
              signupDate: user.signupDate,
              betaTester: user.betaTester,
            },
            device: {
              key: `dvc-${user.key}`,
              os: navigator.platform || 'unknown',
              type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
              version: '1.0.0',
            },
            organization: user.industry ? {
              key: `org-${user.key}`,
              name: user.industry,
              region: Intl.DateTimeFormat().resolvedOptions().timeZone?.startsWith('America') ? 'NA' : 'OTHER',
            } : undefined,
          });
          await ldClient.identify(ldContext);
        } catch {
          // local context is already updated
        }
      }

      setIsSwitching(false);
    },
    [currentUser?.key, isAnonymous, isSwitching, ldClient]
  );

  const onOpenChangeUser = () => {
    setPendingKey(isAnonymous ? ANONYMOUS_KEY : (currentUser?.key ?? ANONYMOUS_KEY));
    setModalOpen(true);
  };

  const onConfirmChangeUser = async () => {
    if (!pendingKey) return;

    if (pendingKey === ANONYMOUS_KEY) {
      await onLogout();
      setModalOpen(false);
      return;
    }

    const next = demoUsers.find((u) => u.key === pendingKey);
    if (!next) return;

    await switchUser(next);
    setModalOpen(false);
  };

  const onLogout = async () => {
    if (isSwitching) return;
    setIsSwitching(true);

    clearUserContext();
    setCurrentUserState(null);
    setIsAnonymous(true);
    isInternalUpdateRef.current = true;

    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("ld-user-context-changed"));
    });

    if (ldClient) {
      try {
        await ldClient.identify(createAnonymousContext());
      } catch {
        // ignore
      }
    }

    setIsSwitching(false);
  };

  const regenerateKey = useCallback(async () => {
    if (isSwitching || isAnonymous || !currentUser) return;

    setIsSwitching(true);

    const newKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as Crypto).randomUUID()
        : `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const updated: UserContext = { ...currentUser, key: newKey };

    setUserContext(updated);
    setCurrentUserState({ ...updated });
    isInternalUpdateRef.current = true;
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("ld-user-context-changed"));
    });

    if (ldClient) {
      try {
        const ldContext = createMultiContext({
          user: {
            key: updated.key,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            subscriptionTier: updated.subscriptionTier,
            industry: updated.industry,
            companySize: updated.companySize,
            signupDate: updated.signupDate,
            betaTester: updated.betaTester,
          },
          device: {
            key: `dvc-${updated.key}`,
            os: navigator.platform || 'unknown',
            type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            version: '1.0.0',
          },
          organization: updated.industry ? {
            key: `org-${updated.key}`,
            name: updated.industry,
            region: Intl.DateTimeFormat().resolvedOptions().timeZone?.startsWith('America') ? 'NA' : 'OTHER',
          } : undefined,
        });
        await ldClient.identify(ldContext);
      } catch {
        // local context is already updated
      }
    }

    router.refresh();
    setIsSwitching(false);
  }, [currentUser, isAnonymous, isSwitching, ldClient, router]);

  const avatar = (() => {
    const display = isAnonymous
      ? { initial: "?", colorClass: "bg-gray-500" }
      : getUserAvatarDisplay(currentUser);
    const label = isAnonymous
      ? "Anonymous User (No Login)"
      : currentUser ? `User menu for ${currentUser.name}` : "User menu";

    if (variant === "pill") {
      return (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground-secondary",
            "max-w-[14rem] sm:max-w-none",
            className
          )}
          aria-label={label}
          title={label}
        >
          <span
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-white font-medium",
              "ring-1 ring-black/10 dark:ring-white/15 shadow-sm",
              display.colorClass
            )}
          >
            {display.initial}
          </span>
          <span className="font-medium text-foreground truncate">
            {isAnonymous ? "Anonymous" : currentUser ? currentUser.name : "Loading…"}
          </span>
        </div>
      );
    }

    return (
      <span
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white font-medium hover:opacity-80 transition-all",
          "ring-1 ring-black/10 dark:ring-white/15 shadow-sm",
          display.colorClass,
          className
        )}
        aria-label={label}
        title={label}
      >
        {display.initial}
      </span>
    );
  })();

  return (
    <>
      <Dropdown
        align={align}
        trigger={avatar}
        items={[
          {
            label: "Change user",
            onClick: onOpenChangeUser,
            icon: <Users className="w-4 h-4" />,
          },
          {
            label: "New experiment bucket",
            onClick: regenerateKey,
            icon: <RefreshCw className="w-4 h-4" />,
          },
          {
            label: "Log out",
            onClick: onLogout,
            icon: <LogOut className="w-4 h-4" />,
            divider: true,
          },
        ]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Change user"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-secondary">
            Select a demo user type to immediately update LaunchDarkly targeting across the app.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Anonymous option */}
            <button
              type="button"
              onClick={() => setPendingKey(ANONYMOUS_KEY)}
              className={cn(
                "text-left rounded-xl border border-border bg-background-secondary/60 p-4 transition-colors",
                "hover:bg-background-secondary hover:border-foreground-subtle",
                pendingKey === ANONYMOUS_KEY && "ring-2 ring-primary/30 border-primary/40",
                isSwitching && "opacity-60 cursor-not-allowed"
              )}
              disabled={isSwitching}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 bg-gray-500">
                  <UserX className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-foreground truncate">Anonymous User</div>
                    {isAnonymous && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-foreground-secondary truncate">
                    No Login
                  </div>
                  <div className="mt-1 text-xs text-foreground-muted truncate">anonymous: true</div>
                </div>
              </div>
            </button>

            {/* Demo users */}
            {demoUsers.map((u) => {
              const selected = pendingKey === u.key;
              const active = !isAnonymous && currentUser?.key === u.key;
              const display = getUserAvatarDisplay(u);

              return (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => setPendingKey(u.key)}
                  className={cn(
                    "text-left rounded-xl border border-border bg-background-secondary/60 p-4 transition-colors",
                    "hover:bg-background-secondary hover:border-foreground-subtle",
                    selected && "ring-2 ring-primary/30 border-primary/40",
                    isSwitching && "opacity-60 cursor-not-allowed"
                  )}
                  disabled={isSwitching}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0",
                        display.colorClass
                      )}
                    >
                      {display.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-foreground truncate">{u.name}</div>
                        {active ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-xs text-foreground-secondary truncate">
                        {u.subscriptionTier} • {u.role}
                        {u.betaTester ? " • beta" : ""}
                      </div>
                      <div className="mt-1 text-xs text-foreground-muted truncate">{u.email}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={isSwitching}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirmChangeUser}
              disabled={
                isSwitching ||
                !pendingKey ||
                (isAnonymous && pendingKey === ANONYMOUS_KEY) ||
                (!isAnonymous && currentUser?.key ? pendingKey === currentUser.key : false)
              }
            >
              {isSwitching ? "Switching…" : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}


