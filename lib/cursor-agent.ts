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
  /** Internal: Force environment variable prefix in command (for spawn) */
  forceEnvPrefix?: boolean;
}

export interface CursorStreamEvent {
  type: "system" | "user" | "assistant" | "tool_call" | "result";
  subtype?: string;
  session_id?: string;
  message?: {
    content: Array<{ text: string }>;
  };
  tool_call?: {
    writeToolCall?: {
      args: { path: string };
      result?: {
        success?: {
          linesCreated: number;
          fileSize: number;
        };
      };
    };
    readToolCall?: {
      args: { path: string };
      result?: {
        success?: {
          totalLines: number;
        };
      };
    };
  };
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
   * Generate code/text using cursor-agent CLI
   */
  async generate(options: CursorOptions): Promise<CursorResult> {
    if (options.debug) {
      console.log("🔍 Debug: Entering generate() method");
    }

    const opts = { ...this.defaultOptions, ...options };

    if (options.debug) {
      console.log("🔍 Debug: Merged options:", opts);
      console.log("🔍 Debug: Output format:", opts.outputFormat);
    }

    // Default to stream-json, but handle json format directly
    if (opts.outputFormat === "json") {
      if (options.debug) {
        console.log("🔍 Debug: Using JSON format - calling execAsync path");
      }
      try {
        const command = this.buildCommand(opts);

        // Debug output
        if (
          opts.debug ||
          process.env.DEBUG_CURSOR ||
          process.env.NODE_ENV === "development"
        ) {
          console.log("🔧 Debug: Executing command:");
          console.log(command);
        }

        const { stdout, stderr } = await execAsync(command, {
          env: {
            ...process.env,
          },
        });

        // Debug logging for stdio output
        if (opts.debug) {
          if (stdout) {
            console.log("📤 Debug: STDOUT received:");
            console.log(stdout);
          }
          if (stderr) {
            console.log("⚠️ Debug: STDERR received:");
            console.log(stderr);
          }
        }

        if (stderr && !stdout) {
          throw new Error(stderr);
        }

        let parsedOutput = stdout;
        try {
          parsedOutput = JSON.parse(stdout);
          if (opts.debug) {
            console.log("📊 Debug: Parsed JSON output:");
            console.log(parsedOutput);
          }
        } catch (e) {
          // If JSON parsing fails, return the raw output
          if (opts.debug) {
            console.log("⚠️ Debug: JSON parsing failed, returning raw output");
          }
        }

        return {
          success: true,
          output: parsedOutput,
        };
      } catch (error) {
        if (opts.debug) {
          console.log("❌ Debug: Command execution failed:");
          console.log(error);
        }
        return {
          success: false,
          output: "",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    // Default to stream-json - delegate to streaming runner
    if (options.debug) {
      console.log(
        "🔍 Debug: Using stream-json format - delegating to generateStream",
      );
    }
    const streamResult = await this.generateStream(opts);
    return {
      success: streamResult.success,
      output: streamResult.finalText,
      error: streamResult.error,
      duration_ms: streamResult.duration_ms,
    };
  }

  /**
   * Helper to log stream events in a compact, readable format
   */
  private logStreamEvent(event: CursorStreamEvent): void {
    const truncate = (str: string, maxLen: number = 80) => {
      if (str.length <= maxLen) return str;
      return str.substring(0, maxLen) + "...";
    };

    switch (event.type) {
      case "system":
        if (event.subtype === "init") {
          console.log(`🔧 System initialized (session: ${event.session_id?.substring(0, 8)}...)`);
        }
        break;

      case "user":
        console.log(`👤 User message sent`);
        break;

      case "assistant":
        const text = event.message?.content?.[0]?.text;
        if (text) {
          const preview = truncate(text.trim().replace(/\n/g, " "));
          console.log(`🤖 ${preview}`);
        }
        break;

      case "tool_call":
        if (event.subtype === "started") {
          const toolName = this.getToolName(event.tool_call);
          const summary = this.getToolSummary(event.tool_call);
          console.log(`  ⚙️  ${toolName}${summary ? `: ${summary}` : ""}`);
        } else if (event.subtype === "completed") {
          const toolName = this.getToolName(event.tool_call);
          const resultInfo = this.getResultInfo(event.tool_call);
          console.log(`  ✅ ${toolName}${resultInfo ? ` ${resultInfo}` : ""}`);
        }
        break;

      case "result":
        const duration = event.duration_ms ? `${(event.duration_ms / 1000).toFixed(1)}s` : "N/A";
        console.log(`🎯 Result received (duration: ${duration})`);
        break;
    }
  }

  private getToolName(toolCall: any): string {
    if (toolCall?.readToolCall) return "read_file";
    if (toolCall?.writeToolCall) return "write_file";
    if (toolCall?.lsToolCall) return "list_dir";
    if (toolCall?.shellToolCall) return "shell";
    if (toolCall?.updateTodosToolCall) return "update_todos";
    if (toolCall?.searchReplaceToolCall) return "edit_file";
    if (toolCall?.grepToolCall) return "grep";
    if (toolCall?.deleteFileToolCall) return "delete_file";
    if (toolCall?.moveFileToolCall) return "move_file";
    if (toolCall?.createDirectoryToolCall) return "create_dir";
    if (toolCall?.codebaseSearchToolCall) return "codebase_search";
    if (toolCall?.webSearchToolCall) return "web_search";
    if (toolCall?.runTerminalCmdToolCall) return "terminal";
    if (toolCall?.editNotebookToolCall) return "edit_notebook";
    if (toolCall?.readLintsToolCall) return "read_lints";
    if (toolCall?.globFileSearchToolCall) return "find_files";
    
    // If we can't identify it, show the keys
    const keys = Object.keys(toolCall || {}).filter(k => k.endsWith('ToolCall'));
    return keys.length > 0 ? keys[0].replace('ToolCall', '') : "tool";
  }

  private getToolSummary(toolCall: any): string {
    const truncate = (str: string, maxLen: number = 40) => {
      if (str.length <= maxLen) return str;
      return str.substring(0, maxLen) + "...";
    };

    if (toolCall?.readToolCall?.args?.path) {
      return toolCall.readToolCall.args.path;
    }
    if (toolCall?.writeToolCall?.args?.path) {
      return toolCall.writeToolCall.args.path;
    }
    if (toolCall?.lsToolCall?.args?.path) {
      return toolCall.lsToolCall.args.path;
    }
    if (toolCall?.shellToolCall?.args?.command) {
      return truncate(toolCall.shellToolCall.args.command);
    }
    if (toolCall?.runTerminalCmdToolCall?.args?.command) {
      return truncate(toolCall.runTerminalCmdToolCall.args.command);
    }
    if (toolCall?.updateTodosToolCall?.args?.todos) {
      const count = toolCall.updateTodosToolCall.args.todos.length;
      return `${count} todo${count !== 1 ? "s" : ""}`;
    }
    if (toolCall?.searchReplaceToolCall?.args?.file_path) {
      return toolCall.searchReplaceToolCall.args.file_path;
    }
    if (toolCall?.deleteFileToolCall?.args?.target_file) {
      return toolCall.deleteFileToolCall.args.target_file;
    }
    if (toolCall?.grepToolCall?.args?.pattern) {
      return `"${truncate(toolCall.grepToolCall.args.pattern)}"`;
    }
    if (toolCall?.codebaseSearchToolCall?.args?.query) {
      return `"${truncate(toolCall.codebaseSearchToolCall.args.query)}"`;
    }
    if (toolCall?.webSearchToolCall?.args?.search_term) {
      return `"${truncate(toolCall.webSearchToolCall.args.search_term)}"`;
    }
    if (toolCall?.globFileSearchToolCall?.args?.glob_pattern) {
      return toolCall.globFileSearchToolCall.args.glob_pattern;
    }
    if (toolCall?.readLintsToolCall?.args?.paths) {
      const paths = toolCall.readLintsToolCall.args.paths;
      return paths && paths.length > 0 ? `${paths.length} file${paths.length !== 1 ? "s" : ""}` : "";
    }
    
    return "";
  }

  private getResultInfo(toolCall: any): string {
    // Show useful info from completed tool results
    if (toolCall?.writeToolCall?.result?.success) {
      const lines = toolCall.writeToolCall.result.success.linesCreated;
      return lines ? `(${lines} lines)` : "";
    }
    if (toolCall?.readToolCall?.result?.success) {
      const lines = toolCall.readToolCall.result.success.totalLines;
      return lines ? `(${lines} lines)` : "";
    }
    if (toolCall?.shellToolCall?.result?.success) {
      const exitCode = toolCall.shellToolCall.result.success.exitCode;
      return exitCode === 0 ? "" : `(exit: ${exitCode})`;
    }
    if (toolCall?.runTerminalCmdToolCall?.result?.success) {
      const exitCode = toolCall.runTerminalCmdToolCall.result.success.exitCode;
      return exitCode === 0 ? "" : `(exit: ${exitCode})`;
    }
    
    return "";
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

      const command = this.buildCommand({ ...opts, forceEnvPrefix: false });

      const child = spawn("sh", ["-c", command], {
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });

      // Add a timeout to prevent infinite hanging
      const timeoutMs = 5 * 60 * 1000; // 5 minutes
      const timeout = setTimeout(() => {
        try {
          child.kill("SIGTERM");
        } catch {}
        resolve({
          success: false,
          events,
          finalText: finalText || accumulatedText,
          error: `Process timed out after ${timeoutMs}ms`,
          duration_ms: Date.now() - startTime,
        });
      }, timeoutMs);

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

            // Always show compact event logging
            this.logStreamEvent(event);

            // Call the event callback immediately for real-time updates
            if (onEvent) {
              onEvent(event);
            }

            // Accumulate text from assistant messages
            if (
              event.type === "assistant" &&
              event.message?.content?.[0]?.text
            ) {
              accumulatedText += event.message.content[0].text;
            }

            // Capture final result
            if (event.type === "result") {
              finalText = accumulatedText;

              // Kill the child process since cursor-agent doesn't exit cleanly
              child.kill("SIGTERM");
              clearTimeout(timeout);

              // Resolve immediately when we get the result
              const duration_ms = Date.now() - startTime;
              resolve({
                success: true,
                events,
                finalText: finalText || accumulatedText,
                error: undefined,
                duration_ms: event.duration_ms || duration_ms,
              });
              return;
            }
          } catch (e) {
            // Silently skip non-JSON lines
          }
        }
      });

      child.stderr.on("data", (data: Buffer) => {
        const errorStr = data.toString();
        error = errorStr;
        // Only show actual errors
        if (errorStr.includes("Error") || errorStr.includes("error")) {
          console.error("⚠️ ", errorStr.trim());
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

  /**
   * Create a new empty chat and return its ID
   */
  async createChat(): Promise<{
    success: boolean;
    chatId?: string;
    error?: string;
  }> {
    try {
      const { stdout, stderr } = await execAsync("cursor-agent create-chat");

      if (stderr) {
        throw new Error(stderr);
      }

      return {
        success: true,
        chatId: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Check authentication status
   */
  async status(): Promise<{
    success: boolean;
    status?: string;
    error?: string;
  }> {
    try {
      const { stdout, stderr } = await execAsync("cursor-agent status");

      return {
        success: true,
        status: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Login to Cursor
   */
  async login(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const { stdout, stderr } = await execAsync("cursor-agent login");

      return {
        success: true,
        message: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
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
    
    // Add the prompt (properly escaped for shell)
    // Escape backslashes first, then other special characters
    const escapedPrompt = fullPrompt
      .replace(/\\/g, '\\\\')   // Escape backslashes
      .replace(/"/g, '\\"')     // Escape double quotes
      .replace(/`/g, '\\`')     // Escape backticks
      .replace(/\$/g, '\\$');   // Escape dollar signs
    
    parts.push(`"${escapedPrompt}"`);

    const command = parts.join(" ");

    // For execAsync, we don't need to prefix with environment variables
    // since we set them in the env object. Only prefix for shell commands (spawn).
    if (options.forceEnvPrefix) {
      const apiKey = options.apiKey ?? process.env.CURSOR_API_KEY;
      if (apiKey) {
        return `CURSOR_API_KEY=${apiKey} ${command}`;
      }
    }

    return command;
  }

  private parseCommand(command: string): string[] {
    // Handle environment variable prefix (e.g., CURSOR_API_KEY=value command)
    let actualCommand = command;
    const envVars: { [key: string]: string } = {};

    // Check if command starts with environment variables
    const envVarRegex = /^(\w+=[^\s]+\s+)+/;
    const envMatch = command.match(envVarRegex);

    if (envMatch) {
      const envPart = envMatch[0].trim();
      actualCommand = command.substring(envMatch[0].length);

      // Parse environment variables
      const envPairs = envPart.split(/\s+/);
      for (const pair of envPairs) {
        const [key, value] = pair.split("=");
        if (key && value) {
          envVars[key] = value;
        }
      }
    }

    // Simple command parsing - in production you might want a more robust parser
    const parts = [];
    let current = "";
    let inQuotes = false;
    let escapeNext = false;

    for (let i = 0; i < actualCommand.length; i++) {
      const char = actualCommand[i];

      if (escapeNext) {
        current += char;
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === " " && !inQuotes) {
        if (current) {
          parts.push(current);
          current = "";
        }
        continue;
      }

      current += char;
    }

    if (current) {
      parts.push(current);
    }

    // For spawn, we need to handle environment variables differently
    // We'll use 'sh' to execute the full command with env vars
    if (Object.keys(envVars).length > 0) {
      const envString = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join(" ");

      // Reconstruct the original command with proper quoting
      const reconstructedCommand = actualCommand.trim();

      return ["sh", "-c", `${envString} ${reconstructedCommand}`];
    }

    return parts;
  }
}

// Export a default instance
export const cursor = new CursorAgent();

// Export the class for custom instances
export { CursorAgent };

