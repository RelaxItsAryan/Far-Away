import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, User, Bot, Loader2, Mail, Phone, MapPin, Globe, Briefcase, NotebookText, Mic, MicOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGroqResumeExtraction } from '../services/groqService';
// import aiResumeUiImage from '../assets/ai_resume_ui.png';
import { useAuth } from '../context/AuthContext';
import PremiumLockScreen from '../components/PremiumLockScreen';
import { useVoiceControl } from '../useVoiceControl';

const ResumeBuilder = () => {
  const { userProfile, loading } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! 👋 I'm your AI Resume Assistant. I'm here to help you build an incredible resume. Let's start with the basics! What is your full name?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    error: voiceError,
    isSupported: isVoiceSupported
  } = useVoiceControl({
    onResult: (text) => {
      // Append text with a space if there's already content
      setInputValue(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${text}` : text;
      });
    }
  });

  // Sync interim results for live visual feedback in the input field
  // but don't commit them to the final input state yet
  const displayValue = isListening && interimTranscript 
    ? (inputValue.trim() ? `${inputValue.trim()} ${interimTranscript}` : interimTranscript)
    : inputValue;

  useEffect(() => {
    if (voiceError) {
      console.error("Voice Error:", voiceError);
    }
  }, [voiceError]);

  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    role: "",
    summary: "",
    skills: [],
    education: [],
    experience: [],
    projects: []
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>Loading...</div>;
  }

  if (!userProfile || !userProfile.isPremium) {
    return <PremiumLockScreen featureName="AI Resume Maker" description="Instantly generate structured, professional resumes from conversation using our Premium AI model." />;
  }

  // Extract JSON from response text
  const extractJsonFromResponse = (text) => {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return {
          cleanText: text.replace(jsonMatch[0], '').trim(),
          data: parsed
        };
      } catch (err) {
        console.error("Failed to parse JSON from AI response:", err);
      }
    }
    return { cleanText: text, data: null };
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare history for Groq
      const history = newMessages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const responseText = await getGroqResumeExtraction(userMessage.text, history.slice(0, -1));

      if (responseText) {
        const { cleanText, data } = extractJsonFromResponse(responseText);

        if (data) {
          setResumeData(prev => ({
            ...prev,
            ...data
          }));
        }

        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: cleanText,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        const errorReponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: "Oops, I encountered an issue. Can you repeat that?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorReponse]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      paddingTop: '24px',
      paddingBottom: '24px',
      paddingLeft: '24px',
      paddingRight: '24px',
      display: 'flex',
      background: 'var(--bg-primary)',
      gap: '24px',
      flexWrap: 'wrap',
      position: 'relative',
    }}>
      {/* Background glowing effects */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* LEFT PANEL: Chat Interface */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          flex: '1 1 400px',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          minHeight: '600px',
          maxHeight: 'calc(100vh - 120px)'
        }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: 'var(--primary-gradient)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px var(--accent-purple-glow)'
          }}>
            <NotebookText size={20} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>AI Resume Builder</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interactive CV Generation</p>
          </div>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: 'flex',
              gap: '12px',
              flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end'
            }}>
              <div style={{
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                background: msg.type === 'user' ? 'var(--accent-purple)' : 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {msg.type === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="var(--accent-blue)" />}
              </div>
              <div style={{
                background: msg.type === 'user' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomRightRadius: msg.type === 'user' ? 0 : '16px',
                borderBottomLeftRadius: msg.type === 'bot' ? 0 : '16px',
                color: msg.type === 'user' ? 'white' : 'var(--text-primary)',
                fontSize: '0.95rem',
                border: msg.type === 'bot' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                maxWidth: '80%',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{
                minWidth: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Loader2 size={16} color="var(--accent-blue)" className="spinner" />
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)', padding: '12px 16px',
                borderRadius: '16px', borderBottomLeftRadius: 0,
                color: 'var(--text-muted)', fontSize: '0.9rem'
              }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {voiceError && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               style={{ 
                 color: '#f87171', 
                 fontSize: '0.8rem', 
                 marginBottom: '10px', 
                 padding: '8px', 
                 background: 'rgba(239, 68, 68, 0.1)', 
                 borderRadius: '8px',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '8px'
               }}
             >
               <AlertCircle size={14} /> {voiceError}
             </motion.div>
          )}
          
          <div style={{
            display: 'flex',
            gap: '12px',
            background: 'rgba(0,0,0,0.2)',
            border: isListening ? '1px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '8px',
            transition: 'border-color 0.3s ease'
          }}>
            <input
              type="text"
              value={displayValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isListening ? "Listening... (Talk now)" : (!isVoiceSupported ? "Voice not supported" : "Type or speak your answer...")}
              disabled={!isVoiceSupported && !inputValue}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'white',
                padding: '8px 12px',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            
            <button
              onClick={toggleListening}
              disabled={!isVoiceSupported}
              title={!isVoiceSupported ? "Voice not supported in this browser" : (isListening ? "Stop Listening" : "Start Voice Input")}
              style={{
                background: isListening ? 'var(--danger)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isVoiceSupported ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                opacity: isVoiceSupported ? 1 : 0.5
              }}
            >
              {isListening && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '50%'
                  }}
                />
              )}
              {isListening ? <MicOff size={18} color="white" /> : <Mic size={18} color={isVoiceSupported ? "var(--text-muted)" : "#444"} />}
            </button>

            <button
              onClick={() => {
                if (isListening) stopListening();
                sendMessage();
              }}
              disabled={isTyping || (!inputValue.trim() && !interimTranscript)}
              style={{
                background: 'var(--primary-gradient)',
                border: 'none',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: isTyping || (!inputValue.trim() && !interimTranscript) ? 0.5 : 1
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
          {isVoiceSupported && !isListening && !inputValue && (
            <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Tip: Click the mic and tell me about your projects or skills!
            </p>
          )}
        </div>
      </motion.div>

      {/* RIGHT PANEL: Live Preview Formatter */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          flex: '1 1 500px',
          background: 'rgba(252, 252, 255, 0.8)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
          zIndex: 1,
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          minHeight: '600px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          position: 'relative'
        }}
        className="resume-preview-container"
      >
        {/* Helper image inside preview background optionally if form empty */}
        {(!resumeData.name && !resumeData.summary && resumeData.skills.length === 0) && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '20px', zIndex: 0, opacity: 0.2
          }}>
            {/* <img src={aiResumeUiImage} alt="AI Resume Template" style={{ width: '80%', borderRadius: '12px', filter: 'grayscale(50%)' }} /> */}
            <p style={{ color: 'white', fontSize: '1.2rem', textAlign: 'center' }}>Chat with the AI to generate your beautiful resume.</p>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header / Contact */}
          <div style={{ borderBottom: '2px solid rgba(139, 92, 246, 0.3)', paddingBottom: '24px', marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '3rem',
              margin: '0 0 8px 0',
              fontFamily: "'Outfit', sans-serif",
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {resumeData.name || 'YOUR NAME'}
            </h1>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-blue)', margin: '0 0 16px 0', fontWeight: 500 }}>
              {resumeData.role || 'Professional Title'}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {resumeData.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {resumeData.email}</div>}
              {resumeData.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {resumeData.phone}</div>}
              {resumeData.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {resumeData.location}</div>}
              {resumeData.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={14} /> {resumeData.linkedin}</div>}
            </div>
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{resumeData.summary}</p>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <NotebookText size={16} color="var(--accent-purple)" /> Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {resumeData.skills.map((skill, idx) => (
                  <span key={idx} style={{
                    padding: '6px 12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    color: 'var(--accent-purple)',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} color="var(--accent-blue)" /> Experience
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingLeft: '16px', borderLeft: '2px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
                      <h4 style={{ margin: '0 0 4px', color: 'white', fontSize: '1rem' }}>{exp.title}</h4>
                      <h5 style={{ margin: '0 0 8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>{exp.company} {exp.duration ? `| ${exp.duration}` : ''}</h5>
                      {exp.description && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="var(--accent-purple)" /> Education
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingLeft: '16px', borderLeft: '2px solid rgba(139, 92, 246, 0.2)' }}>
                      <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
                      <h4 style={{ margin: '0 0 4px', color: 'white', fontSize: '1rem' }}>{edu.degree}</h4>
                      <h5 style={{ margin: '0 0 8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>{edu.school} {edu.year ? `| ${edu.year}` : ''}</h5>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <NotebookText size={16} color="var(--success)" /> Projects
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ margin: '0 0 8px', color: 'white', fontSize: '0.95rem' }}>{proj.title}</h4>
                    {proj.description && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeBuilder;
