import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { sendAIMessage } from '../../services/ai';
import { generateDataSummary } from '../../utils/analytics';
import type { ChatMessage } from '../../types';

const SUGGESTED_PROMPTS = [
  '📊 Give me a sales overview',
  '🏆 What are the top products?',
  '📈 Explain the revenue trend',
  '👥 Customer demographics insights',
  '💳 Payment method analysis',
  '🎖️ Loyalty program insights',
];

export default function AIChatWidget() {
  const { isChatOpen, setChatOpen, chatMessages, addChatMessage, isChatLoading, setChatLoading, filteredData, filters } = useAppStore();
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message || isChatLoading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    addChatMessage(userMsg);
    setChatLoading(true);

    try {
      const summary = generateDataSummary(filteredData, filters);
      const response = await sendAIMessage(message, summary, apiKey);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      addChatMessage(aiMsg);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
      };
      addChatMessage(errorMsg);
    } finally {
      setChatLoading(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('openrouter_api_key', apiKey);
    setShowKeyInput(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatOpen(true)}
            className="chat-float-btn pulse-ring"
          >
            <MessageCircle size={24} color="#fff" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed', bottom: 24, right: 24,
              width: 400, height: 560, maxHeight: '80vh',
              background: 'rgba(10, 4, 6, 0.85)',
              backdropFilter: 'blur(35px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              display: 'flex', flexDirection: 'column',
              zIndex: 1000,
              boxShadow: 'var(--shadow-hover)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(26, 8, 14, 0.5)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'var(--gradient-red-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Analytics Assistant</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Powered by {apiKey ? 'OpenRouter' : 'Local AI'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  title="API Key"
                  style={{
                    background: 'rgba(255, 42, 75, 0.1)', border: 'none',
                    borderRadius: 6, padding: 6, cursor: 'pointer', color: 'var(--text-secondary)',
                  }}
                >
                  <Zap size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setChatOpen(false)}
                  style={{
                    background: 'rgba(255, 42, 75, 0.1)', border: 'none',
                    borderRadius: 6, padding: 6, cursor: 'pointer', color: 'var(--text-secondary)',
                  }}
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            {/* API Key Input */}
            <AnimatePresence>
              {showKeyInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ padding: '10px 16px', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}
                >
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>
                    OpenRouter API Key (optional — works without it)
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-or-..."
                      style={{
                        flex: 1, background: 'rgba(10, 4, 6, 0.8)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 6, padding: '6px 10px',
                        color: 'var(--text-primary)', fontSize: 11, outline: 'none',
                      }}
                    />
                    <button onClick={saveApiKey} style={{
                      background: 'var(--gradient-red-gold)',
                      border: 'none', borderRadius: 6, padding: '6px 12px',
                      color: '#fff', fontSize: 11, cursor: 'pointer', fontWeight: 600,
                    }}>
                      Save
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Sparkles size={32} color="var(--accent-1)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    Ask me about your data
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>
                    I analyze the currently filtered dataset in real-time
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(prompt)}
                        style={{
                          background: 'rgba(255, 42, 75, 0.05)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 10, padding: '8px 14px',
                          color: 'var(--text-secondary)', fontSize: 12,
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isChatLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div className="chat-bubble ai">
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your data..."
                disabled={isChatLoading}
                style={{
                  flex: 1, background: 'rgba(10, 4, 6, 0.8)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12, padding: '10px 14px',
                  color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                  fontFamily: 'var(--font-sans)', caretColor: 'var(--accent-1)',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                disabled={isChatLoading || !input.trim()}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: input.trim() ? 'var(--gradient-red-gold)' : 'rgba(10, 4, 6, 0.8)',
                  border: '1px solid var(--glass-border)', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <Send size={16} color={input.trim() ? '#fff' : '#64748b'} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
