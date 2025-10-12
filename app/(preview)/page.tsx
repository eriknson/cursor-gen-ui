"use client";

import { useRef, useState, useEffect } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon, CubeIcon } from "@/components/icons";
import Link from "next/link";
import { sendMessage } from "./actions";
import { renderComponent } from "@/lib/component-renderer";
import { AgentResponse } from "@/lib/agent-wrapper";

interface MessageItem {
  role: "user" | "assistant";
  content: string;
  response?: AgentResponse;
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

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<MessageItem>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("Thinking");

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "Show me",
      label: "the weather in Tokyo",
      action: "What's the weather in Tokyo?",
    },
    {
      title: "Display",
      label: "Tesla stock price trend",
      action: "Show me Tesla's stock price over the last week",
    },
    {
      title: "Compare",
      label: "iPhone 15 vs Samsung S24",
      action: "Compare iPhone 15 Pro and Samsung Galaxy S24 Ultra",
    },
    {
      title: "Create",
      label: "a chocolate chip cookie recipe",
      action: "Give me a recipe for chocolate chip cookies",
    },
  ];

  const handleSubmit = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

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
        body: JSON.stringify({ message: userMessage }),
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
              } else if (data.type === "complete" && data.response) {
                // Store final response
                finalResponse = data.response;
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

      // Add final response to messages
      if (finalResponse) {
        setMessages((messages) => [
          ...messages,
          { role: "assistant", content: "", response: finalResponse },
        ]);
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
      setLoadingStep("Thinking");
    }
  };

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-3 h-full w-dvw items-center overflow-y-scroll"
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
          {isLoading && (
            <motion.div
              className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                <div className="animate-pulse">
                  <CubeIcon />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="text-zinc-800 dark:text-zinc-300 flex items-center animate-pulse">
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
                  disabled={isLoading}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={async (event) => {
            event.preventDefault();
            handleSubmit(input);
          }}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)] disabled:opacity-50"
            placeholder="Ask me anything"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
