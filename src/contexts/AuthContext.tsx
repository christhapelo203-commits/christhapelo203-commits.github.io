import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  type User 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getDocument, setDocument } from '../services/db';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockUser, setMockUser] = useState<{ uid: string; email: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userProfile = await getDocument<UserProfile>('users', user.uid);
          if (userProfile) {
            setProfile(userProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else if (!mockUser) {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [mockUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const existingProfile = await getDocument<UserProfile>('users', user.uid);
      if (!existingProfile) {
        let role: UserRole = 'student';
        if (email.includes('teacher')) role = 'teacher';
        if (email.includes('admin')) role = 'admin';
        if (email.includes('parent')) role = 'parent';

        const newProfile: UserProfile = {
          id: user.uid,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: user.email || '',
          role: role,
          school_id: 'EduTrack',
          createdAt: new Date().toISOString(),
        };
        await setDocument('users', user.uid, newProfile);
        setProfile(newProfile);
      } else {
        setProfile(existingProfile);
      }
    } catch (error: any) {
      // IF Email/Password is disabled or User not found, use Mock Mode for this demo
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/user-not-found' || error.message.includes('operation-not-allowed')) {
        console.warn('Firebase Email/Password Auth is disabled or restricted. Entering Mock Mode.');
        
        const mockUid = `mock_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const mockSessionUser = { uid: mockUid, email: email };
        
        let role: UserRole = 'student';
        if (email.includes('teacher')) role = 'teacher';
        if (email.includes('admin')) role = 'admin';
        if (email.includes('parent')) role = 'parent';

        const profileData: UserProfile = {
          id: mockUid,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: email,
          role: role,
          school_id: 'EduTrack',
          createdAt: new Date().toISOString(),
        };

        try {
          const cloudProfile = await getDocument<UserProfile>('users', mockUid);
          if (cloudProfile) {
            setProfile(cloudProfile);
          } else {
            await setDocument('users', mockUid, profileData);
            setProfile(profileData);
          }
        } catch (dbErr) {
          setProfile(profileData);
        }

        setMockUser(mockSessionUser);
        setUser(mockSessionUser as any);
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out failed, clearing local state');
    }
    setMockUser(null);
    setUser(null);
    setProfile(null);
  };

  const updateRole = async (role: UserRole) => {
    if (user && profile) {
      const updatedProfile = { ...profile, role };
      await setDocument('users', user.uid, updatedProfile);
      setProfile(updatedProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
