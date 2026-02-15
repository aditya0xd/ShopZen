import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import type { ChatRole } from "../../types/chat";

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

export default function FloatingChatWidget() {
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

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!logedIn) {
      setIsOpen(false);
      setInput("");
      return;
    }

    if (isOpen) {
      void loadHistory();
    }
  }, [isOpen, loadHistory, logedIn]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending, isOpen]);

  const canSend = useMemo(
    () => isOpen && input.trim().length > 0 && !sending,
    [input, isOpen, sending],
  );

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

  if (!logedIn) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-5 sm:left-auto sm:right-5">
      {isOpen && (
        <section
          className="mb-3 ml-auto flex h-[min(70vh,560px)] w-full max-w-[380px] flex-col rounded-xl
          border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
        >
          <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ShopZen AI
            </h2>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => void clearHistory()}
                disabled={clearing || loadingHistory}
                className="inline-flex h-8 items-center whitespace-nowrap rounded-md border border-gray-300 px-2.5
                  text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50
                  dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {clearing ? "Clearing..." : "Clear"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300
                  text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-label="Close chat"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 1 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </header>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto bg-gray-50 p-3 dark:bg-gray-950/30"
          >
            {loadingHistory ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Loading history...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ask about products, orders, or support.
              </p>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={message.id || `${message.role}-${index}`}
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${roleStyles[message.role]}`}
                  >
                    <p className="mb-1 opacity-80">{roleLabel[message.role]}</p>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                ))}
                {sending && (
                  <div className="mr-auto max-w-[85%] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <p className="mb-1 opacity-80">ShopZen AI</p>
                    <p>Thinking...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {aiUnavailable && (
            <p className="border-t border-gray-200 px-3 py-2 text-xs text-amber-600 dark:border-gray-700 dark:text-amber-400">
              AI temporarily unavailable. Try again shortly.
            </p>
          )}

          {error && (
            <p className="border-t border-gray-200 px-3 py-2 text-xs text-red-500 dark:border-gray-700">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-700"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={2000}
              placeholder="Type message..."
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        AI
      </button>
    </div>
  );
}
