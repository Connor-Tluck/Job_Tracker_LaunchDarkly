"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bot, User, Send, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext, UserContext } from "@/lib/launchdarkly/userContext";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatTestCard() {
  const ldClient = useLDClient();
  const [mounted, setMounted] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [aiConfigSummary, setAiConfigSummary] = useState<string>("Loading...");
  const [aiConfigDetail, setAiConfigDetail] = useState<string | null>(null);
  const aiConfigKey = "jobs-os-basic-chatbot";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI-powered support assistant. Test different user behaviors by switching users above, then ask me questions about Career Stack!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Handle hydration - only read from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const currentContext = getOrCreateUserContext();
    setUserContext(currentContext);
  }, []);

  // Listen for user context changes (when user switches via UserContextSwitcher)
  useEffect(() => {
    if (!mounted) return;

    const checkUserContext = () => {
      const currentContext = getOrCreateUserContext();
      setUserContext(currentContext);
    };

    // Check immediately
    checkUserContext();

    // Listen for custom event dispatched by UserContextSwitcher
    const handleUserContextChange = () => {
      checkUserContext();
    };

    window.addEventListener('ld-user-context-changed', handleUserContextChange);
    
    // Also listen for storage events (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ld-user-context') {
        checkUserContext();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('ld-user-context-changed', handleUserContextChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [mounted]);

  useEffect(() => {
    if (!userContext) return;
    const resolveAiConfig = async () => {
      try {
        const response = await fetch("/api/ai-config-eval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            configKey: aiConfigKey,
            userContext,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setAiConfigSummary("unavailable");
          setAiConfigDetail(data?.error || "error");
          return;
        }
        const aiConfig = data?.value;
        if (aiConfig && typeof aiConfig === "object") {
          const variationKey =
            aiConfig.variationKey ||
            aiConfig.variation?.key ||
            aiConfig.key ||
            aiConfig.name ||
            "unknown";
          const modelName =
            (aiConfig.model && (aiConfig.model.id || aiConfig.model.modelName || aiConfig.model.name)) ||
            "unknown";
          setAiConfigSummary(`${variationKey} • ${modelName}`);
          setAiConfigDetail(
            `variationIndex=${data?.variationIndex ?? "n/a"} reason=${data?.reason?.kind ?? "n/a"}`
          );
          return;
        }
        setAiConfigSummary("fallback");
        setAiConfigDetail(null);
      } catch {
        setAiConfigSummary("unavailable");
        setAiConfigDetail(null);
      }
    };
    resolveAiConfig();
  }, [userContext]);


  const scrollToBottom = (smooth = true) => {
    if (!messagesContainerRef.current) return;
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: smooth ? "smooth" : "auto", 
        block: "end" 
      });
    }, smooth ? 150 : 0);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" || isLoading) {
      scrollToBottom(true);
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !userContext) return;

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

    try {
      // Get current user context (will reflect any user switches)
      const currentUserContext = userContext;
      
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
          userContext: currentUserContext, // Use current user context for LaunchDarkly targeting
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
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
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

  const handleClear = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared! Ask me anything about Career Stack.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background-tertiary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Chat Test Interface</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
        <p className="text-xs text-foreground-secondary mt-1">
          Testing as: {userContext ? (
            <>
              <span className="font-medium">{userContext.name}</span> ({userContext.subscriptionTier})
            </>
          ) : (
            <span className="font-medium">Loading...</span>
          )}
        </p>
        <p className="text-xs text-foreground-secondary mt-1">
          AI config variation: <span className="font-medium">{aiConfigSummary}</span>
        </p>
        {aiConfigDetail && (
          <p className="text-[11px] text-foreground-secondary mt-1">
            {aiConfigDetail}
          </p>
        )}
        {userContext && (
          <div className="mt-2 rounded-lg border border-border bg-background p-2 text-[11px] text-foreground-secondary">
            Context: kind=user • key={userContext.key} • role={userContext.role} • tier={userContext.subscriptionTier} • timezone={userContext.timezone ?? "n/a"} • locale={userContext.locale ?? "n/a"} • location={userContext.location ? `${userContext.location.latitude},${userContext.location.longitude}` : "n/a"}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="h-[400px] overflow-y-auto p-4 space-y-3 bg-background-secondary/30"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3 text-sm",
                message.role === "user"
                  ? "bg-primary text-white"
                  : "bg-background-tertiary border border-border"
              )}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0 text-sm">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside mb-2 space-y-1 ml-4 text-sm">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside mb-2 space-y-1 ml-4 text-sm">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-foreground-secondary">{children}</li>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-white text-sm">
                  {message.content}
                </p>
              )}
            </div>
            {message.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-primary" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <div className="bg-background-tertiary border border-border rounded-lg p-3">
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
      <div className="border-t border-border p-3 bg-background">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="flex-1 min-h-[50px] max-h-[100px] px-3 py-2 rounded-lg border border-border bg-background-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
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
        <p className="text-xs text-foreground-muted mt-1.5">
          Press Enter to send • Switch users above to test different behaviors
        </p>
      </div>
    </Card>
  );
}

