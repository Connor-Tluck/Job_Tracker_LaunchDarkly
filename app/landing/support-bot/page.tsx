"use client";

import { notFound } from "next/navigation";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
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
}

export default function SupportBotPage() {
  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const ldClient = useLDClient();
  const userContext = getOrCreateUserContext();
  const flagsReady = useFlagsReady();
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO, false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI-powered support assistant for Job Search OS. I can help answer questions about our features, pricing, getting started, troubleshooting, and best practices. What would you like to know?",
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
    if (flagsReady && canAccess && ldClient) {
      trackEvent(ldClient, userContext, "support-bot-page-view");
    }
  }, [ldClient, userContext, flagsReady, canAccess]);

  const scrollToBottom = (smooth = true) => {
    if (!messagesContainerRef.current || !shouldAutoScrollRef.current) return;
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: smooth ? "smooth" : "auto", 
        block: "end" 
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

  // Check access - if flag is false, user doesn't have access (404)
  // The flag value already reflects LaunchDarkly targeting (individual or rule-based)
  if (!canAccess) {
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

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Track message sent for experiment
    trackEvent(ldClient, userContext, "support-bot-message-sent", {
      message: currentInput,
    });

    try {
      // Prepare messages for API (convert to OpenAI format)
      const apiMessages = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: currentInput,
        },
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
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Track response received for experiment
      trackEvent(ldClient, userContext, "support-bot-response-received", {
        responseLength: assistantMessage.content.length,
      });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact our support team for assistance.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      // Track error for experiment
      if (ldClient) {
        ldClient.track("support-bot-error", userContext, {
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                Get instant answers about Job Search OS
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
                  Job Search OS features, pricing, getting started, or troubleshooting. I&apos;m here
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
                  <p
                    className={cn(
                      "text-xs mt-2",
                      message.role === "user"
                        ? "text-white/70"
                        : "text-foreground-muted"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
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
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..."
                className="flex-1 min-h-[60px] max-h-[120px] px-4 py-3 rounded-lg border border-border bg-background-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                disabled={isLoading}
              />
              <Button
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

        {/* Helpful Tips */}
        <Card className="mt-6 p-4 bg-background-tertiary">
          <p className="text-sm font-medium mb-2">💡 What can I help you with?</p>
          <ul className="text-xs text-foreground-secondary space-y-1 list-disc list-inside">
            <li>Features and capabilities of Job Search OS</li>
            <li>Pricing plans and subscription options</li>
            <li>Getting started guides and tutorials</li>
            <li>Troubleshooting common issues</li>
            <li>Best practices for job search tracking</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

