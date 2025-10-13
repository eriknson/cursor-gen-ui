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
    const opts = { ...this.defaultOptions, ...options };

    // Default to stream-json, but handle json format directly
    if (opts.outputFormat === "json") {
      try {
        const command = this.buildCommand(opts);

        const { stdout, stderr } = await execAsync(command, {
          env: {
            ...process.env,
          },
        });

        if (stderr && !stdout) {
          throw new Error(stderr);
        }

        let parsedOutput = stdout;
        try {
          parsedOutput = JSON.parse(stdout);
        } catch (e) {
          // If JSON parsing fails, return the raw output
        }

        return {
          success: true,
          output: parsedOutput,
        };
      } catch (error) {
        return {
          success: false,
          output: "",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    // Default to stream-json - delegate to streaming runner
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
    // Only log in development mode
    if (process.env.NODE_ENV !== "development") {
      return;
    }

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
   * Download cursor-agent binary to /tmp for serverless environments
   */
  private async downloadCursorAgent(): Promise<string | null> {
    const tmpPath = "/tmp/cursor-agent";
    const installDir = "/tmp/cursor-agent-install";
    
    try {
      console.log("📦 Starting cursor-agent download...");
      console.log("Target:", tmpPath);
      console.log("Install dir:", installDir);
      
      // Step 1: Download and install cursor-agent
      console.log("Step 1: Running installer...");
      const installResult = await execAsync(
        `curl -fsS https://cursor.com/install | bash`,
        { timeout: 120000 } // 2 minute timeout for download
      );
      console.log("Installer output:", installResult.stdout.substring(0, 500));
      
      // Step 2: Find the installation directory
      console.log("Step 2: Locating cursor-agent installation...");
      let cursorDir = "";
      
      try {
        // Check if ~/.local/bin/cursor-agent is a symlink
        const linkCheck = await execAsync(`
          if [ -L ~/.local/bin/cursor-agent ]; then
            readlink ~/.local/bin/cursor-agent
          else
            echo ""
          fi
        `);
        
        if (linkCheck.stdout.trim()) {
          const linkTarget = linkCheck.stdout.trim();
          cursorDir = linkTarget.substring(0, linkTarget.lastIndexOf('/'));
          console.log("Found symlink pointing to:", cursorDir);
        }
      } catch (e) {
        console.log("Not a symlink, checking direct paths...");
      }
      
      // Fallback to checking standard locations
      if (!cursorDir) {
        const locations = [
          "~/.local/bin",
          "~/.cursor/bin",
          "/usr/local/bin"
        ];
        
        for (const loc of locations) {
          try {
            await execAsync(`test -f ${loc}/cursor-agent && test -f ${loc}/node && test -f ${loc}/index.js`);
            cursorDir = loc;
            console.log("Found cursor-agent in:", loc);
            break;
          } catch (e) {
            // Try next location
          }
        }
      }
      
      if (!cursorDir) {
        throw new Error("Could not locate cursor-agent installation directory");
      }
      
      // Step 3: Copy all files to /tmp
      console.log("Step 3: Copying files to", installDir);
      await execAsync(`mkdir -p ${installDir}`);
      
      const copyResult = await execAsync(`
        cp ${cursorDir}/cursor-agent ${installDir}/ &&
        cp ${cursorDir}/node ${installDir}/ &&
        cp ${cursorDir}/index.js ${installDir}/ &&
        cp ${cursorDir}/*.node ${installDir}/ 2>/dev/null || true &&
        cp ${cursorDir}/package.json ${installDir}/ 2>/dev/null || true &&
        cp ${cursorDir}/rg ${installDir}/ 2>/dev/null || true &&
        chmod +x ${installDir}/cursor-agent ${installDir}/node &&
        ls -lh ${installDir}/ | head -10
      `);
      
      console.log("Copy result:", copyResult.stdout);
      
      // Step 4: Create wrapper script
      console.log("Step 4: Creating wrapper script at", tmpPath);
      await execAsync(`
        cat > ${tmpPath} << 'EOF'
#!/bin/bash
export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
exec ${installDir}/node --use-system-ca ${installDir}/index.js "$@"
EOF
        chmod +x ${tmpPath}
      `);
      
      // Step 5: Verify it works
      console.log("Step 5: Verifying installation...");
      try {
        const verifyResult = await execAsync(`${tmpPath} --version`, { timeout: 5000 });
        console.log("✅ Verification successful:", verifyResult.stdout.trim());
      } catch (e) {
        console.warn("⚠️ Version check failed, but continuing anyway");
      }
      
      console.log("✅ cursor-agent downloaded and configured successfully");
      return tmpPath;
      
    } catch (error) {
      console.error("❌ Failed to download cursor-agent");
      console.error("Error:", error instanceof Error ? error.message : String(error));
      
      // Try to provide helpful diagnostics
      try {
        const diagResult = await execAsync(`
          echo "=== Diagnostic Info ===" &&
          echo "HOME: $HOME" &&
          echo "PATH: $PATH" &&
          echo "~/.local/bin contents:" &&
          ls -la ~/.local/bin/ 2>&1 || echo "Directory not found" &&
          echo "~/.local/share/cursor-agent:" &&
          ls -la ~/.local/share/cursor-agent/ 2>&1 || echo "Directory not found"
        `);
        console.log("Diagnostics:", diagResult.stdout);
      } catch (e) {
        console.log("Could not run diagnostics");
      }
      
      return null;
    }
  }

  /**
   * Check if cursor-agent CLI is available and ensure it's accessible
   */
  private async checkCursorAgentAvailable(): Promise<boolean> {
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
    console.log("🔍 Checking for cursor-agent CLI...");
    console.log("Environment: Vercel =", isVercel, "NODE_ENV =", process.env.NODE_ENV);
    console.log("CURSOR_API_KEY set:", !!process.env.CURSOR_API_KEY);
    
    // First check if it's already in PATH (local development)
    try {
      const { stdout } = await execAsync("which cursor-agent");
      if (stdout.trim().length > 0) {
        console.log("✅ cursor-agent found in PATH:", stdout.trim());
        return true;
      }
    } catch (e) {
      console.log("❌ cursor-agent not in system PATH");
    }
    
    // For Vercel, skip bin directory check and go straight to /tmp
    if (isVercel) {
      console.log("🔧 Vercel environment detected, using runtime download strategy");
      
      // Check if already downloaded to /tmp
      try {
        await execAsync("test -x /tmp/cursor-agent");
        process.env.PATH = `/tmp:${process.env.PATH}`;
        console.log("✅ cursor-agent found in /tmp (from previous run)");
        return true;
      } catch (e) {
        console.log("⚠️ cursor-agent not in /tmp, will download");
      }
      
      // Download to /tmp
      console.log("📦 Downloading cursor-agent for this serverless instance...");
      const tmpPath = await this.downloadCursorAgent();
      if (tmpPath) {
        process.env.PATH = `/tmp:${process.env.PATH}`;
        console.log("✅ cursor-agent downloaded and ready");
        return true;
      }
      
      console.error("❌ Failed to download cursor-agent");
      return false;
    }
    
    // Local development fallback: check project bin
    try {
      const { stdout } = await execAsync("test -x ./bin/cursor-agent && echo 'found' || echo 'not found'");
      if (stdout.trim() === 'found') {
        process.env.PATH = `${process.cwd()}/bin:${process.env.PATH}`;
        console.log("✅ cursor-agent found in project bin");
        return true;
      }
    } catch (e) {
      console.log("❌ cursor-agent not in project bin");
    }
    
    console.error("❌ cursor-agent not available. Please install it locally or ensure CURSOR_API_KEY is set for Vercel");
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
      const errorMsg = "Failed to access cursor-agent CLI. Please ensure:\n1. CURSOR_API_KEY environment variable is set in Vercel\n2. The build completed successfully\n3. For local development, run: curl https://cursor.com/install -fsS | bash";
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

