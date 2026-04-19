import { useCallback, useState } from "react";
import type { ChatMessage, ChatRole } from "../types/chat";
import { getAccessToken } from "@/lib/auth";
import { useAuth } from "./useAuth";

const API_URL =
  import.meta.env.VITE_API_URL || "https://shopzen-backend.onrender.com";
const MAX_CHAT_CONTENT_LENGTH = 2000;
const AI_FALLBACK_ERROR_MARKER =
  "i encountered an error processing your request";

type UnknownObject = Record<string, unknown>;

const asObject = (value: unknown): UnknownObject | null => {
  if (!value || typeof value !== "object") return null;
  return value as UnknownObject;
};

const getMessageField = (value: unknown): string | null => {
  const obj = asObject(value);
  if (!obj) return null;

  const message = obj.message;
  return typeof message === "string" ? message : null;
};

const getErrorMessage = (
  payload: unknown,
  fallback: string,
  unauthorizedFallback = "Session expired. Please login again.",
): string => {
  const message = getMessageField(payload);
  if (message) return message;
  return fallback || unauthorizedFallback;
};

const isAiFallbackMessage = (content: string): boolean =>
  content.toLowerCase().includes(AI_FALLBACK_ERROR_MARKER);

const hasAiFallbackInMessages = (messages: ChatMessage[]): boolean =>
  messages.some(
    (message) =>
      message.role === "ASSISTANT" &&
      typeof message.content === "string" &&
      isAiFallbackMessage(message.content),
  );

const normalizeRole = (role?: unknown): ChatRole => {
  const normalized = String(role || "ASSISTANT").toUpperCase();
  if (normalized === "USER") return "USER";
  if (normalized === "SYSTEM") return "SYSTEM";
  if (normalized === "TOOL") return "TOOL";
  return "ASSISTANT";
};

const toChatMessage = (message: unknown): ChatMessage | null => {
  const obj = asObject(message);
  if (!obj || typeof obj.content !== "string") {
    return null;
  }

  return {
    id: typeof obj.id === "string" ? obj.id : undefined,
    role: normalizeRole(obj.role),
    content: obj.content,
    createdAt: typeof obj.createdAt === "string" ? obj.createdAt : undefined,
  };
};

const toMessageList = (value: unknown): ChatMessage[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((message) => toChatMessage(message))
    .filter((message): message is ChatMessage => Boolean(message));
};

const pickFirstNonEmpty = (...lists: ChatMessage[][]): ChatMessage[] => {
  for (const list of lists) {
    if (list.length > 0) return list;
  }
  return [];
};

const extractMessages = (payload: unknown): ChatMessage[] => {
  if (Array.isArray(payload)) return toMessageList(payload);
  const obj = asObject(payload);
  if (!obj) return [];

  const dataObj = asObject(obj.data);
  const conversationObj = asObject(obj.conversation);

  return pickFirstNonEmpty(
    toMessageList(obj.messages),
    toMessageList(obj.history),
    toMessageList(conversationObj?.messages),
    toMessageList(dataObj?.messages),
    toMessageList(dataObj?.history),
  );
};

const extractChatPair = (payload: unknown) => {
  const obj = asObject(payload);
  const dataObj = asObject(obj?.data);

  return {
    userMessage:
      toChatMessage(obj?.userMessage) || toChatMessage(dataObj?.userMessage),
    assistantMessage:
      toChatMessage(obj?.assistantMessage) ||
      toChatMessage(dataObj?.assistantMessage),
  };
};

export const useChat = () => {
  const { logedIn } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const [aiUnavailable, setAiUnavailable] = useState(false);

  const getToken = () => getAccessToken();
  const parseJsonSafely = async (res: Response): Promise<unknown> => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const loadHistory = useCallback(async () => {
    if (!logedIn) {
      setMessages([]);
      setError("");
      setAiUnavailable(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setMessages([]);
      setError("Please login to use chat");
      setAiUnavailable(false);
      return;
    }

    setLoadingHistory(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/chat/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await parseJsonSafely(res);

      if (res.status === 401) {
        setError(
          getErrorMessage(
            payload,
            "Session expired. Please login again.",
            "Session expired. Please login again.",
          ),
        );
        setMessages([]);
        return;
      }

      if (!res.ok) {
        setError(getErrorMessage(payload, "Failed to load chat history"));
        setMessages([]);
        return;
      }

      const nextMessages = extractMessages(payload);

      setMessages(nextMessages);
      setAiUnavailable(hasAiFallbackInMessages(nextMessages));
    } catch {
      setError("Failed to load chat history");
      setMessages([]);
      setAiUnavailable(false);
    } finally {
      setLoadingHistory(false);
    }
  }, [logedIn]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) {
        setError("Message cannot be empty");
        return false;
      }
      if (trimmed.length > MAX_CHAT_CONTENT_LENGTH) {
        setError("Message must be between 1 and 2000 characters");
        return false;
      }

      if (!logedIn) {
        setError("Please login to use chat");
        return false;
      }

      const token = getToken();
      if (!token) {
        setError("Please login to use chat");
        return false;
      }

      const tempId = `temp-${Date.now()}`;
      const optimisticUser: ChatMessage = {
        id: tempId,
        role: "USER",
        content: trimmed,
      };

      setMessages((prev) => [...prev, optimisticUser]);
      setSending(true);
      setError("");

      try {
        const res = await fetch(`${API_URL}/api/v1/chat`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: trimmed }),
        });

        const payload: unknown = await parseJsonSafely(res);

        if (res.status === 401) {
          setMessages((prev) =>
            prev.filter((message) => message.id !== tempId),
          );
          setError(
            getErrorMessage(
              payload,
              "Session expired. Please login again.",
              "Session expired. Please login again.",
            ),
          );
          return false;
        }

        if (!res.ok) {
          setMessages((prev) =>
            prev.filter((message) => message.id !== tempId),
          );
          setError(getErrorMessage(payload, "Failed to send message"));
          return false;
        }

        const { userMessage: parsedUser, assistantMessage: parsedAssistant } =
          extractChatPair(payload);

        const userMessage = parsedUser || {
          role: "USER",
          content: trimmed,
        };
        const assistantMessage = parsedAssistant || {
          role: "ASSISTANT",
          content: "I could not generate a reply right now.",
        };
        const isFallbackAssistantReply = isAiFallbackMessage(
          assistantMessage.content,
        );

        setMessages((prev) => {
          const withoutTemp = prev.filter((message) => message.id !== tempId);
          return [...withoutTemp, userMessage, assistantMessage];
        });
        setAiUnavailable(isFallbackAssistantReply);
        return true;
      } catch {
        setMessages((prev) => prev.filter((message) => message.id !== tempId));
        setError("Failed to send message");
        setAiUnavailable(false);
        return false;
      } finally {
        setSending(false);
      }
    },
    [logedIn],
  );

  const clearHistory = useCallback(async () => {
    if (!logedIn) {
      setMessages([]);
      setError("");
      setAiUnavailable(false);
      return false;
    }

    const token = getToken();
    if (!token) {
      setError("Please login to use chat");
      setAiUnavailable(false);
      return false;
    }

    setClearing(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/chat/history`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await parseJsonSafely(res);

      if (res.status === 401) {
        setError(
          getErrorMessage(
            payload,
            "Session expired. Please login again.",
            "Session expired. Please login again.",
          ),
        );
        return false;
      }

      if (!res.ok) {
        setError(getErrorMessage(payload, "Failed to clear history"));
        return false;
      }

      setMessages([]);
      setAiUnavailable(false);
      return true;
    } catch {
      setError("Failed to clear history");
      return false;
    } finally {
      setClearing(false);
    }
  }, [logedIn]);

  return {
    messages,
    loadingHistory,
    sending,
    clearing,
    error,
    aiUnavailable,
    loadHistory,
    sendMessage,
    clearHistory,
  };
};
