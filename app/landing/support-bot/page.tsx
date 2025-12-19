"use client";

import { notFound } from "next/navigation";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Lock,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trackEvent } from "@/lib/launchdarkly/tracking";
import { useFlagsReady } from "@/hooks/useFlagsReady";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
}

export default function SupportBotPage() {
  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const ldClient = useLDClient();
  const userContext = getOrCreateUserContext();
  const flagsReady = useFlagsReady();
  // Access to the Support Bot is controlled by the show-chatbot feature flag.
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_CHATBOT, false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI-powered support assistant for Career Stack. I can help answer questions about our features, pricing, getting started, troubleshooting, and best practices. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  // Track page view for experiment
  useEffect(() => {
    if (flagsReady && canAccess) {
      trackEvent(ldClient ?? null, userContext, "support-bot-page-view");
    }
  }, [ldClient, userContext, flagsReady, canAccess]);

  const scrollToBottom = (smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container || !shouldAutoScrollRef.current) return;

    // Important: scroll the *messages container* only. `scrollIntoView()` can scroll the whole document,
    // which is what causes the "jump back to the top of the page" behavior on send.
    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }, smooth ? 150 : 0);
  };

  // Track scroll position to determine if user manually scrolled up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      shouldAutoScrollRef.current = isNearBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Only auto-scroll for assistant messages or when loading starts
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" || isLoading) {
      scrollToBottom(true);
    }
  }, [messages, isLoading]);

  // Show loading state while waiting for flags to initialize
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

  // Check access:
  // - If flag is false and user is free, show an upgrade/premium upsell page.
  // - Otherwise, preserve "not found" behavior for non-free users or other denied contexts.
  // The flag value already reflects LaunchDarkly targeting/experimentation.
  if (!canAccess) {
    if (userContext?.subscriptionTier === "free") {
      const feature = "support-bot";
      const returnTo = "/landing/support-bot";
      return (
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold">Support Bot is a Premium feature</h1>
                  <p className="text-sm text-foreground-secondary">
                    Upgrade to Premium to unlock instant AI-powered help for Career Stack—answers about
                    features, getting started, troubleshooting, and best practices.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/signup?plan=premium&feature=${encodeURIComponent(
                    feature
                  )}&returnTo=${encodeURIComponent(returnTo)}`}
                >
                  <Button variant="primary" size="lg" className="w-full">
                    Sign up for Premium
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/landing">
                  <Button variant="outline" size="lg" className="w-full">
                    Back to Landing
                  </Button>
                </Link>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-background-secondary p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-foreground-secondary" />
                  What you’ll get with Premium
                </div>
                <ul className="mt-2 space-y-1 text-sm text-foreground-secondary list-disc pl-5">
                  <li>Instant answers about features, setup, and troubleshooting</li>
                  <li>Guidance tailored to your workflow (job tracker, prep hub, analytics)</li>
                  <li>Faster resolution without waiting on human support</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      );
    }
    return notFound();
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Track message sent for experiment
    trackEvent(ldClient ?? null, userContext, "support-bot-message-sent", {
      message: currentInput,
    });

    // Streaming UI strategy:
    // - Insert an empty assistant "placeholder" message immediately
    // - As chunks arrive, we update that message's `content` in place (avoids re-ordering / flicker)
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      feedback: null,
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

    try {
      // Prepare messages for API (convert to OpenAI format)
      // Note: we include `userMessage` explicitly here instead of relying on state,
      // because `setMessages` is async and `messages` may be stale in this closure.
      const apiMessages = [
        ...[...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      // Call OpenAI API with user context for LaunchDarkly AI Config
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          userContext: userContext, // Add user context for LaunchDarkly targeting
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "";
      let fullText = "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        fullText =
          data.message ||
          "I apologize, but I couldn't generate a response. Please try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId ? { ...m, content: fullText } : m
          )
        );
      } else {
        if (!response.body) {
          throw new Error("Streaming response body is not available.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            fullText += chunk;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId ? { ...m, content: fullText } : m
              )
            );
          }
        }

        // flush remaining buffered bytes
        const tail = decoder.decode();
        if (tail) {
          fullText += tail;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId ? { ...m, content: fullText } : m
            )
          );
        }
      }

      // Track response received for experiment
      trackEvent(ldClient ?? null, userContext, "support-bot-response-received", {
        responseLength: fullText.length,
      });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      
      const errorMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact our support team for assistance.",
        timestamp: new Date(),
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMessageId ? errorMessage : m))
      );

      // Track error for experiment
      trackEvent(ldClient ?? null, userContext, "support-bot-error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    const target = messages.find((m) => m.id === messageId);
    if (!target || target.role !== "assistant") return;

    const current = target.feedback ?? null;
    const next = current === feedback ? null : feedback;

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: next } : m))
    );

    trackEvent(ldClient ?? null, userContext, "support-bot-response-rated", {
      messageId,
      feedback: next,
      responseLength: target.content.length,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Support Bot</h1>
              <p className="text-foreground-secondary mt-1">
                Get instant answers about Career Stack
              </p>
            </div>
          </div>

          {/* Info Card */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Premium Feature</p>
                <p className="text-xs text-foreground-secondary">
                  This support bot is available to users with premium access. Ask me anything about
                  Career Stack features, pricing, getting started, or troubleshooting. I&apos;m here
                  to help!
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="p-0 overflow-hidden">
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="h-[600px] overflow-y-auto p-6 space-y-4 bg-background-secondary/30"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-background-tertiary border border-border"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="text-sm text-foreground prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-foreground">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-outside mb-3 space-y-2 ml-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-outside mb-3 space-y-2 ml-4">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-foreground-secondary leading-relaxed">
                              {children}
                            </li>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-lg font-semibold mb-2 mt-4 first:mt-0">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">
                              {children}
                            </h3>
                          ),
                          code: ({ children }) => (
                            <code className="px-1.5 py-0.5 rounded bg-background-secondary text-xs font-mono text-foreground">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-primary/30 pl-3 italic my-2 text-foreground-secondary">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap text-white">
                      {message.content}
                    </p>
                  )}
                  <div
                    className={cn(
                      "mt-2 flex items-center gap-2",
                      message.role === "assistant" ? "justify-between" : "justify-end"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          aria-label="Thumbs up this response"
                          aria-pressed={message.feedback === "up"}
                          onClick={() => handleFeedback(message.id, "up")}
                          className={cn(
                            "h-7 w-7 p-0",
                            message.feedback === "up" && "text-primary bg-primary/10"
                          )}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          aria-label="Thumbs down this response"
                          aria-pressed={message.feedback === "down"}
                          onClick={() => handleFeedback(message.id, "down")}
                          className={cn(
                            "h-7 w-7 p-0",
                            message.feedback === "down" && "text-primary bg-primary/10"
                          )}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <p
                      className={cn(
                        "text-xs",
                        message.role === "user" ? "text-white/70" : "text-foreground-muted"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-background-tertiary border border-border rounded-lg p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="flex-1 min-h-[60px] max-h-[120px] px-4 py-3 rounded-lg border border-border bg-background-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                variant="primary"
                size="lg"
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-foreground-muted mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

