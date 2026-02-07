import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: string;
  content: string;
  source_references: any;
  created_at: string;
}

interface ChatPanelProps {
  workspaceId: string;
}

const SUGGESTED_QUESTIONS = [
  "Summarize the key insights from my sources",
  "What are the main themes discussed?",
  "Find relevant quotes about...",
  "Compare information across sources",
];

export function ChatPanel({ workspaceId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workspaceId) {
      loadMessages();
    }
  }, [workspaceId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    const data = [
      {
        id: "1",
        role: "user",
        content: "What are the key insights from my sources?",
        source_references: null,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        role: "assistant",
        content: "Here are the key insights...",
        source_references: [{ filename: "doc1.pdf", page: 1 }],
        created_at: new Date().toISOString(),
      },
    ];

    setMessages(data);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    setLoading(true);
    setInput("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content,
      source_references: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: aiResponse.content,
          source_references: aiResponse.sources,
          created_at: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
      setLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string) => {
    const responses = [
      {
        content: `Based on your uploaded sources, I found relevant information about "${userMessage}". The documents indicate several key points that address your question. Would you like me to elaborate on any specific aspect?`,
        sources: [{ filename: "document.pdf", page: 3 }],
      },
      {
        content: `I've analyzed your sources regarding "${userMessage}". Here's what I found: The primary themes align with current research in this area. The evidence suggests a strong correlation between the concepts you're exploring.`,
        sources: [{ filename: "research.pdf", page: 12 }],
      },
      {
        content: `Great question! According to the sources in this workspace, particularly the documents uploaded recently, there are multiple perspectives on "${userMessage}". Let me break down the key findings for you.`,
        sources: [
          { filename: "notes.txt" },
          { filename: "presentation.pdf", slide: 5 },
        ],
      },
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Ask AI
        </h2>
      </div>

      {messages.length === 0 && (
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Suggested Questions
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center space-x-2 mb-2">
                    {/* <Sparkles className="w-4 h-4 text-blue-500" /> */}
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Assistant
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.source_references && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium mb-1 opacity-70">
                      Sources:
                    </p>
                    {Array.isArray(message.source_references) &&
                      message.source_references.map(
                        (source: any, idx: number) => (
                          <p key={idx} className="text-xs opacity-70">
                            {source.filename}
                            {source.page && ` (page ${source.page})`}
                            {source.slide && ` (slide ${source.slide})`}
                          </p>
                        ),
                      )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  AI is thinking...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask something about your sources..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
