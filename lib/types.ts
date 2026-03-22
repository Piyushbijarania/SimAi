export type ChatRole = "user" | "assistant";

export type AssistantStatus =
  | "generating"
  | "ready"
  | "error"
  | "cancelled";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  status?: AssistantStatus;
  errorText?: string;
}

export type SimulationCategory =
  | "Physics"
  | "CS"
  | "Biology"
  | "Finance"
  | "Math";
