"use client";

import { useState, useEffect, useRef } from "react";
import "../../styles/ai-chat-widget.css";

const API = process.env.NEXT_PUBLIC_API_URL;

function generateSessionId() {
  return "s_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! 👋 I'm BoardBuddy, your AI Assistant from BoardVala. How can I help you today?\n\nYou can ask me about:\n• Name plates & signage\n• Materials & pricing\n• Custom designs\n• Order related queries",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Connection error. Please try again or contact us on WhatsApp: +91 8788736288" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Chat Window */}
      <div className={`aic-window ${open ? "aic-open" : ""}`}>
        {/* Header */}
        <div className="aic-header">
          <div className="aic-header-info">
            <div className="aic-header-info">
              <div className="aic-avatar">
                🤖
              </div>
              <div>
                <div className="aic-header-name">BoardBuddy <span style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.7 }}>from BoardVala</span></div>
                <div className="aic-header-status">
                  <span className="aic-status-dot"></span> AI Assistance
                </div>
              </div>
            </div>
          </div>
          <button className="aic-close" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="aic-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`aic-msg ${msg.role === "user" ? "aic-msg-user" : "aic-msg-bot"}`}>
              {msg.role === "bot" && (
                <div className="aic-msg-avatar">
                  🤖
                </div>
              )}
              <div className="aic-msg-bubble">
                {msg.text.split("\n").map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="aic-msg aic-msg-bot">
              <div className="aic-msg-avatar">
                🤖
              </div>
              <div className="aic-msg-bubble aic-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="aic-input-area">
          <input
            ref={inputRef}
            type="text"
            className="aic-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button className="aic-send" onClick={handleSend} disabled={loading || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>

        {/* Footer */}
        <div className="aic-footer">Powered by BoardBuddy AI</div>
      </div>

      {/* Floating Button */}
      <button className={`aic-fab ${open ? "aic-fab-hidden" : ""}`} onClick={() => setOpen(true)} aria-label="Chat with AI">
        🤖
      </button>
    </>
  );
}