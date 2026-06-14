import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowLeft, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { registerUser, loginUser, resendVerificationEmail, signInWithGoogle } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

/* ─── Reusable Styles ─────────────────────────────────── */
const inputStyle = {
  width: '100%',
  padding: '14px 16px 14px 48px',
  fontSize: '1rem',
  border: '2px solid var(--border)',
  borderRadius: '12px',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'all 0.2s',
  minHeight: '52px',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  fontSize: '0.95rem'
};

const iconStyle = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)'
};

/* ─── Email Verification Pending Screen ───────────────── */
const VerificationPending = ({ email, password, onBack }) => {
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [resendError, setResendError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setResendMsg('');
    setResendError('');

    const result = await resendVerificationEmail(email, password);
    if (result.success) {
      setResendMsg(result.message);
      setCooldown(60);
    } else {
      setResendError(result.error || 'Failed to resend. Please try again.');
    }
    setResending(false);
  };

  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      style={{ textAlign: 'center' }}
    >
      {/* Animated envelope icon */}
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '2px solid var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        <Mail size={36} color="var(--accent-purple)" />
      </motion.div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
        Check Your Email ✉️
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '8px' }}>
        We sent a verification link to:
      </p>
      <p style={{
        fontWeight: '700',
        color: 'var(--accent-purple)',
        fontSize: '1.05rem',
        marginBottom: '24px',
        wordBreak: 'break-all',
        padding: '10px 16px',
        background: 'var(--bg-secondary)',
        borderRadius: '10px',
        border: '1px solid var(--border)'
      }}>
        {email}
      </p>

      <div style={{
        padding: '16px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        marginBottom: '28px',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>
              Next steps:
            </p>
            <ol style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, paddingLeft: '18px', lineHeight: '1.8' }}>
              <li>Open the email from Firebase / ApnaRozgaar</li>
              <li>Click the <strong style={{ color: 'var(--text-primary)' }}>Verify Email</strong> button</li>
              <li>Return here and sign in</li>
            </ol>
          </div>
        </div>
      </div>

      {resendMsg && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(5,150,105,0.1)',
          border: '1px solid rgba(5,150,105,0.3)',
          borderRadius: '8px',
          color: 'var(--success)',
          marginBottom: '16px',
          fontSize: '0.9rem'
        }}>
          ✅ {resendMsg}
        </div>
      )}

      {resendError && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px',
          color: '#ef4444',
          marginBottom: '16px',
          fontSize: '0.9rem'
        }}>
          {resendError}
        </div>
      )}

      <button
        onClick={handleResend}
        disabled={resending || cooldown > 0}
        style={{
          width: '100%',
          padding: '14px',
          background: cooldown > 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          color: 'var(--text-primary)',
          fontWeight: '600',
          fontSize: '0.95rem',
          cursor: cooldown > 0 || resending ? 'not-allowed' : 'pointer',
          opacity: cooldown > 0 || resending ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          marginBottom: '16px'
        }}
      >
        <RefreshCw size={16} style={{ animation: resending ? 'spin 1s linear infinite' : 'none' }} />
        {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
      </button>

      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          margin: '0 auto'
        }}
      >
        <ArrowLeft size={16} />
        Back to Sign In
      </button>
    </motion.div>
  );
};

/* ─── Main AuthPage ────────────────────────────────────── */
const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [needsVerificationLogin, setNeedsVerificationLogin] = useState(false); // unverified on login attempt

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // If coming back from verification link
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccess('🎉 Email verified! You can now sign in.');
      setIsLogin(true);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  if (user && user.emailVerified) {
    navigate(userType === 'employer' ? '/employer' : '/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setNeedsVerificationLogin(false);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!isLogin && formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const result = await loginUser(formData.email, formData.password);
        if (result.success) {
          setSuccess('Welcome back! Redirecting...');
          setTimeout(() => navigate('/'), 1200);
        } else if (result.needsVerification) {
          // Show inline message + store creds for easy resend
          setNeedsVerificationLogin(true);
          setPendingEmail(formData.email);
          setPendingPassword(formData.password);
          setError(result.error);
        } else {
          setError(result.error || 'Login failed. Please try again.');
        }
      } else {
        const userData = { name: formData.name, email: formData.email };
        const result = await registerUser(formData.email, formData.password, userData, userType);
        if (result.success && result.needsVerification) {
          setPendingEmail(formData.email);
          setPendingPassword(formData.password);
          setNeedsVerification(true);
        } else if (result.success) {
          setSuccess('Account created! Redirecting...');
          setTimeout(() => navigate(userType === 'employer' ? '/employer' : '/'), 1500);
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await signInWithGoogle(userType);
      if (result.success) {
        setSuccess('Success! Redirecting...');
        setTimeout(() => navigate(userType === 'employer' ? '/employer' : '/'), 1200);
      } else {
        setError(result.error || 'Google sign-in failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-primary)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        <AnimatePresence mode="wait">
          {/* ── Verification Pending (after register) ── */}
          {needsVerification ? (
            <VerificationPending
              key="verify-pending"
              email={pendingEmail}
              password={pendingPassword}
              onBack={() => {
                setNeedsVerification(false);
                setIsLogin(true);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
            />
          ) : (
            /* ── Login / Register Form ── */
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => navigate('/')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  marginBottom: '24px',
                  fontSize: '0.95rem'
                }}
                aria-label="Go back to home"
              >
                <ArrowLeft size={18} />
                Back to Home
              </button>

              <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-purple)' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                {isLogin
                  ? 'Sign in to access your account'
                  : 'Join our inclusive employment platform'}
              </p>

              {/* User Type Selector (register only) */}
              {!isLogin && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>I am a:</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setUserType('candidate')}
                      style={{
                        flex: 1, padding: '14px', borderRadius: '12px',
                        border: `2px solid ${userType === 'candidate' ? 'var(--accent-purple)' : 'var(--border)'}`,
                        background: userType === 'candidate' ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer', fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      aria-pressed={userType === 'candidate'}
                    >
                      <User size={20} /> Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('employer')}
                      style={{
                        flex: 1, padding: '14px', borderRadius: '12px',
                        border: `2px solid ${userType === 'employer' ? 'var(--accent-teal)' : 'var(--border)'}`,
                        background: userType === 'employer' ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer', fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      aria-pressed={userType === 'employer'}
                    >
                      <Building2 size={20} /> Employer
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name (register only) */}
                {!isLogin && (
                  <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="name" style={labelStyle}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={20} style={iconStyle} />
                      <input
                        type="text" id="name" name="name"
                        value={formData.name} onChange={handleChange}
                        placeholder="Enter your full name"
                        required={!isLogin}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-purple)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={labelStyle}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} style={iconStyle} />
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-purple)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="password" style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={iconStyle} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password" name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      style={{ ...inputStyle, paddingRight: '48px' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-purple)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)', background: 'none', border: 'none',
                        cursor: 'pointer', color: 'var(--text-muted)', padding: '8px'
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (register only) */}
                {!isLogin && (
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={20} style={iconStyle} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword" name="confirmPassword"
                        value={formData.confirmPassword} onChange={handleChange}
                        placeholder="Confirm your password"
                        required={!isLogin}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--accent-purple)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div
                    role="alert"
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '10px',
                      color: '#ef4444',
                      marginBottom: '16px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div>
                      <span>{error}</span>
                      {/* Offer resend if login blocked due to unverified email */}
                      {needsVerificationLogin && (
                        <button
                          type="button"
                          onClick={() => setNeedsVerification(true)}
                          style={{
                            display: 'block',
                            marginTop: '8px',
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            padding: 0
                          }}
                        >
                          Resend verification email →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Alert */}
                {success && (
                  <div
                    role="status"
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(5,150,105,0.1)',
                      border: '1px solid rgba(5,150,105,0.3)',
                      borderRadius: '10px',
                      color: 'var(--success)',
                      marginBottom: '16px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s',
                    minHeight: '52px'
                  }}
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '12px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    border: '2px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.2s',
                    minHeight: '52px'
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--accent-purple)'; } }}
                  onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </button>
              </form>

              {/* Toggle between Login / Register */}
              <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                    setNeedsVerificationLogin(false);
                  }}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--accent-purple)', fontWeight: '600',
                    cursor: 'pointer', textDecoration: 'underline'
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AuthPage;
