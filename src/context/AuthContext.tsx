import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { User, UserRole } from '../types';

export type { User, UserRole };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; user: User }>;
  loginWithGoogle: (email?: string, name?: string) => Promise<User>;
  demoStaffLogin: () => User;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateMinecraftAccount: (username: string, edition?: 'Java' | 'Bedrock') => Promise<void>;
  uploadProfilePicture: (base64Image: string) => Promise<string>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  switchRoleForTesting: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEFAULT_ADMIN_USER: User = {
  id: 'usr-admin-1',
  email: 'admin@ironcloudmc.fun',
  name: 'Iron Cloud Administrator',
  picture: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
  role: 'OWNER',
  minecraftUsername: 'MR_DOOM_YT',
  minecraftUuid: 'd8b27dfc-4570-4f51-b844-0c58a5e84dfa',
  minecraftEdition: 'Java',
  isMinecraftVerified: true,
  bio: 'Founder and Lead Administrator of the Iron Cloud MC Network.',
  discord: 'ironcloud#0001',
  phone: '01821925430',
  joinedAt: '2024-01-01T00:00:00.000Z',
  avatarSource: 'upload',
};

// Strips out multi-megabyte base64 strings before saving to localStorage to prevent QuotaExceededError
function getSafeUserForStorage(u: User): Partial<User> {
  const safe: Partial<User> = { ...u };
  if (safe.picture && safe.picture.startsWith('data:') && safe.picture.length > 20000) {
    safe.picture = undefined;
  }
  if (safe.avatarUrl && safe.avatarUrl.startsWith('data:') && safe.avatarUrl.length > 20000) {
    safe.avatarUrl = undefined;
  }
  return safe;
}

function saveUserToLocalStorage(u: User | null) {
  if (!u) {
    try {
      localStorage.removeItem('ironcloud_user');
    } catch {
      // ignore
    }
    return;
  }

  try {
    const safe = getSafeUserForStorage(u);
    localStorage.setItem('ironcloud_user', JSON.stringify(safe));
  } catch (quotaError) {
    console.warn('Storage quota exceeded on primary write, attempting stripped fallback:', quotaError);
    try {
      const minimal: Partial<User> = {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        minecraftUsername: u.minecraftUsername,
        minecraftEdition: u.minecraftEdition,
        isMinecraftVerified: u.isMinecraftVerified,
      };
      localStorage.setItem('ironcloud_user', JSON.stringify(minimal));
    } catch (innerErr) {
      console.warn('Failed even minimal user storage save:', innerErr);
      try {
        localStorage.removeItem('ironcloud_user');
      } catch {
        // ignore
      }
    }
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ironcloud_user');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_USER;
    } catch {
      return DEFAULT_ADMIN_USER;
    }
  });

  useEffect(() => {
    saveUserToLocalStorage(user);
  }, [user]);

  // Sync fresh profile from server if email is available (e.g. restores uploaded avatar if omitted from localStorage)
  useEffect(() => {
    if (user?.email) {
      api.getProfile({ email: user.email })
        .then((serverUser) => {
          if (serverUser && (serverUser.avatarUrl || serverUser.name)) {
            setUser((prev) => {
              if (!prev) return serverUser;
              return {
                ...prev,
                ...serverUser,
                avatarUrl: serverUser.avatarUrl || prev.avatarUrl,
                picture: serverUser.avatarUrl || serverUser.picture || prev.picture,
              };
            });
          }
        })
        .catch(() => {
          // Offline / not reachable
        });
    }
  }, [user?.email]);

  const login = (newUser: User) => {
    const cleanEmail = newUser.email.toLowerCase();
    if (cleanEmail.includes('piratessmp2') || cleanEmail.includes('admin') || cleanEmail.includes('ironcloud')) {
      newUser.role = 'OWNER';
    }
    setUser(newUser);
  };

  const loginWithCredentials = async (email: string, password: string): Promise<{ success: boolean; user: User }> => {
    try {
      const res = await api.loginWithCredentials(email, password);
      const authenticatedUser: User = {
        ...res.user,
        picture: res.user.avatarUrl || res.user.picture,
      };
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (err: any) {
      // Offline fallback for admin credentials in case of network issue
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail === 'admin@ironcloudmc.fun' || cleanEmail === 'piratessmp2@gmail.com';
      const validPass = ['Admin@IronCloud2026', 'admin123', 'ironcloud123'].some(
        (p) => p.toLowerCase() === password.trim().toLowerCase()
      );

      if (isAdmin && validPass) {
        const fallbackAdmin: User = {
          ...DEFAULT_ADMIN_USER,
          email: cleanEmail,
          name: cleanEmail.includes('pirate') ? 'Pirates SMP Admin' : 'Iron Cloud Administrator',
          role: 'OWNER',
        };
        setUser(fallbackAdmin);
        return { success: true, user: fallbackAdmin };
      }
      throw err;
    }
  };

  const loginWithGoogle = async (customEmail?: string, customName?: string): Promise<User> => {
    const targetEmail = customEmail || 'piratessmp2@gmail.com';
    const targetName = customName || 'Iron Cloud Founder';
    const cleanEmail = targetEmail.toLowerCase();
    const isOwner = cleanEmail.includes('piratessmp2') || cleanEmail.includes('ironcloud') || cleanEmail.includes('admin');

    const googleUser: User = {
      id: `usr-google-${Date.now()}`,
      email: targetEmail,
      name: targetName,
      role: isOwner ? 'OWNER' : 'USER',
      picture: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
      minecraftUsername: 'MR_DOOM_YT',
      minecraftEdition: 'Java',
      isMinecraftVerified: true,
      bio: 'Verified Iron Cloud player and community supporter.',
      joinedAt: new Date().toISOString(),
      avatarSource: 'upload',
    };

    try {
      await api.updateProfile(googleUser);
    } catch {
      // Local fallback
    }

    setUser(googleUser);
    return googleUser;
  };

  const demoStaffLogin = (): User => {
    const staffUser: User = {
      ...DEFAULT_ADMIN_USER,
      email: 'admin@ironcloudmc.fun',
      name: 'Iron Cloud Administrator',
      role: 'OWNER',
    };
    setUser(staffUser);
    return staffUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const updateMinecraftAccount = async (username: string, edition: 'Java' | 'Bedrock' = 'Java') => {
    const cleanUsername = username.trim();
    let uuid = user?.minecraftUuid;
    let verified = user?.isMinecraftVerified || false;
    let newAvatar = user?.picture;

    try {
      const lookup = await api.lookupPlayer(cleanUsername);
      if (lookup) {
        uuid = lookup.uuid;
        verified = lookup.verified;
        if (!user?.picture || user.avatarSource === 'minecraft') {
          newAvatar = lookup.avatarUrl;
        }
      }
    } catch {
      // Keep existing or use minotar fallback
    }

    const updatedData: Partial<User> = {
      minecraftUsername: cleanUsername,
      minecraftEdition: edition,
      minecraftUuid: uuid,
      isMinecraftVerified: verified,
      picture: newAvatar,
      avatarUrl: newAvatar,
    };

    updateUser(updatedData);

    if (user?.email) {
      try {
        await api.updateProfile({ email: user.email, ...updatedData });
      } catch (err) {
        console.error('Failed to sync profile with server:', err);
      }
    }
  };

  const uploadProfilePicture = async (base64Image: string): Promise<string> => {
    if (!user) throw new Error('You must be signed in to upload a profile picture.');

    const updatedData: Partial<User> = {
      picture: base64Image,
      avatarUrl: base64Image,
      avatarSource: 'upload',
    };

    updateUser(updatedData);

    try {
      await api.uploadAvatar(user.email, base64Image);
    } catch (err) {
      console.warn('Saved avatar locally; server upload had warning:', err);
    }

    return base64Image;
  };

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    if (!user) throw new Error('Not authenticated');

    const updated: User = {
      ...user,
      ...data,
      picture: data.avatarUrl || data.picture || user.picture,
    };

    setUser(updated);

    try {
      await api.updateProfile(updated);
    } catch (err) {
      console.warn('Synced locally:', err);
    }

    return updated;
  };

  const switchRoleForTesting = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    } else {
      setUser({
        email: 'tester@ironcloudmc.fun',
        name: `${role} User`,
        role,
        minecraftUsername: 'IronTester',
        minecraftEdition: 'Java',
        isMinecraftVerified: true,
      });
    }
  };

  const isAdmin = user
    ? ['OWNER', 'ADMIN', 'admin'].includes(user.role as string)
    : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin,
        login,
        loginWithCredentials,
        loginWithGoogle,
        demoStaffLogin,
        logout,
        updateUser,
        updateMinecraftAccount,
        uploadProfilePicture,
        updateProfile,
        switchRoleForTesting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
