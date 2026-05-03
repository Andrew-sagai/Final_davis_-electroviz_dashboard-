import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Settings, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAIStore } from '../../store/useAIStore';
import { sendAIMessage, testConnection, FREE_MODELS } from '../../services/ai';
import { buildDashboardContext, buildCustomerContext, buildSalesContext } from '../../utils/aiContext';
import type { ChatMessage } from '../../types';

export default function AIChatWidget() {
  const { filteredData, filters } = useAppStore();
  const { 
    apiKey, setApiKey, 
    model, setModel, 
    messages, addMessage, clearMessages, 
    isChatOpen, setChatOpen, 
    isSettingsOpen, setSettingsOpen 
  } = useAIStore();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<{status: 'idle'|'testing'|'success'|'error', msg: string}>({status: 'idle', msg: ''});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isChatOpen && !isSettingsOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen, isSettingsOpen]);

  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('customers')) {
      return buildCustomerContext(filteredData, filters);
    } else if (path.includes('sales')) {
      return buildSalesContext(filteredData, filters);
    }
    return buildDashboardContext(filteredData, filters);
  };

  const getSuggestions = () => {
    const path = location.pathname;
    if (path.includes('customers')) {
      return [
        'Which segment spends the most?',
        'Is loyalty improving?',
        'Which age group buys most?'
      ];
    } else if (path.includes('sales')) {
      return [
        'Which products drive revenue?',
        'Which shipping method performs best?',
        'Explain the product revenue distribution.'
      ];
    }
    return [
      'Explain revenue trend',
      'Compare this month vs last month',
      'What is the highest performing metric?'
    ];
  };

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message || isLoading) return;
    
    setInput('');
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }

    if (filteredData.length === 0) {
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "No data available for the selected filters. Please adjust your filters to see insights.",
        timestamp: new Date(),
      });
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setIsLoading(true);

    try {
      const context = getPageContext();
      const response = await sendAIMessage(message, context, apiKey, model);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      addMessage(aiMsg);
    } catch (err) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, an error occurred communicating with the AI. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      setTestStatus({ status: 'error', msg: 'API Key required' });
      return;
    }
    setTestStatus({ status: 'testing', msg: 'Testing connection...' });
    const res = await testConnection(apiKey, model);
    if (res.success) {
      setTestStatus({ status: 'success', msg: res.message });
    } else {
      setTestStatus({ status: 'error', msg: res.message });
    }
  };

  return (
    <>
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
            <Sparkles size={24} color="#fff" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed', bottom: 24, right: 24,
              width: 420, height: 600, maxHeight: '85vh',
              background: 'rgba(10, 4, 6, 0.9)',
              backdropFilter: 'blur(35px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              display: 'flex', flexDirection: 'column',
              zIndex: 1000,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(26, 8, 14, 0.7)',
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
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Data Intelligence Assistant</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Analyzing {filteredData.length} records</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSettingsOpen(!isSettingsOpen)}
                  style={{
                    background: isSettingsOpen ? 'rgba(255, 42, 75, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid var(--glass-border)',
                    borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-primary)',
                  }}
                >
                  <Settings size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setChatOpen(false)}
                  style={{
                    background: 'rgba(255, 42, 75, 0.1)', border: '1px solid var(--glass-border)',
                    borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-primary)',
                  }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              
              {/* Settings Panel */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(10, 4, 6, 0.95)', zIndex: 10,
                      padding: '20px', overflowY: 'auto',
                    }}
                  >
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)', fontSize: 16 }}>AI Configuration</h3>
                    
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>OpenRouter API Key</label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--glass-border)', borderRadius: 8, padding: '10px',
                          color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Model</label>
                      <select 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)}
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--glass-border)', borderRadius: 8, padding: '10px',
                          color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                        }}
                      >
                        {FREE_MODELS.map((m) => (
                          <option key={m.id} style={{ background: '#1a080e', color: '#fff' }} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                        <option disabled style={{ background: '#1a080e', color: '#888' }}>──────────</option>
                        <option style={{ background: '#1a080e', color: '#fff' }} value="anthropic/claude-3-haiku">Claude 3 Haiku (Paid)</option>
                        <option style={{ background: '#1a080e', color: '#fff' }} value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Paid)</option>
                      </select>
                    </div>



                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                      <button 
                        onClick={handleTestConnection}
                        disabled={testStatus.status === 'testing'}
                        style={{
                          flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)',
                          borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                      >
                        {testStatus.status === 'testing' ? <RefreshCw size={14} className="spin" /> : 'Test Connection'}
                      </button>
                    </div>

                    {testStatus.status !== 'idle' && (
                      <div style={{
                        padding: '10px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
                        background: testStatus.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        color: testStatus.status === 'success' ? '#10b981' : '#f43f5e',
                        border: `1px solid ${testStatus.status === 'success' ? '#10b981' : '#f43f5e'}`
                      }}>
                        {testStatus.status === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        {testStatus.msg}
                      </div>
                    )}

                    <div style={{ marginTop: 30 }}>
                      <button onClick={clearMessages} style={{
                        width: '100%', background: 'transparent', border: '1px solid rgba(244, 63, 94, 0.5)',
                        borderRadius: 8, padding: '10px', color: '#f43f5e', fontSize: 13, cursor: 'pointer'
                      }}>
                        Clear Chat History
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages */}
              <div style={{ height: '100%', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {!apiKey && messages.length === 0 && !isSettingsOpen && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: 12, border: '1px dashed rgba(244, 63, 94, 0.2)' }}>
                    <AlertCircle size={32} color="#f43f5e" style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>API Key Required</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Please configure your OpenRouter API key in settings to start analyzing data.</div>
                    <button onClick={() => setSettingsOpen(true)} style={{ background: 'var(--accent-1)', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Open Settings</button>
                  </div>
                )}

                {apiKey && messages.length === 0 && !isSettingsOpen && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(255, 42, 75, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Sparkles size={28} color="var(--accent-1)" />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      Data Intelligence Ready
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
                      I have analyzed {filteredData.length} records. Ask me anything.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 10px' }}>
                      {getSuggestions().map((prompt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSend(prompt)}
                          style={{
                            background: 'rgba(255, 42, 75, 0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 12, padding: '10px 14px',
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

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{msg.content}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 6, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div className="chat-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={14} className="spin" color="var(--accent-1)" />
                      <div className="typing-dots">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Footer */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex', gap: 10, alignItems: 'center',
              background: 'rgba(10, 4, 6, 0.9)', zIndex: 1
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={apiKey ? "Ask about the dashboard data..." : "Configure API key first..."}
                disabled={isLoading || !apiKey}
                style={{
                  flex: 1, background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12, padding: '12px 16px',
                  color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                  fontFamily: 'var(--font-sans)', caretColor: 'var(--accent-1)',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim() || !apiKey}
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: (input.trim() && apiKey) ? 'var(--gradient-red-gold)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)', cursor: (input.trim() && apiKey) ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  opacity: (input.trim() && apiKey) ? 1 : 0.5
                }}
              >
                <Send size={18} color="#fff" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
