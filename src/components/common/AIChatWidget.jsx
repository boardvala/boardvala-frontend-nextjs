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

  function formatLine(line) {
    // Phone number ला clickable link बनवा
    const phoneRegex = /(\+91[\s-]?\d{10}|\d{10})/g;
    const parts = line.split(phoneRegex);

    return parts.map((part, i) => {
      if (phoneRegex.test(part)) {
        phoneRegex.lastIndex = 0;
        const clean = part.replace(/[\s-]/g, "");
        return (
          <a
            key={i}
            href={`tel:${clean}`}
            style={{ color: "inherit", fontWeight: 600, textDecoration: "underline" }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
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
                  <span key={j}>{formatLine(line)}<br /></span>
                ))}
                {msg.role === "bot" && msg.text.includes("8788736288") && (
                  <a
                    href="https://wa.me/918788736288?text=Hi%20BoardVala%2C%20I%20need%20help%20with%20a%20product"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aic-whatsapp-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.522-.809-6.243-2.163l-.436-.348-3.2 1.072 1.072-3.2-.348-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                    Chat on WhatsApp
                  </a>
                )}
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

      {/* Greeting Bubble */}
      {!open && (
        <div className="aic-greeting">
          Hi! I'm BoardBuddy 👋 How may I assist you?
          <button className="aic-greeting-close" onClick={(e) => { e.stopPropagation(); document.querySelector('.aic-greeting').style.display = 'none'; }}>✕</button>
        </div>
      )}
      {/* Floating Button */}
      <button className={`aic-fab ${open ? "aic-fab-hidden" : ""}`} onClick={() => setOpen(true)} aria-label="Chat with AI">
        🤖
      </button>
    </>
  );
}