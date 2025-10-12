"use server";

import { queryAgent, AgentResponse } from "@/lib/agent-wrapper";

export const sendMessage = async (message: string): Promise<AgentResponse> => {
  try {
    // Query the cursor agent
    const response = await queryAgent(message);
    return response;
  } catch (error) {
    console.error("Error in sendMessage:", error);

    // Return error response
    return {
      componentType: "text",
      data: null,
      textResponse: "Sorry, I encountered an error processing your request. Please try again.",
    };
  }
};
