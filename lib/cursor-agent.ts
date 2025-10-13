import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface CursorOptions {
  /** The prompt to send to the cursor agent */
  prompt: string;
  /** System prompt to define AI behavior */
  systemPrompt?: string;
  /** API key for authentication (defaults to CURSOR_API_KEY env var) */
  apiKey?: string;
  /** Output format for responses */
  outputFormat?: "json" | "stream-json";
  /** Force allow commands unless explicitly denied */
  force?: boolean;
  /** Model to use (e.g., gpt-5, sonnet-4, sonnet-4-thinking) */
  model?: string;
  /** Resume a specific chat ID */
  resumeChatId?: string;
  /** Enable debug logging for stdio output */
  debug?: boolean;
}

export interface CursorStreamEvent {
  type: "system" | "user" | "assistant" | "tool_call" | "result";
  subtype?: string;
  session_id?: string;
  message?: {
    content: Array<{ text: string }>;
  };
  tool_call?: any;
  model?: string;
  duration_ms?: number;
}

export interface CursorResult {
  success: boolean;
  output: string;
  error?: string;
  duration_ms?: number;
}

export interface CursorStreamResult {
  success: boolean;
  events: CursorStreamEvent[];
  error?: string;
  finalText: string;
  duration_ms?: number;
}

class CursorAgent {
  private defaultOptions: Partial<CursorOptions> = {
    outputFormat: "stream-json",
    force: true,
  };

  /**
   * Check if cursor-agent CLI is available
   */
  private async checkCursorAgentAvailable(): Promise<boolean> {
    console.log("🔍 Checking for cursor-agent CLI...");
    console.log("CURSOR_API_KEY set:", !!process.env.CURSOR_API_KEY);
    
    try {
      const { stdout } = await execAsync("which cursor-agent");
      if (stdout.trim().length > 0) {
        console.log("✅ cursor-agent found:", stdout.trim());
        return true;
      }
    } catch (e) {
      // Not in PATH
    }
    
    // Try adding common locations to PATH
    const locations = ["$HOME/.local/bin", "$HOME/.cursor/bin", "/usr/local/bin"];
    for (const loc of locations) {
      try {
        await execAsync(`test -x ${loc}/cursor-agent`);
        const binDir = loc.replace("$HOME", process.env.HOME || "~");
        process.env.PATH = `${binDir}:${process.env.PATH}`;
        console.log(`✅ Found cursor-agent in ${loc}`);
        return true;
      } catch (e) {
        // Try next location
      }
    }
    
    console.error("❌ cursor-agent not found. Please ensure it's installed.");
    return false;
  }

  /**
   * Generate with streaming support and real-time event callbacks
   */
  async generateStreamWithCallback(
    options: CursorOptions,
    onEvent?: (event: CursorStreamEvent) => void
  ): Promise<CursorStreamResult> {
    const opts = {
      ...this.defaultOptions,
      ...options,
      outputFormat: "stream-json" as const,
    };

    // Check if cursor-agent is available
    const isAvailable = await this.checkCursorAgentAvailable();
    if (!isAvailable) {
      const errorMsg = "cursor-agent CLI not found. Please install it: curl -fsS https://cursor.com/install | bash";
      console.error("❌", errorMsg);
      return {
        success: false,
        events: [],
        finalText: "",
        error: errorMsg,
        duration_ms: 0,
      };
    }

    return new Promise((resolve) => {
      const events: CursorStreamEvent[] = [];
      let finalText = "";
      let accumulatedText = "";
      let error: string | undefined;
      const startTime = Date.now();

      const apiKey = opts.apiKey ?? process.env.CURSOR_API_KEY;
      const env: NodeJS.ProcessEnv = {
        ...(process.env as NodeJS.ProcessEnv),
        ...(apiKey ? { CURSOR_API_KEY: apiKey } : {}),
      };

      const command = this.buildCommand(opts);

      const child = spawn("sh", ["-c", command], {
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });

      // Timeout after 5 minutes
      const timeout = setTimeout(() => {
        try {
          child.kill("SIGTERM");
        } catch {}
        resolve({
          success: false,
          events,
          finalText: finalText || accumulatedText,
          error: "Process timed out after 5 minutes",
          duration_ms: Date.now() - startTime,
        });
      }, 5 * 60 * 1000);

      child.on("error", (err: Error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          events: [],
          finalText: "",
          error: `Child process error: ${err.message}`,
          duration_ms: Date.now() - startTime,
        });
      });

      child.stdout.on("data", (data: Buffer) => {
        const dataStr = data.toString();
        const lines = dataStr.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const event: CursorStreamEvent = JSON.parse(line);
            events.push(event);

            if (onEvent) {
              onEvent(event);
            }

            if (event.type === "assistant" && event.message?.content?.[0]?.text) {
              accumulatedText += event.message.content[0].text;
            }

            if (event.type === "result") {
              finalText = accumulatedText;
              child.kill("SIGTERM");
              clearTimeout(timeout);

              resolve({
                success: true,
                events,
                finalText: finalText || accumulatedText,
                error: undefined,
                duration_ms: event.duration_ms || Date.now() - startTime,
              });
              return;
            }
          } catch (e) {
            // Skip non-JSON lines
          }
        }
      });

      child.stderr.on("data", (data: Buffer) => {
        const errorStr = data.toString();
        error = errorStr;
        if (errorStr.includes("Error") || errorStr.includes("error")) {
          console.error("⚠️", errorStr.trim());
        }
      });

      child.on("close", (code: number | null) => {
        clearTimeout(timeout);
        const duration_ms = Date.now() - startTime;

        resolve({
          success: code === 0,
          events,
          finalText: finalText || accumulatedText,
          error: code !== 0 ? error : undefined,
          duration_ms,
        });
      });
    });
  }

  /**
   * Generate with streaming support for real-time progress tracking
   */
  async generateStream(options: CursorOptions): Promise<CursorStreamResult> {
    return this.generateStreamWithCallback(options);
  }

  private buildCommand(options: CursorOptions): string {
    const parts = ["cursor-agent"];

    parts.push("--print"); // Always use print mode for headless usage

    if (options.outputFormat) {
      parts.push("--output-format", options.outputFormat);
    }

    if (options.force) {
      parts.push("--force");
    }

    if (options.model) {
      parts.push("--model", options.model);
    }

    if (options.resumeChatId) {
      parts.push("--resume", options.resumeChatId);
    }

    if (options.apiKey) {
      parts.push("--api-key", options.apiKey);
    }

    // Combine system prompt and user prompt if system prompt is provided
    let fullPrompt = options.prompt;
    if (options.systemPrompt) {
      fullPrompt = `System: ${options.systemPrompt}\n\nUser: ${options.prompt}`;
    }
    
    // Escape the prompt for shell
    const escapedPrompt = fullPrompt
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');
    
    parts.push(`"${escapedPrompt}"`);

    return parts.join(" ");
  }
}

// Export a default instance
export const cursor = new CursorAgent();

// Export the class for custom instances
export { CursorAgent };

