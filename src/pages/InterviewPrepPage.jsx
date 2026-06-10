import { motion } from 'framer-motion';
import { ExternalLink, Video, CheckCircle, BrainCircuit } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { useAuth } from '../context/AuthContext';
import PremiumLockScreen from '../components/PremiumLockScreen';

const InterviewPrepPage = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>Loading...</div>;
  }

  if (!userProfile || !userProfile.isPremium) {
    return <PremiumLockScreen featureName="AI Interview Buddy" description="Unlock real-time mocked interviews and actionable feedback with our Premium AI Interview Buddy." />;
  }

  const handleRedirect = () => {
    window.open('https://interview-buddy-v2.vercel.app/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-container" style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: 'var(--bg-dark)',
          borderRadius: '32px',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 10px 25px var(--accent-purple-glow)'
            }}
          >
            <BrainCircuit size={40} color="white" />
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            marginBottom: '20px',
            color: 'white',
            letterSpacing: '-0.02em'
          }}>
            Interview Prep Buddy
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'white',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Master your narrative with our AI-powered mock interview simulator. Get real-time feedback, practice with industry-specific questions, and boost your confidence before the real thing.
          </p>

          <AccessibleButton
            onClick={handleRedirect}
            style={{
              padding: '16px 32px',
              fontSize: '1.1rem',
              boxShadow: '0 8px 25px var(--accent-purple-glow)'
            }}
          >
            Start Practicing Now
            <ExternalLink size={20} style={{ marginLeft: '8px' }} />
          </AccessibleButton>
        </div>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'rgba(37, 99, 235, 0.05)', pointerEvents: 'none', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '50%', height: '100%', background: 'rgba(13, 148, 136, 0.05)', pointerEvents: 'none', filter: 'blur(80px)' }} />
      </motion.section>

      {/* Features Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' }}>
        {[
          { icon: <Video size={24} />, title: "Realistic Simulation", desc: "Experience a true-to-life interview environment to help reduce pre-interview anxiety." },
          { icon: <BrainCircuit size={24} />, title: "AI-Powered Feedback", desc: "Receive immediate, actionable insights on your answers, tone, and pacing." },
          { icon: <CheckCircle size={24} />, title: "Personalized Questions", desc: "Practice questions tailored specifically to your target roles and technical skills." }
        ].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="glass"
            style={{
              padding: '32px',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(124, 58, 237, 0.1)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {feat.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>{feat.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>{feat.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default InterviewPrepPage;
