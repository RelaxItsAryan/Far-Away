import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InterviewPrepPage.css';

const InterviewPrepPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('tech');
  const [level, setSelectedLevel] = useState('mid');

  const toggleRole = (selectedRole) => {
    setRole(selectedRole);
  };

  const setLevel = (selectedLevel) => {
    setSelectedLevel(selectedLevel);
  };

  const handleStartPractice = () => {
    navigate('/interview-prep/session');
  };

  return (
    <div className="prep-page-shell">
      <header className="prep-topbar">
        <div className="prep-brand">
          <img
            alt="Interview Prep Buddy Logo"
            className="prep-brand-logo"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCteNaEGRvf_-gH_1ir-xiHUb1NOc6fBh29notWWjnlwsCPzEfszaSzkmwPLiSUjQn5TzCPtfkObZUT0e0G7_-ShpLKo24Q18_5jYaFrHyus_XSuAaNp7P7g6twguLxPeEDOtyg_OL0kej6PCgPIDJMy_mUGVqzzJ1d5AgbeaSbWl3oRaqYBAqqCIGbpHA8GOFmNZ8BvkR8vYNpsHd6Sc8KIN2mYhDT-TBwV-C184aPZXpnO-5I4MqkEQ"
          />
          <h1 className="prep-brand-title">Interview Prep Buddy</h1>
        </div>

        <div className="prep-topbar-actions">
          <button aria-label="Accessibility Settings" className="prep-icon-btn prep-icon-btn-with-text" type="button">
            <span className="material-symbols-outlined" aria-hidden="true">settings_accessibility</span>
            <span className="prep-hide-mobile">Accessibility</span>
          </button>
          <button aria-label="High Contrast Mode" className="prep-icon-btn" type="button">
            <span className="material-symbols-outlined" aria-hidden="true">contrast</span>
          </button>
        </div>
      </header>

      <main className="prep-main">
        <div className="prep-content-wrap">
          <section className="prep-intro">
            <h2>Let&apos;s set up your practice</h2>
            <p>Choose your career path and experience level to personalize your interview questions.</p>
          </section>

          <section className="prep-section">
            <h3>Step 1: Choose Your Role Type</h3>
            <div className="prep-role-grid">
              <button
                className={`prep-role-card ${role === 'tech' ? 'prep-role-card-active card-active' : ''}`}
                id="tech-card"
                onClick={() => toggleRole('tech')}
                type="button"
              >
                <span className="material-symbols-outlined prep-role-icon prep-role-icon-fill" aria-hidden="true">terminal</span>
                <h4>Technical Roles</h4>
                <p>Software Engineer, Data Science, Product Design, and more.</p>
              </button>

              <button
                className={`prep-role-card ${role === 'non-tech' ? 'prep-role-card-active card-active' : ''}`}
                id="non-tech-card"
                onClick={() => toggleRole('non-tech')}
                type="button"
              >
                <span className="material-symbols-outlined prep-role-icon prep-role-icon-fill" aria-hidden="true">groups</span>
                <h4>Non-Technical Roles</h4>
                <p>Customer Success, Marketing, HR, and Sales.</p>
              </button>
            </div>
          </section>

          <section className="prep-section">
            <h3>Step 2: Experience Level</h3>
            <div className="prep-level-pills" role="radiogroup" aria-label="Experience Level">
              <button
                className={`prep-level-pill ${level === 'entry' ? 'prep-level-pill-active pill-active' : ''}`}
                id="lvl-entry"
                onClick={() => setLevel('entry')}
                role="radio"
                aria-checked={level === 'entry'}
                type="button"
              >
                Entry Level
              </button>
              <button
                className={`prep-level-pill ${level === 'mid' ? 'prep-level-pill-active pill-active' : ''}`}
                id="lvl-mid"
                onClick={() => setLevel('mid')}
                role="radio"
                aria-checked={level === 'mid'}
                type="button"
              >
                Mid-Level
              </button>
              <button
                className={`prep-level-pill ${level === 'senior' ? 'prep-level-pill-active pill-active' : ''}`}
                id="lvl-senior"
                onClick={() => setLevel('senior')}
                role="radio"
                aria-checked={level === 'senior'}
                type="button"
              >
                Senior / Lead
              </button>
            </div>
          </section>

          <section className="prep-cta-wrap">
            <button className="prep-start-btn" onClick={handleStartPractice} type="button">
              <span>Start Practice Session</span>
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
            <p className="prep-privacy-note">
              <span className="material-symbols-outlined prep-note-icon" aria-hidden="true">lock</span>
              Your progress is saved automatically
            </p>
          </section>
        </div>
      </main>

      <footer className="prep-footer">
        <div className="prep-footer-inner">
          <span>© 2024 Interview Prep Buddy. Built for accessibility.</span>
          <div className="prep-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InterviewPrepPage;
