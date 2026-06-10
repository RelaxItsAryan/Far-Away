// Authentication Context - Provides auth state across the app
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getCurrentUserProfileRTDB, logoutUser } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'candidate' or 'employer'

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      // Only treat the user as authenticated if their email is verified
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);

        // Fetch profile from Realtime Database
        let profile = await getCurrentUserProfileRTDB();
        let type = profile?.userType || 'candidate';

        setUserProfile(profile);
        setUserType(profile ? type : null);
      } else {
        setUser(null);
        setUserProfile(null);
        setUserType(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
    setUserType(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await getCurrentUserProfileRTDB();
      setUserProfile(profile);
      if (profile?.userType) {
        setUserType(profile.userType);
      }
    }
  };

  const value = {
    user,
    userProfile,
    userType,
    loading,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
    isCandidate: userType === 'candidate',
    isEmployer: userType === 'employer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
