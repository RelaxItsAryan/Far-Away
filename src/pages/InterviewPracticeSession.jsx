import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InterviewPracticeSession.css';

const QUESTIONS = [
  'Tell me about a project where you had to manage changing requirements.',
  'Describe a situation where you resolved a disagreement in your team.',
  'How do you prioritize work when multiple stakeholders have urgent requests?',
  'Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder. What was your approach?',
  'What metrics do you use to evaluate whether your solution was successful?',
  'Describe a failure you experienced and what you changed afterward.',
  'How do you ensure quality when delivery timelines are tight?',
  'Tell me about a time you had to learn a new tool very quickly.',
  'How do you handle feedback that you disagree with?',
  'Describe a cross-functional initiative where you took ownership.',
  'How do you communicate risks to leadership?',
  'What does success in this role look like in the first 90 days?'
];

const TOTAL_QUESTIONS = 12;

const InterviewPracticeSession = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('video');
  const [showSignLanguage, setShowSignLanguage] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(3);

  const progress = Math.round(((questionIndex + 1) / TOTAL_QUESTIONS) * 100);

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % TOTAL_QUESTIONS);
  };

  return (
    <div className="session-page-shell">
      <header className="session-topbar">
        <div className="session-topbar-inner">
          <h1>Interview Prep Buddy</h1>
          <div className="session-topbar-actions">
            <button aria-label="Accessibility Settings" className="focus-ring session-icon-btn" type="button">
              <span className="material-symbols-outlined">settings_accessibility</span>
            </button>
            <button aria-label="Voice Over Settings" className="focus-ring session-icon-btn" type="button">
              <span className="material-symbols-outlined">record_voice_over</span>
            </button>
            <button
              className="focus-ring session-exit-btn"
              onClick={() => navigate('/interview-prep')}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
              Exit Session
            </button>
          </div>
        </div>
      </header>

      <main className="session-main-grid">
        <section className="session-left-col">
          <div className="session-coach-badge">
            <span className="material-symbols-outlined session-icon-filled">graphic_eq</span>
            <span>AI Coach is listening / analyzing</span>
          </div>

          <div className="session-question-card ambient-shadow">
            <div className="session-question-strip" />
            <h2>Question {questionIndex + 1} of {TOTAL_QUESTIONS}</h2>
            <p>{`"${QUESTIONS[questionIndex]}"`}</p>
            <div className="session-question-actions">
              <button className="focus-ring session-primary-btn" type="button">
                <span className="material-symbols-outlined">volume_up</span>
                Listen to Question
              </button>
              <button
                className={`focus-ring session-secondary-btn ${showSignLanguage ? 'session-sign-active' : ''}`}
                id="toggle-sign-lang"
                onClick={() => setShowSignLanguage((prev) => !prev)}
                type="button"
              >
                <span className="material-symbols-outlined">sign_language</span>
                Sign Language View
              </button>
            </div>
          </div>

          {showSignLanguage && (
            <div className="session-sign-video ambient-shadow" id="sign-lang-video">
              <div className="session-sign-overlay">
                <div
                  className="session-sign-image"
                  role="img"
                  aria-label="A professional sign language interpreter against a neutral studio background with high-visibility gestures."
                />
              </div>
              <div className="session-sign-tag">ASL Interpreter</div>
            </div>
          )}

          <div className="session-progress-card">
            <div className="session-progress-head">
              <span>Session Progress</span>
              <strong>{progress}%</strong>
            </div>
            <div className="session-progress-track">
              <div className="session-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <section className="session-right-col ambient-shadow">
          <div className="session-tabs">
            <button
              className={`focus-ring session-tab-btn ${activeTab === 'video' ? 'session-tab-active' : ''}`}
              id="tab-video"
              onClick={() => setActiveTab('video')}
              type="button"
            >
              <span className="material-symbols-outlined">videocam</span>
              Video Recording
            </button>
            <button
              className={`focus-ring session-tab-btn ${activeTab === 'text' ? 'session-tab-active' : ''}`}
              id="tab-text"
              onClick={() => setActiveTab('text')}
              type="button"
            >
              <span className="material-symbols-outlined">edit_note</span>
              Text Input
            </button>
          </div>

          <div className="session-panel-content">
            {activeTab === 'video' && (
              <div className="session-video-panel" id="video-panel">
                <div className="session-video-frame">
                  <div className="session-video-image" role="img" aria-label="Webcam preview with sign-language detection overlay." />
                  <div className="session-detection-pill">
                    <span className="material-symbols-outlined session-icon-filled-small">check_circle</span>
                    Sign Detection Active
                  </div>
                  <div className="session-live-caption">
                    &quot;When I worked at the design firm, I used visual prototypes to explain API structures...&quot;
                  </div>
                </div>

                <div className="session-video-controls">
                  <button className="focus-ring session-control-btn" type="button">
                    <span className="material-symbols-outlined">refresh</span>
                    <span>Re-record</span>
                  </button>
                  <button
                    className={`focus-ring session-control-btn ${isRecording ? 'session-recording recording-pulse' : 'session-paused'}`}
                    id="record-btn"
                    onClick={() => setIsRecording((prev) => !prev)}
                    type="button"
                  >
                    <span className="material-symbols-outlined">{isRecording ? 'pause' : 'play_arrow'}</span>
                    <span>{isRecording ? 'Pause' : 'Resume'}</span>
                  </button>
                  <button className="focus-ring session-control-btn session-next-btn" id="next-btn" onClick={handleNextQuestion} type="button">
                    <span className="material-symbols-outlined">arrow_forward</span>
                    <span>Next Question</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="session-text-panel" id="text-panel">
                <div className="session-text-group">
                  <label htmlFor="response-text">Your Transcript / Response</label>
                  <textarea
                    className="focus-ring"
                    id="response-text"
                    placeholder="Start typing or use the microphone to dictate your answer..."
                  />
                  <p>Tip: Use structured points to make your answer more memorable.</p>
                </div>
                <div className="session-text-actions">
                  <button className="focus-ring session-secondary-solid" type="button">
                    <span className="material-symbols-outlined">mic</span>
                    Speak-to-Text
                  </button>
                  <button className="focus-ring session-primary-btn-large" onClick={() => navigate('/interview-prep/review')} type="button">
                    Submit &amp; Next
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="session-footer">
        <div className="session-footer-inner">
          <span>© 2024 Interview Prep Buddy. Built for accessibility.</span>
          <nav>
            <a className="focus-ring" href="#">Support</a>
            <a className="focus-ring" href="#">Transcript Downloads</a>
            <a className="focus-ring" href="#">Privacy Policy</a>
            <a className="focus-ring" href="#">Accessibility Statement</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default InterviewPracticeSession;