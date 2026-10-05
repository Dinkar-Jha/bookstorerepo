import React, { useState } from 'react';
import { X, Sparkles, Send, BookOpen, Bot, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChatMessage, Book } from '../../types/book';
import { MOCK_BOOKS } from '../../data/mockBooks';

interface AILibrarianDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialBook?: Book | null;
}

const PRESET_PROMPTS = [
  "Recommend top books for Generative AI and LLMs",
  "What is the best guide for Microservices and Distributed Systems?",
  "Show me quantum computing books with Qiskit",
  "Are there beginner books on Zero Trust Security?"
];

export const AILibrarianDrawer: React.FC<AILibrarianDrawerProps> = ({
  isOpen,
  onClose,
  initialBook
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello! I am your AI Librarian powered by IBM watsonx reasoning. Ask me for curated technical recommendations, architectural summaries, or study paths based on our catalog.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // If opened with initialBook insight
  React.useEffect(() => {
    if (initialBook) {
      const summaryMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here is the AI-generated executive synthesis for "${initialBook.title}":\n\n• ${initialBook.aiKeyTakeaways.join('\n• ')}\n\nWould you like related book recommendations in ${initialBook.category}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedBookIds: [initialBook.id]
      };
      setMessages((prev) => [...prev, summaryMsg]);
    }
  }, [initialBook]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputPrompt('');
    setIsTyping(true);

    // Simulate watsonx RAG retrieval and response
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matchedBooks: Book[] = [];
      let botResponse = "";

      if (lower.includes('generative') || lower.includes('llm') || lower.includes('watsonx') || lower.includes('ai')) {
        matchedBooks = MOCK_BOOKS.filter(b => b.category === 'Artificial Intelligence' || b.tags.includes('Generative AI'));
        botResponse = "Based on your interest in Generative AI and Foundation Models, I recommend exploring our watsonx curriculum. Here are the top rated titles:";
      } else if (lower.includes('microservice') || lower.includes('distributed') || lower.includes('cloud') || lower.includes('architecture')) {
        matchedBooks = MOCK_BOOKS.filter(b => b.category === 'Cloud & Architecture' || b.category === 'Software Engineering');
        botResponse = "For resilient system architecture and high-availability patterns, these industry benchmarks are indispensable:";
      } else if (lower.includes('quantum') || lower.includes('qiskit')) {
        matchedBooks = MOCK_BOOKS.filter(b => b.category === 'Quantum & Future Tech');
        botResponse = "Quantum synthesis is advancing rapidly. Here is our highlighted guide covering Qiskit and quantum circuits:";
      } else if (lower.includes('security') || lower.includes('zero trust')) {
        matchedBooks = MOCK_BOOKS.filter(b => b.category === 'Cybersecurity');
        botResponse = "For enterprise compliance and Zero Trust implementation, I suggest:";
      } else {
        matchedBooks = [MOCK_BOOKS[0], MOCK_BOOKS[1]];
        botResponse = `I found several highly rated titles matching "${query}" across our technical library:`;
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedBookIds: matchedBooks.map(b => b.id)
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-ibm-gray-20 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-ibm-gray-100 text-white flex items-center justify-between border-b border-ibm-gray-80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-ibm-purple-60 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                Ask AI Librarian
                <span className="text-[10px] font-mono bg-ibm-blue-60 px-1.5 py-0.2 text-white">
                  watsonx.ai
                </span>
              </h2>
              <p className="text-[11px] text-ibm-gray-30">Natural Language Semantic Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close AI Assistant"
            className="p-1.5 text-ibm-gray-30 hover:text-white hover:bg-ibm-gray-80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ibm-gray-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 bg-ibm-purple-60 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-ibm-blue-60 text-white'
                    : 'bg-white border border-ibm-gray-20 text-ibm-gray-90 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Render Recommended Book Cards */}
                {msg.recommendedBookIds && msg.recommendedBookIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-ibm-gray-20 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-ibm-gray-60 uppercase tracking-wider block">
                      Recommended Titles:
                    </span>
                    {msg.recommendedBookIds.map((bookId) => {
                      const book = MOCK_BOOKS.find((b) => b.id === bookId);
                      if (!book) return null;
                      return (
                        <Link
                          key={book.id}
                          to={`/book/${book.id}`}
                          onClick={onClose}
                          className="flex items-center gap-2.5 p-2 bg-ibm-gray-10 hover:bg-ibm-blue-10 border border-ibm-gray-20 hover:border-ibm-blue-50 transition-colors group text-left"
                        >
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-8 h-11 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-ibm-gray-100 group-hover:text-ibm-blue-60 truncate">
                              {book.title}
                            </h4>
                            <p className="text-[10px] text-ibm-gray-50 font-mono">
                              ${book.price.toFixed(2)} • {book.category}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-ibm-gray-50 group-hover:text-ibm-blue-60 flex-shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[9px] font-mono text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-ibm-gray-50'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 bg-ibm-gray-80 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-ibm-gray-50 font-mono p-2">
              <Bot className="w-4 h-4 animate-bounce text-ibm-purple-60" />
              <span>watsonx is analyzing catalog & synthesizing insights...</span>
            </div>
          )}
        </div>

        {/* Preset Prompt Chips */}
        <div className="p-3 bg-white border-t border-ibm-gray-20">
          <p className="text-[11px] font-mono text-ibm-gray-60 mb-2">Suggested Inquiries:</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] bg-ibm-gray-10 hover:bg-ibm-blue-10 text-ibm-gray-80 hover:text-ibm-blue-70 border border-ibm-gray-20 px-2 py-1 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-ibm-gray-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about our technical catalog..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-ibm-gray-10 text-xs px-3 py-2.5 border border-ibm-gray-30 focus:outline-none focus:border-ibm-blue-60"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              aria-label="Send message"
              className="p-2.5 bg-ibm-blue-60 hover:bg-ibm-blue-70 text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
