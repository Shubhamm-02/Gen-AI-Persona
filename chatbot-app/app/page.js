"use client";

import { useState, useRef, useEffect } from "react";
import { personas } from "@/lib/prompts";

export default function Home() {
  const [activePersona, setActivePersona] = useState("anshuman");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const persona = personas[activePersona];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activePersona]);

  const switchPersona = (key) => {
    if (key === activePersona) return;
    setActivePersona(key);
    setMessages([]);
    setError(null);
    setInput("");
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMessage = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          persona: activePersona,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      setMessages([...updatedMessages, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">ScalerMind</h1>
          <span className="header-label">Persona Chat</span>
        </div>
      </header>

      {/* Persona Tabs */}
      <nav className="persona-nav">
        <div className="persona-tabs">
          {Object.entries(personas).map(([key, p]) => (
            <button
              key={key}
              id={`persona-tab-${key}`}
              className={`persona-tab ${activePersona === key ? "active" : ""}`}
              onClick={() => switchPersona(key)}
            >
              <span className="persona-tab-name">{p.name}</span>
              <span className="persona-tab-role">{p.role}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Active Persona Banner */}
      <div className="persona-banner">
        <div className="persona-banner-inner">
          <div className="persona-indicator"></div>
          <div>
            <span className="persona-banner-name">{persona.name}</span>
            <span className="persona-banner-tagline">{persona.tagline}</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <main className="chat-area">
        {messages.length === 0 && !isLoading ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <p className="empty-state-title">
                Start a conversation with {persona.name}
              </p>
              <p className="empty-state-subtitle">
                {persona.tagline}
              </p>
              <div className="suggestion-chips">
                {persona.chips.map((chip, i) => (
                  <button
                    key={i}
                    id={`chip-${activePersona}-${i}`}
                    className="chip"
                    onClick={() => sendMessage(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.role === "user" ? "message-user" : "message-assistant"}`}
              >
                {msg.role === "assistant" && (
                  <div className="message-author">{persona.name}</div>
                )}
                <div className={`message-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message message-assistant">
                <div className="message-author">{persona.name}</div>
                <div className="bubble-assistant typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="input-area">
        <form className="input-form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            id="chat-input"
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${persona.name} something...`}
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            id="send-button"
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <p className="input-disclaimer">
          Responses are AI-generated. Not the real person.
        </p>
      </footer>
    </div>
  );
}
