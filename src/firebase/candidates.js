// Candidate-related Realtime Database operations
import {
  ref,
  get,
  set,
  update,
  serverTimestamp
} from 'firebase/database';
import { rtdb } from './config';

const COLLECTION = 'users';

// Create/Update candidate profile
export const saveCandidateProfile = async (uid, profileData) => {
  try {
    const userRef = ref(rtdb, `${COLLECTION}/${uid}`);
    
    // First get existing to preserve stuff
    const snapshot = await get(userRef);
    const existing = snapshot.exists() ? snapshot.val() : {};

    await update(userRef, {
      ...existing,
      ...profileData,
      userType: 'candidate',
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get candidate profile by ID
export const getCandidateProfile = async (uid) => {
  try {
    const userRef = ref(rtdb, `${COLLECTION}/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, data: { ...snapshot.val(), id: uid } };
    }
    return { success: false, error: 'Profile not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all candidates (for employers)
export const getAllCandidates = async () => {
  try {
    const usersRef = ref(rtdb, COLLECTION);
    const snapshot = await get(usersRef);
    const candidates = [];
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).forEach(uid => {
        if (data[uid].userType === 'candidate') {
          candidates.push({ ...data[uid], id: uid });
        }
      });
    }
    
    return { success: true, data: candidates };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Search candidates by skills
export const searchCandidatesBySkills = async (skills) => {
  try {
    const usersRef = ref(rtdb, COLLECTION);
    const snapshot = await get(usersRef);
    const candidates = [];
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).forEach(uid => {
        const user = data[uid];
        if (user.userType === 'candidate' && user.skills && Array.isArray(user.skills)) {
          // Check if user has any of the requested skills
          const hasSkill = skills.some(skill => user.skills.includes(skill));
          if (hasSkill) {
            candidates.push({ ...user, id: uid });
          }
        }
      });
    }
    
    return { success: true, data: candidates };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update certification verification status
export const updateCertificationStatus = async (uid, status, photoBase64 = null) => {
  // status: 'pending', 'verified', 'rejected'
  try {
    const userRef = ref(rtdb, `${COLLECTION}/${uid}`);
    
    const updateData = {
      certificationStatus: status,
      certificationRequestedAt: status === 'pending' ? serverTimestamp() : undefined,
      certificationVerifiedAt: status === 'verified' ? serverTimestamp() : undefined,
    };

    // Store photo reference if provided (note: for large files, consider Firebase Storage)
    if (photoBase64 && status === 'pending') {
      updateData.certificationPhotoProvided = true;
    }

    await update(userRef, updateData);
    
    return { success: true, message: `Certification status updated to ${status}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Candidate Profile Schema Example:
/*
{
  uid: "firebase-user-id",
  name: "John Doe",
  email: "john@example.com",
  skills: ["JavaScript", "React", "Node.js"],
  disabilityType: "visual", // visual, hearing, mobility, cognitive
  assistiveTech: ["screen reader", "voice input"],
  workPreference: "remote", // remote, onsite, hybrid
  accommodations: "Flexible hours, screen reader compatible tools",
  experience: "3 years in web development",
  createdAt: "2026-03-31T10:00:00.000Z",
  updatedAt: "2026-03-31T10:00:00.000Z"
}
*/
