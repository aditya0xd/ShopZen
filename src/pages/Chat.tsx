import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import type { ChatRole } from "../types/chat";

const roleLabel: Record<ChatRole, string> = {
  USER: "You",
  ASSISTANT: "ShopZen AI",
  SYSTEM: "System",
  TOOL: "Tool",
};

const roleStyles: Record<ChatRole, string> = {
  USER: "ml-auto bg-indigo-600 text-white",
  ASSISTANT:
    "mr-auto bg-white text-gray-900 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700",
  SYSTEM: "mr-auto bg-amber-100 text-amber-900",
  TOOL: "mr-auto bg-teal-100 text-teal-900",
};

export default function Chat() {
  const { logedIn } = useAuth();
  const {
    messages,
    loadingHistory,
    sending,
    clearing,
    error,
    aiUnavailable,
    loadHistory,
    sendMessage,
    clearHistory,
  } =
    useChat();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;

    const current = input;
    setInput("");
    const ok = await sendMessage(current);
    if (!ok) {
      setInput(current);
    }
  };

  if (!logedIn) {
    return (
      <div className="mx-auto max-w-3xl mt-12 rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          AI Assistant
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Login to chat with ShopZen AI about products, orders, and support.
        </p>
        <Link
          to="/Login"
          className="inline-block mt-6 rounded-md bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h1>
        <button
          onClick={() => void clearHistory()}
          disabled={clearing || loadingHistory}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {clearing ? "Clearing..." : "Clear History"}
        </button>
      </div>

      <div
        ref={listRef}
        className="h-[60vh] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
      >
        {loadingHistory ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading chat history...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start chatting. Try: "Recommend running shoes under 1000" or "Where is my order?"
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id || `${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${roleStyles[message.role]}`}
              >
                <p className="mb-1 text-xs opacity-80">{roleLabel[message.role]}</p>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            ))}
            {sending && (
              <div className="mr-auto max-w-[85%] rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <p className="mb-1 text-xs opacity-80">ShopZen AI</p>
                <p>Thinking...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {aiUnavailable && (
        <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
          AI is temporarily unavailable. Please try again shortly.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={2000}
          placeholder="Ask about products, orders, or support..."
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
