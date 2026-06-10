import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Edit3, LogOut, Star, Shield, Settings, ChevronRight, BookOpen, Clock, CheckCircle, Loader2, Crown, FileCheck, AlertCircle, Send } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { useAuth } from '../context/AuthContext';
import { getCandidateProfile, updateCertificationStatus } from '../firebase/candidates';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, userProfile, userType, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationPending, setVerificationPending] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);
  const [certificatePhoto, setCertificatePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    getCandidateProfile(user.uid).then(r => {
      const profileData = r.success ? r.data : userProfile;
      setProfile(profileData);
      setVerificationPending(profileData?.certificationStatus === 'pending');
      setLoading(false);
    });
  }, [user, authLoading, userProfile]);

  // Handle certificate verification request
  const handleVerificationRequest = async () => {
    if (!user || !profile) return;
    if (!certificatePhoto) {
      setPhotoError('Please upload a certificate photo first');
      return;
    }
    
    setVerificationSubmitting(true);
    try {
      // Update profile to mark verification as pending
      const updateResult = await updateCertificationStatus(user.uid, 'pending', photoPreview);
      
      if (updateResult.success) {
        setVerificationPending(true);
        setShowVerificationMessage(true);
        setCertificatePhoto(null);
        setPhotoPreview(null);
        
        // Create mailto link to send email to team
        const teamEmail = 'relaxitsaryan@gmail.com'; // Replace with actual team email
        const subject = encodeURIComponent(`Certificate Verification Request - ${profile.name || user.displayName}`);
        const body = encodeURIComponent(
          `Hello,\n\n` +
          `I am submitting my certificate for PWD verification.\n\n` +
          `User Details:\n` +
          `Name: ${profile.name || user.displayName}\n` +
          `Email: ${user.email}\n` +
          `User ID: ${user.uid}\n\n` +
          `Please find the certificate photo attached.\n\n` +
          `Thank you,\n${profile.name || user.displayName}`
        );
        
        // Open mailto link
        window.location.href = `mailto:${teamEmail}?subject=${subject}&body=${body}`;
        
        // Auto-hide message after 6 seconds
        setTimeout(() => setShowVerificationMessage(false), 6000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to submit verification request. Please try again.');
    } finally {
      setVerificationSubmitting(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size must be less than 5MB');
      return;
    }

    setPhotoError('');
    setCertificatePhoto(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // Not logged in
  if (!authLoading && !isAuthenticated) return (
    <div style={{ maxWidth:'560px', margin:'100px auto', padding:'0 24px', textAlign:'center' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <div style={{ width:'96px', height:'96px', borderRadius:'50%', margin:'0 auto 28px', background:'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(20,184,166,0.15))', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <User size={42} color="var(--accent-purple)" />
        </div>
        <h1 style={{ fontSize:'1.8rem', marginBottom:'12px' }}>Sign in to view your profile</h1>
        <p style={{ color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'28px' }}>Build your profile, save jobs, and get matched with accessible employers.</p>
        <AccessibleButton onClick={() => navigate('/auth')} style={{ fontSize:'1rem', padding:'0 36px', minHeight:'52px' }}>Sign In / Create Account</AccessibleButton>
      </motion.div>
    </div>
  );

  if (loading || authLoading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh', flexDirection:'column', gap:'12px', color:'var(--text-muted)' }}>
      <Loader2 size={36} style={{ animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <p>Loading your profile…</p>
    </div>
  );

  const name = profile?.name || userProfile?.name || user?.displayName || 'User';
  const email = profile?.email || user?.email || '';
  const phone = profile?.phone || '';
  const city = profile?.city || '';
  const state = profile?.state || '';
  const skills = profile?.skills || [];
  const disabilities = Array.isArray(profile?.disabilityType) ? profile.disabilityType : profile?.disabilityType ? [profile.disabilityType] : [];
  const accommodations = profile?.accommodations || [];
  const workMode = profile?.workPreference || '';
  const expLevel = profile?.experienceLevel || '';
  const industries = profile?.industries || [];
  const hasProfile = !!(skills.length || city || disabilities.length);
  const joined = profile?.createdAt || userProfile?.createdAt;

  const card = { padding:'24px', borderRadius:'18px', background:'var(--bg-secondary)', border:'1px solid var(--border)' };
  const sectionTitle = { fontSize:'1rem', fontWeight:'700', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' };

  return (
    <div style={{ maxWidth:'960px', margin:'0 auto', padding:'36px 24px 80px' }}>

      {/* ── Hero Card ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ ...card, marginBottom:'28px', position:'relative', overflow:'hidden' }}>
        {/* Gradient banner */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'110px', background:'linear-gradient(135deg,rgba(139,92,246,0.14),rgba(20,184,166,0.1))', borderRadius:'18px 18px 0 0' }} />

        <div style={{ position:'relative', display:'flex', gap:'24px', alignItems:'flex-end', flexWrap:'wrap' }}>
          {/* Avatar */}
          <div style={{ width:'90px', height:'90px', borderRadius:'50%', background:'var(--primary-gradient)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', fontWeight:'800', flexShrink:0, border:'4px solid var(--bg-primary)', boxShadow:'var(--card-shadow-hover)' }}>
            {name.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex:1, minWidth:'180px' }}>
            <h1 style={{ fontSize:'1.8rem', marginBottom:'6px' }}>{name}</h1>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'14px', color:'var(--text-muted)', fontSize:'0.88rem', marginBottom:'14px' }}>
              {email && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Mail size={13}/>{email}</span>}
              {phone && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Phone size={13}/>{phone}</span>}
              {(city||state) && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin size={13}/>{[city,state].filter(Boolean).join(', ')}</span>}
            </div>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {profile?.isPremium && (
                <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(255,215,0,0.15)', color:'#FFD700', display:'flex', alignItems:'center', gap:'4px' }}>
                  <Crown size={12}/> Premium Member
                </span>
              )}
              <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(5,150,105,0.1)', color:'var(--success)', display:'flex', alignItems:'center', gap:'4px' }}>
                <CheckCircle size={12}/> Email Verified
              </span>
              {profile?.certificationStatus === 'verified' && (
                <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(59,130,246,0.1)', color:'#3b82f6', display:'flex', alignItems:'center', gap:'4px' }}>
                  <FileCheck size={12}/> Certificate Verified
                </span>
              )}
              {profile?.certificationStatus === 'pending' && (
                <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(249,115,22,0.1)', color:'#f97316', display:'flex', alignItems:'center', gap:'4px' }}>
                  <AlertCircle size={12}/> Verification Pending
                </span>
              )}
              {userType && <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(139,92,246,0.1)', color:'var(--accent-purple)', textTransform:'capitalize' }}>{userType}</span>}
              {workMode && <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(20,184,166,0.1)', color:'var(--accent-teal)', textTransform:'capitalize' }}>{workMode}</span>}
            </div>
          </div>

          <div style={{ display:'flex', gap:'8px' }}>
            <AccessibleButton variant="outline" onClick={() => navigate('/profile/create')} style={{ fontSize:'0.85rem', padding:'0 14px', minHeight:'38px' }}>
              <Edit3 size={14}/> {hasProfile ? 'Edit' : 'Complete Profile'}
            </AccessibleButton>
            <AccessibleButton variant="ghost" onClick={async () => { await logout(); navigate('/'); }} style={{ fontSize:'0.85rem', padding:'0 14px', minHeight:'38px', color:'#ef4444' }}>
              <LogOut size={14}/> Sign Out
            </AccessibleButton>
          </div>
        </div>
      </motion.div>

      {/* Complete profile prompt */}
      {!hasProfile && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }} style={{ ...card, marginBottom:'28px', textAlign:'center', border:'2px dashed var(--accent-purple)', background:'rgba(139,92,246,0.04)' }}>
          <h2 style={{ color:'var(--accent-purple)', marginBottom:'8px' }}>Complete Your Profile</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:'20px', maxWidth:'480px', margin:'0 auto 20px' }}>Add your skills and preferences so employers can match you with accessible jobs.</p>
          <AccessibleButton onClick={() => navigate('/profile/create')}>Build My Profile <ChevronRight size={16}/></AccessibleButton>
        </motion.div>
      )}

      {/* Info grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px' }}>

        {/* Skills */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }} style={card}>
          <p style={sectionTitle}><Star size={18} color="var(--accent-purple)"/> Skills</p>
          {skills.length > 0 ? (
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {skills.map(s => <span key={s} style={{ padding:'5px 14px', borderRadius:'20px', fontSize:'0.83rem', fontWeight:'700', background:'var(--primary-gradient)', color:'white' }}>{s}</span>)}
            </div>
          ) : <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>No skills added yet.</p>}
        </motion.div>

        {/* Work Preferences */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }} style={card}>
          <p style={sectionTitle}><Briefcase size={18} color="var(--accent-teal)"/> Work Preferences</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', fontSize:'0.9rem' }}>
            {[['Work Mode', workMode],['Experience', expLevel]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'8px' }}>
                <span style={{ color:'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight:'600', textTransform:'capitalize' }}>{v || '—'}</span>
              </div>
            ))}
            {industries.length > 0 && (
              <div>
                <span style={{ color:'var(--text-muted)', fontSize:'0.85rem', display:'block', marginBottom:'8px' }}>Industries</span>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {industries.map(i => <span key={i} style={{ padding:'3px 12px', borderRadius:'14px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(20,184,166,0.1)', color:'var(--accent-teal)' }}>{i}</span>)}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Accessibility */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={card}>
          <p style={sectionTitle}><Shield size={18} color="var(--success)"/> Accessibility Needs</p>
          {disabilities.length > 0 ? (
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'14px' }}>
              {disabilities.map(d => <span key={d} style={{ padding:'5px 12px', borderRadius:'14px', fontSize:'0.82rem', fontWeight:'600', background:'rgba(5,150,105,0.1)', color:'var(--success)' }}>{d}</span>)}
            </div>
          ) : <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'10px' }}>Not specified.</p>}
          {accommodations.length > 0 && (
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
              {accommodations.map(a => <span key={a} style={{ padding:'3px 10px', borderRadius:'12px', fontSize:'0.78rem', fontWeight:'600', background:'rgba(139,92,246,0.08)', color:'var(--accent-purple)' }}>{a}</span>)}
            </div>
          )}
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }} style={card}>
          <p style={sectionTitle}><Settings size={18} color="var(--text-muted)"/> Account</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', fontSize:'0.9rem' }}>
            {[
              ['Email', email],
              ['Verified', '✓ Yes'],
              ['Account Type', userType || 'Candidate'],
              ['Joined', joined ? new Date(joined).toLocaleDateString('en-IN',{month:'short',year:'numeric'}) : '—']
            ].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'8px' }}>
                <span style={{ color:'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight:'600', color: l==='Verified'?'var(--success)':'var(--text-primary)', textTransform: l==='Account Type'?'capitalize':'none', maxWidth:'60%', textAlign:'right', wordBreak:'break-all' }}>{v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certificate Verification */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }} style={card}>
          <p style={sectionTitle}><FileCheck size={18} color={verificationPending ? '#f97316' : profile?.certificationStatus === 'verified' ? '#3b82f6' : 'var(--text-muted)'}/> Certificate Verification</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {profile?.certificationStatus === 'verified' ? (
              <div style={{ padding:'12px', borderRadius:'12px', background:'rgba(59,130,246,0.08)', borderLeft:'4px solid #3b82f6' }}>
                <p style={{ color:'#3b82f6', fontWeight:'600', fontSize:'0.9rem', margin:'0 0 4px 0' }}>✓ Verified</p>
                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', margin:0 }}>Your certificate has been verified by our team.</p>
              </div>
            ) : verificationPending ? (
              <div style={{ padding:'12px', borderRadius:'12px', background:'rgba(249,115,22,0.08)', borderLeft:'4px solid #f97316' }}>
                <p style={{ color:'#f97316', fontWeight:'600', fontSize:'0.9rem', margin:'0 0 4px 0' }}>⏳ Verification Pending</p>
                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', margin:0 }}>Your verification request is being reviewed. We'll notify you soon.</p>
              </div>
            ) : (
              <>
                <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', margin:0 }}>Verify your credentials with our team to build trust and get better opportunities.</p>
                
                {/* Photo Upload Section */}
                <div style={{ padding:'16px', borderRadius:'12px', background:'rgba(139,92,246,0.05)', border:'2px dashed var(--accent-purple)' }}>
                  <p style={{ fontSize:'0.85rem', fontWeight:'600', marginBottom:'12px', color:'var(--text-primary)' }}>📸 Upload Certificate Photo</p>
                  
                  {photoPreview ? (
                    <div style={{ marginBottom:'12px' }}>
                      <img 
                        src={photoPreview} 
                        alt="Certificate preview" 
                        style={{ maxHeight:'120px', borderRadius:'8px', marginBottom:'8px', display:'block' }}
                      />
                      <div style={{ display:'flex', gap:'8px' }}>
                        <AccessibleButton 
                          onClick={() => document.getElementById('photoInput')?.click()}
                          style={{ flex:1, fontSize:'0.8rem', padding:'0 8px', minHeight:'32px' }}
                        >
                          Change Photo
                        </AccessibleButton>
                        <AccessibleButton 
                          variant="outline"
                          onClick={() => { setCertificatePhoto(null); setPhotoPreview(null); setPhotoError(''); }}
                          style={{ flex:1, fontSize:'0.8rem', padding:'0 8px', minHeight:'32px' }}
                        >
                          Remove
                        </AccessibleButton>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => document.getElementById('photoInput')?.click()}
                      style={{ 
                        padding:'24px', 
                        borderRadius:'8px', 
                        background:'var(--bg-primary)',
                        textAlign:'center',
                        cursor:'pointer',
                        transition:'all 0.2s',
                        border:'1px solid var(--border)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                    >
                      <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', margin:0 }}>Click to upload certificate photo</p>
                      <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', margin:'4px 0 0 0' }}>JPG, PNG up to 5MB</p>
                    </div>
                  )}
                  
                  <input
                    id="photoInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display:'none' }}
                    aria-label="Upload certificate photo"
                  />

                  {photoError && (
                    <p style={{ color:'#ef4444', fontSize:'0.8rem', marginTop:'8px', margin:'8px 0 0 0' }}>⚠️ {photoError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <AccessibleButton 
                  onClick={handleVerificationRequest}
                  disabled={verificationSubmitting || !certificatePhoto}
                  style={{ fontSize:'0.85rem', padding:'0 16px', minHeight:'38px', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', opacity: !certificatePhoto ? 0.6 : 1, cursor: !certificatePhoto ? 'not-allowed' : 'pointer' }}
                >
                  {verificationSubmitting ? (
                    <>
                      <Loader2 size={14} style={{ animation:'spin 1s linear infinite' }} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Submit for Verification
                    </>
                  )}
                </AccessibleButton>
                <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:'8px 0 0 0', textAlign:'center' }}>Must upload a photo to submit verification request</p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Verification Success Message */}
      {showVerificationMessage && (
        <motion.div 
          initial={{ opacity:0, y:-20 }} 
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-20 }}
          style={{
            position:'fixed',
            top:'80px',
            left:'50%',
            transform:'translateX(-50%)',
            zIndex:9999,
            maxWidth:'480px',
            width:'90vw'
          }}
        >
          <div style={{
            padding:'16px 20px',
            borderRadius:'12px',
            background:'var(--success)',
            color:'white',
            boxShadow:'0 8px 24px var(--accent-teal-glow)',
            backdropFilter:'blur(10px)',
            display:'flex',
            alignItems:'center',
            gap:'12px'
          }}>
            <CheckCircle size={20} style={{ flexShrink:0 }} />
            <div>
              <p style={{ fontWeight:'700', margin:'0 0 2px 0' }}>Verification Request Submitted</p>
              <p style={{ margin:0, fontSize:'0.85rem', opacity:0.95 }}>Our team will verify your certificate within a few hours. We'll send you an email once the review is complete.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px', marginTop:'28px' }}>
        {[
          { to:'/jobs', icon:<Briefcase size={26} color="var(--accent-purple)"/>, title:'Browse Jobs', sub:'Find accessible opportunities' },
          { to:'/resume-builder', icon:<BookOpen size={26} color="var(--accent-teal)"/>, title:'AI Resume', sub:'Build your resume with AI' },
          { to:'/interview-prep', icon:<Clock size={26} color="var(--success)"/>, title:'Interview Prep', sub:'Practice with AI' }
        ].map(item => (
          <Link key={item.to} to={item.to} style={{ textDecoration:'none' }}>
            <motion.div whileHover={{ y:-4, boxShadow:'0 12px 36px rgba(0,0,0,0.1)' }} transition={{ type:'spring', stiffness:300 }}
              style={{ ...card, textAlign:'center', cursor:'pointer' }}>
              <div style={{ marginBottom:'10px' }}>{item.icon}</div>
              <p style={{ fontWeight:'700', fontSize:'0.95rem', marginBottom:'4px' }}>{item.title}</p>
              <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', margin:0 }}>{item.sub}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
