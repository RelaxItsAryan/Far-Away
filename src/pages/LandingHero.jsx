import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, Eye, Bot, FileText, Mic, Briefcase, Settings, Target, Building, Home, Heart, ExternalLink } from 'lucide-react';
import { AccessibleButton } from '../App';
import heroImg from '../assets/premium_hero_bg.png';
import interview from '../assets/interview.jpg';
import interview1 from '../assets/laughing.jpg';
import interview2 from '../assets/work.jpg';

const SLIDES = [
  {
    src: interview,
    alt: 'interview'
  },
  {
    src: interview1,
    alt: 'happy person'
  },
  {
    src: interview2,
    alt: 'working employee'
  },
];

function Dots({ total, current, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          style={{
            width: i === current ? '12px' : '5px',
            height: '5px',
            borderRadius: '999px',
            background: i === current ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ))}
    </div>
  );
}

export default function LandingHero() {
  const [current, setCurrent] = useState(0);
  const { scrollY } = useScroll();

  // Transform scroll position (0 to 600px) to blur amount (0 to 12px)
  const blurAmount = useTransform(scrollY, [0, 600], ['blur(0px)', 'blur(12px)']);
  // Optionally dim the background slightly as we scroll
  const backgroundDim = useTransform(scrollY, [0, 600], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Fixed Background Layer with Scroll Blur */}
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `var(--hero-gradient), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          zIndex: -1,
          filter: blurAmount,
        }}
      />

      {/* Subtle Dark Overlay that increases on scroll */}
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          background: backgroundDim,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />

      {/* ── Hero Section ── */}
      <section
        className="hero-section"
        aria-labelledby="hero-heading"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '120px 24px 60px',
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            flexWrap: 'wrap',
          }}
        >
          {/* ── LEFT: Text ── */}
          <div style={{ flex: '1 1 45%', minWidth: '300px', position: 'relative', zIndex: 10 }}>


            <motion.h1
              variants={itemVariants}
              id="hero-heading"
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
                fontWeight: '800',
                marginBottom: '24px',
                color: 'var(--text-primary)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
              }}
            >
              Find <span className="text-gradient" >Work</span> That
              <br />
              <span className="text-gradient">Works For You</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-muted)',
                marginBottom: '40px',
                maxWidth: '500px',
                lineHeight: '1.7',
              }}
            >
              {' '}
              <strong style={{ color: 'var(--text-primary)' }}>Connecting highly talented professionals with disabilities to employers who value true inclusion. 500+ accessible roles.</strong>
            </motion.p>

            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
              <Link to="/jobs" style={{ textDecoration: 'none' }}>
                <AccessibleButton
                  style={{
                    minHeight: '54px',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    padding: '0 32px',
                  }}
                  aria-label="Browse all accessible job listings"
                >
                  Browse Jobs
                </AccessibleButton>
              </Link>
              <Link to="/employer" style={{ textDecoration: 'none' }}>
                <AccessibleButton
                  variant="outline"
                  style={{
                    minHeight: '54px',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    padding: '0 32px',
                    background: 'var(--bg-primary)',
                  }}
                  aria-label="View employer dashboard and post jobs"
                >
                  I'm an Employer
                </AccessibleButton>
              </Link>
            </motion.div>


          </div>

          {/* ── RIGHT: Image Carousel ── */}
          <motion.div
            variants={itemVariants}
            style={{
              flex: '1 1 40%',
              minWidth: '280px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Card */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(124,58,237,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                aspectRatio: '4/3',
                background: '#ede9fe',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={SLIDES[current].src}
                  alt={SLIDES[current].alt}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </AnimatePresence>

              {/* Bottom label overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '32px 20px 16px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
                  color: 'white',
                }}
              >
                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600' }}>
                  {SLIDES[current].alt}
                </p>
              </div>
            </div>

            {/* Dots */}
            <Dots total={SLIDES.length} current={current} onSelect={setCurrent} />

          </motion.div>
        </motion.div>
      </section>

      {/* ── All Sections Below Hero with Grain Background ── */}
      <div className="grain-bg" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Platform Features Section ── */}
        <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem' }}>
              Explore Platform
            </p>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', margin: '20px 0 0', lineHeight: '1.1', color: 'var(--text-primary)' }}>
              Comprehensive Tools for Your Success
            </h2>
            <p style={{ maxWidth: '700px', margin: '24px auto 0', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
              Discover features specifically tailored to empower individuals with disabilities, ensuring an inclusive, efficient, and seamless job-seeking journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Bot size={28} color="var(--accent-purple)" />
              </div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>AI Chatbot Assistant</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
                Enjoy a hands-free, accessible browsing experience with our intelligent 24/7 chatbot ready to assist you anytime.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <FileText size={28} color="#2563EB" />
              </div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>AI Resume Builder</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
                Craft professional, ATS-friendly resumes effortlessly using our AI builder designed to highlight your unique strengths.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Target size={28} color="var(--accent-teal)" />
              </div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>Interactive Interview Prep</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
                Practice with realistic, AI-powered mock interviews to boost your confidence and ace your next big opportunity.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Briefcase size={28} color="#F59E0B" />
              </div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>Accessible Job Board</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
                Browse and apply for roles easily on a smart platform tailored natively for screen readers and mobility needs.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Mic size={28} color="#EC4899" />
              </div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>Voice Navigation</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
                Navigate the entire platform hands-free using intuitive voice commands designed for maximum accessibility.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Settings size={28} color="#10B981" />
              </div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>Personalized Accessibility Tools</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
                Customize your visual and motor experience instantly with our comprehensive built-in accessibility menu.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── About Section (unchanged) ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem' }}>
              Our Commitment
            </p>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', margin: '20px 0 0', lineHeight: '1.1' }}>
              Empowering careers through true accessibility
            </h2>
            <p style={{ maxWidth: '700px', margin: '24px auto 0', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              ApnaRozgaar bridges talent and inclusive employers, creating accessible job experiences from application to interview. We believe opportunity should be built for every ability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '28px', background: 'var(--card-bg)', borderRadius: '22px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <ShieldCheck size={24} color="var(--accent-purple)" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Verified Inclusive Employers</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Employers are vetted for real accessibility practices so you can apply with confidence.
              </p>
            </div>

            <div style={{ padding: '28px', background: 'var(--card-bg)', borderRadius: '22px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Eye size={24} color="var(--accent-teal)" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Screen Reader Native</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Every component is tested against JAWS, NVDA, and VoiceOver to ensure a smooth experience.
              </p>
            </div>

            <div style={{ padding: '28px', background: 'var(--card-bg)', borderRadius: '22px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,223,93,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Zap size={24} color="#F59E0B" />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem' }}>Built for Speed</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Fast, responsive job search and application tools that work across assistive technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Government Facilities Section ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Government Schemes & Facilities
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Official resources and support programs designed to empower and assist persons with disabilities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

            {/* Delhi Government Schemes */}
            <a
              href="https://discomm.delhi.gov.in/discomm/schemes-and-facilities-persons-disabilities"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', padding: '32px', background: 'var(--card-bg)', borderRadius: '24px',
                boxShadow: 'var(--card-shadow)', border: '1px solid var(--border)', transition: 'all 0.3s ease', textDecoration: 'none', color: 'inherit'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = 'var(--accent-purple)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Building size={28} color="#2563EB" />
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Delhi State Facilities
                <ExternalLink size={18} color="var(--text-muted)" />
              </h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>
                Explore various official schemes, concessions, and facilities provided by the State Commissioner for Persons with Disabilities, Delhi.
              </p>
            </a>

            {/* Gharaunda Scheme */}
            <a
              href="https://nationaltrust.nic.in/gharaunda-scheme/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', padding: '32px', background: 'var(--card-bg)', borderRadius: '24px',
                boxShadow: 'var(--card-shadow)', border: '1px solid var(--border)', transition: 'all 0.3s ease', textDecoration: 'none', color: 'inherit'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = 'var(--accent-purple)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Home size={28} color="#10B981" />
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Gharaunda Scheme
                <ExternalLink size={18} color="var(--text-muted)" />
              </h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>
                Group Home and Rehabilitation Activities providing supported living for adults with autism, cerebral palsy, mental retardation, and multiple disabilities.
              </p>
            </a>

            {/* Niramaya Scheme */}
            <a
              href="http://nationaltrust.nic.in/scheme/niramaya-scheme/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', padding: '32px', background: 'var(--card-bg)', borderRadius: '24px',
                boxShadow: 'var(--card-shadow)', border: '1px solid var(--border)', transition: 'all 0.3s ease', textDecoration: 'none', color: 'inherit'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = 'var(--accent-purple)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Heart size={28} color="#EF4444" />
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Niramaya Scheme
                <ExternalLink size={18} color="var(--text-muted)" />
              </h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>
                A comprehensive Health Insurance Scheme providing affordable health insurance coverage to persons with disabilities nationwide.
              </p>
            </a>

          </div>
        </div>
      </section>
      </div>
    </div>
  );
}