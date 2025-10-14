"use client";

import { useRef, useState, useEffect } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon, CubeIcon } from "@/components/icons";
import Link from "next/link";
import { ModelSelector } from "@/components/model-selector";
import { sendMessage } from "./actions";
import { renderComponent } from "@/lib/component-renderer";
import { AgentResponse } from "@/lib/agent-wrapper";

interface MessageItem {
  role: "user" | "assistant";
  content: string;
  response?: AgentResponse;
}

// Helper to merge data deltas for progressive rendering
function mergeDelta(current: any, delta: any): any {
  if (!current) return delta;
  
  // Special handling for datasets array (for charts)
  if (typeof current === 'object' && 'datasets' in current && 
      typeof delta === 'object' && 'datasets' in delta) {
    return {
      ...current,
      ...delta,
      datasets: [...(current.datasets || []), ...(delta.datasets || [])]
    };
  }
  
  if (Array.isArray(current) && Array.isArray(delta)) {
    return [...current, ...delta];
  }
  if (typeof current === 'object' && typeof delta === 'object') {
    return { ...current, ...delta };
  }
  return delta;
}

// Animated dots component
function AnimatedDots() {
  const [dots, setDots] = useState(".");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return <span>{dots}</span>;
}

// Component skeleton for different component types
function ComponentSkeleton({ componentType }: { componentType: string }) {
  const baseClasses = "animate-pulse bg-muted rounded-lg";
  
  // Chart-based components - match actual chart dimensions
  if (componentType.includes('chart') || componentType.includes('gauge')) {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className={`h-6 w-48 ${baseClasses} mb-4`} /> {/* Title */}
            <div className={`h-64 w-full ${baseClasses}`} /> {/* Chart area */}
          </div>
        </div>
      </div>
    );
  }
  
  // Weather card - match exact weather card structure
  if (componentType === 'weather-card') {
    return (
      <div className="md:max-w-[452px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6">
            {/* Header with location and icon */}
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className={`h-6 w-32 ${baseClasses}`} /> {/* Location */}
                <div className={`h-4 w-24 ${baseClasses}`} /> {/* Condition */}
              </div>
              <div className={`h-12 w-12 ${baseClasses} rounded`} /> {/* Weather icon */}
            </div>
            
            {/* Temperature */}
            <div className={`h-16 w-32 ${baseClasses} mb-4`} />
            
            {/* Additional details */}
            <div className="flex gap-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 ${baseClasses} rounded`} />
                <div className="space-y-1">
                  <div className={`h-3 w-16 ${baseClasses}`} />
                  <div className={`h-4 w-12 ${baseClasses}`} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 ${baseClasses} rounded`} />
                <div className="space-y-1">
                  <div className={`h-3 w-12 ${baseClasses}`} />
                  <div className={`h-4 w-16 ${baseClasses}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Stock ticker
  if (componentType === 'stock-ticker') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`h-8 w-20 ${baseClasses}`} /> {/* Symbol */}
              <div className={`h-8 w-24 ${baseClasses}`} /> {/* Price */}
            </div>
            <div className={`h-32 w-full ${baseClasses}`} /> {/* Chart */}
          </div>
        </div>
      </div>
    );
  }
  
  // Recipe card
  if (componentType === 'recipe-card') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 space-y-4">
            <div className={`h-8 w-64 ${baseClasses}`} /> {/* Title */}
            <div className="flex gap-4">
              <div className={`h-6 w-20 ${baseClasses}`} />
              <div className={`h-6 w-20 ${baseClasses}`} />
              <div className={`h-6 w-16 ${baseClasses}`} />
            </div>
            <div className={`h-40 w-full ${baseClasses}`} /> {/* Image */}
            <div className="space-y-2">
              <div className={`h-4 w-full ${baseClasses}`} />
              <div className={`h-4 w-full ${baseClasses}`} />
              <div className={`h-4 w-3/4 ${baseClasses}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Comparison table
  if (componentType === 'comparison-table') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 space-y-3">
            <div className={`h-8 w-full ${baseClasses}`} /> {/* Header */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className={`h-6 w-24 ${baseClasses}`} />
                <div className={`h-6 flex-1 ${baseClasses}`} />
                <div className={`h-6 flex-1 ${baseClasses}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Timeline
  if (componentType === 'timeline') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className={`h-10 w-10 rounded-full ${baseClasses}`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-6 w-40 ${baseClasses}`} />
                  <div className={`h-4 w-full ${baseClasses}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Stat card - match grid layout
  if (componentType === 'stat-card') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-24 ${baseClasses}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // List with icons
  if (componentType === 'list-with-icons') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className={`h-6 w-6 rounded ${baseClasses}`} />
                <div className={`h-6 flex-1 ${baseClasses}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Profile card
  if (componentType === 'profile-card') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex gap-4 items-center">
              <div className={`h-20 w-20 rounded-full ${baseClasses}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-6 w-40 ${baseClasses}`} />
                <div className={`h-4 w-32 ${baseClasses}`} />
              </div>
            </div>
            <div className={`h-24 w-full ${baseClasses}`} />
          </div>
        </div>
      </div>
    );
  }
  
  // Media grid / images
  if (componentType === 'media-grid' || componentType === 'images') {
    return (
      <div className="md:max-w-[500px] max-w-full w-full">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-40 ${baseClasses}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default card skeleton for other types
  return (
    <div className="md:max-w-[500px] max-w-full w-full">
      <div className="border rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className={`h-6 w-48 ${baseClasses}`} />
          <div className={`h-32 w-full ${baseClasses}`} />
          <div className="space-y-2">
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className={`h-4 w-3/4 ${baseClasses}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<MessageItem>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("Thinking");
  const [buildingResponse, setBuildingResponse] = useState<AgentResponse | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('cheetah');
  const [isFinishing, setIsFinishing] = useState(false);
  const [pendingResponse, setPendingResponse] = useState<AgentResponse | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  // Read model from URL parameter on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const modelParam = searchParams.get('model');
    if (modelParam) {
      setSelectedModel(modelParam);
    }
  }, []);

  const suggestedActions = [
    {
      title: "Show me",
      label: "the weather in San Francisco",
      action: "What's the weather in Tokyo?",
    },
    {
      title: "Display",
      label: "Tesla stock price trend",
      action: "Show me Tesla's stock price over the last week",
    },
    {
      title: "Compare",
      label: "iPhone Air vs 17 Pro",
      action: "Compare iPhone 17 Pro and iPhone Air",
    },
    {
      title: "Create",
      label: "the best guacamole recipe",
      action: "Give me the best recipe for guacamole",
    },
  ];

  const handleSubmit = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading || isFinishing) return;

    setIsLoading(true);
    setLoadingStep("Thinking");

    // Add user message
    setMessages((messages) => [
      ...messages,
      { role: "user", content: userMessage },
    ]);
    setInput("");

    try {
      // Use fetch to get streaming updates
      const response = await fetch("/api/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      // Read the stream
      let finalResponse: AgentResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "progress" && data.step) {
                // Update loading step in real-time
                setLoadingStep(data.step);
              } else if (data.type === "partial" && data.chunk) {
                // Progressive rendering of component as it builds
                setBuildingResponse((prev: AgentResponse | null) => {
                  if (data.chunk.stage === "init") {
                    return {
                      componentType: data.chunk.componentType,
                      config: {},
                      data: null,
                      textResponse: ""
                    };
                  }
                  if (data.chunk.stage === "config" && prev) {
                    return { ...prev, config: { ...prev.config, ...data.chunk.config } };
                  }
                  if (data.chunk.stage === "data" && prev) {
                    return { ...prev, data: mergeDelta(prev.data, data.chunk.dataDelta) };
                  }
                  return prev;
                });
              } else if (data.type === "complete" && data.response) {
                // Store final response and enter finishing state
                finalResponse = data.response;
                setBuildingResponse(null);
                setIsFinishing(true);
                setPendingResponse(data.response);
                setLoadingStep("Creating component");
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (e) {
              // Skip invalid JSON lines
              console.warn("Failed to parse SSE data:", e);
            }
          }
        }
      }

      // Wait 1.5 seconds in finishing state, then add final response to messages
      if (finalResponse) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setMessages((messages) => [
          ...messages,
          { role: "assistant", content: "", response: finalResponse },
        ]);
        setIsFinishing(false);
        setPendingResponse(null);
      } else {
        throw new Error("No response received");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "",
          response: {
            componentType: "text",
            data: null,
            textResponse: "Sorry, something went wrong. Please try again.",
          },
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsFinishing(false);
      setPendingResponse(null);
      setLoadingStep("Thinking");
    }
  };

  return (    
    <div className="flex flex-row justify-center pb-20 md:pb-20 h-dvh bg-background" style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom) + 3rem)' }}>
      <div className="flex flex-col justify-between">     
        <div
          ref={messagesContainerRef}        
          className="flex flex-col gap-4 md:gap-2 h-full w-full items-center overflow-y-scroll"
          style={{ paddingTop: 'max(4rem, env(safe-area-inset-top) + 2rem)' }}
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              role={message.role}
              content={
                message.response
                  ? renderComponent(message.response)
                  : message.content
              }
            />
          ))}
          {/* Show building component while streaming */}
          {isLoading && buildingResponse && !isFinishing && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Message
                role="assistant"
                content={renderComponent(buildingResponse)}
              />
            </motion.div>
          )}
          {/* Show skeleton component during finishing state */}
          {isFinishing && pendingResponse && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Message
                role="assistant"
                content={<ComponentSkeleton componentType={pendingResponse.componentType} />}
              />
            </motion.div>
          )}
          {/* Show loading indicator */}
          {(isLoading || isFinishing) && !buildingResponse && (
            <motion.div
              className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-muted-foreground">
                <div className="animate-pulse">
                  <CubeIcon />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="text-foreground flex items-center animate-pulse">
                  {loadingStep}
                  <AnimatedDots />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            !isLoading &&
            !isFinishing &&
            suggestedActions.map((action, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={() => handleSubmit(action.action)}
                  disabled={isLoading || isFinishing}
                  className="w-full text-left border border-border text-foreground rounded-lg p-2 text-sm hover:bg-muted transition-colors flex flex-col disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-muted-foreground">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center w-full"
          onSubmit={async (event) => {
            event.preventDefault();
            handleSubmit(input);
          }}
        >
          <div 
            className={`
              flex flex-col w-full md:max-w-[500px] max-w-full px-4 md:px-0
              border rounded-lg transition-all duration-200 cursor-text
              ${isFocused 
                ? 'bg-white dark:bg-[#2A2A2A] border-border' 
                : 'bg-background border-border'
              }
            `}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Input Field */}
            <input
              ref={inputRef}
              className="bg-transparent px-3 pt-3 pb-2 w-full outline-none text-foreground placeholder-muted-foreground disabled:opacity-50"
              placeholder="Ask me anything"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading || isFinishing}
            />
            
            {/* Model Selector and Agent Row */}
            <div className="flex items-center justify-between gap-2 px-3 pb-3">
              <div onClick={(e) => e.stopPropagation()}>
                <ModelSelector 
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isLoading || isFinishing}
                />
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2">                
                <button
                  type="submit"
                  disabled={isLoading || isFinishing || !input.trim()}
                  onClick={(e) => e.stopPropagation()}
                  className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
