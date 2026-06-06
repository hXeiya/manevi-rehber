import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getChatHistory, saveChatHistory, clearChatHistory } from '../services/storageService';
import { sendMessageToBilgeAI } from '../services/apiService';
import { BILGE_AI_INTRO } from '../constants/content';
import { GEMINI_API_KEY } from '../config/env';

const AppContext = createContext(null);

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  text: BILGE_AI_INTRO,
  timestamp: Date.now(),
};

export function AppProvider({ children }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Firebase auth & gamification state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [ip, setIp] = useState(0);
  const [chatsCount, setChatsCount] = useState(0);
  const [readGuides, setReadGuides] = useState([]);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Gamification Rank thresholds check helper
  const addIp = useCallback((points) => {
    setIp((prevIp) => {
      const newIp = prevIp + points;
      const oldRank = prevIp >= 600 ? 3 : prevIp >= 300 ? 2 : prevIp >= 100 ? 1 : 0;
      const newRank = newIp >= 600 ? 3 : newIp >= 300 ? 2 : newIp >= 100 ? 1 : 0;

      // If rank has increased, trigger animated golden sparks confetti overlay
      if (newRank > oldRank) {
        setIsConfettiActive(true);
      }
      return newIp;
    });
  }, []);

  // Helper to manage mock users locally when Firebase is not configured or throws errors
  const handleMockLogin = async (email, password) => {
    const storedUsersRaw = await AsyncStorage.getItem('manevi_rehber_mock_users');
    const mockUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    const matchedUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!matchedUser) {
      throw new Error('E-posta veya sifre hatali.');
    }
    
    // Load user data
    const userDataRaw = await AsyncStorage.getItem(`manevi_rehber_user_data_${matchedUser.uid}`);
    const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
    
    setIp(userData.ip || 0);
    setChatsCount(userData.chatsCount || 0);
    setReadGuides(userData.readGuides || []);
    setMessages(userData.messages || [WELCOME_MESSAGE]);
    
    const mockUserObj = {
      uid: matchedUser.uid,
      email: matchedUser.email,
      displayName: matchedUser.name || matchedUser.email.split('@')[0],
      isMock: true
    };
    
    await AsyncStorage.setItem('manevi_rehber_active_mock_user', JSON.stringify(mockUserObj));
    setUser(mockUserObj);
    return mockUserObj;
  };

  const handleMockRegister = async (email, password, name) => {
    const storedUsersRaw = await AsyncStorage.getItem('manevi_rehber_mock_users');
    const mockUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    const exists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      throw new Error('Bu e-posta adresiyle kayitli bir kullanici zaten var.');
    }
    
    const newUid = `mock-user-${Date.now()}`;
    const newUser = {
      uid: newUid,
      email: email,
      password: password,
      name: name || email.split('@')[0]
    };
    
    mockUsers.push(newUser);
    await AsyncStorage.setItem('manevi_rehber_mock_users', JSON.stringify(mockUsers));
    
    const mockUserObj = {
      uid: newUid,
      email: email,
      displayName: newUser.name,
      isMock: true
    };
    
    // Save current local progress to this new user
    const userData = {
      email: email,
      name: newUser.name,
      ip: ip,
      chatsCount: chatsCount,
      readGuides: readGuides,
      messages: messages
    };
    await AsyncStorage.setItem(`manevi_rehber_user_data_${newUid}`, JSON.stringify(userData));
    await AsyncStorage.setItem('manevi_rehber_active_mock_user', JSON.stringify(mockUserObj));
    
    setUser(mockUserObj);
    return mockUserObj;
  };

  // Hydrate data from AsyncStorage initially
  useEffect(() => {
    async function hydrate() {
      try {
        // First check if a mock user was active
        const mockUserRaw = await AsyncStorage.getItem('manevi_rehber_active_mock_user');
        if (mockUserRaw) {
          const mockUser = JSON.parse(mockUserRaw);
          setUser(mockUser);
          
          const userDataRaw = await AsyncStorage.getItem(`manevi_rehber_user_data_${mockUser.uid}`);
          if (userDataRaw) {
            const userData = JSON.parse(userDataRaw);
            setIp(userData.ip || 0);
            setChatsCount(userData.chatsCount || 0);
            setReadGuides(userData.readGuides || []);
            setMessages(userData.messages || [WELCOME_MESSAGE]);
            setIsHydrated(true);
            return;
          }
        }

        // Standard local hydration
        const storedHistory = await getChatHistory();
        if (storedHistory.length > 0) {
          setMessages(storedHistory);
        }

        const storedIp = await AsyncStorage.getItem('manevi_rehber_ip');
        const storedChats = await AsyncStorage.getItem('manevi_rehber_chats_count');
        const storedGuides = await AsyncStorage.getItem('manevi_rehber_read_guides');

        if (storedIp !== null) setIp(parseInt(storedIp, 10));
        if (storedChats !== null) setChatsCount(parseInt(storedChats, 10));
        if (storedGuides !== null) setReadGuides(JSON.parse(storedGuides));
      } catch (error) {
        console.warn('Depolama yuklenemedi:', error);
      } finally {
        setIsHydrated(true);
      }
    }
    hydrate();
  }, []);

  // Save chat history to AsyncStorage
  useEffect(() => {
    if (!isHydrated || (user && user.isMock)) return;
    saveChatHistory(messages);
  }, [messages, isHydrated, user]);

  // Save gamification data to AsyncStorage
  useEffect(() => {
    if (!isHydrated || (user && user.isMock)) return;
    AsyncStorage.setItem('manevi_rehber_ip', ip.toString());
    AsyncStorage.setItem('manevi_rehber_chats_count', chatsCount.toString());
    AsyncStorage.setItem('manevi_rehber_read_guides', JSON.stringify(readGuides));
  }, [ip, chatsCount, readGuides, isHydrated, user]);

  // Sync state to Firebase Firestore or local mock user data helper
  const syncToCloud = useCallback(async (u, currentIp, currentChats, currentGuides, currentMessages) => {
    if (!u) return;
    if (u.isMock) {
      try {
        const userData = {
          email: u.email,
          name: u.displayName,
          ip: currentIp,
          chatsCount: currentChats,
          readGuides: currentGuides,
          messages: currentMessages,
          lastUpdated: Date.now()
        };
        await AsyncStorage.setItem(`manevi_rehber_user_data_${u.uid}`, JSON.stringify(userData));
      } catch (e) {
        console.warn('Yerel simulasyon kayit hatasi:', e);
      }
      return;
    }

    try {
      const userDocRef = doc(db, 'users', u.uid);
      await setDoc(userDocRef, {
        email: u.email,
        name: u.displayName || '',
        ip: currentIp,
        chatsCount: currentChats,
        readGuides: currentGuides,
        messages: currentMessages,
        lastUpdated: Date.now(),
      }, { merge: true });
    } catch (e) {
      console.warn('Bulut esitleme hatasi:', e);
    }
  }, []);

  // Automatically sync to Firestore when progress changes (Debounced by React Render queue)
  useEffect(() => {
    if (user && isHydrated) {
      syncToCloud(user, ip, chatsCount, readGuides, messages);
    }
  }, [user, ip, chatsCount, readGuides, messages, isHydrated, syncToCloud]);

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // If we have a local mock user session active, ignore real firebase state
      const mockUserRaw = await AsyncStorage.getItem('manevi_rehber_active_mock_user');
      if (mockUserRaw) {
        return; 
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch cloud progress and merge it with current local offline progress
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIp((prevIp) => Math.max(prevIp, data.ip || 0));
            setChatsCount((prevChats) => Math.max(prevChats, data.chatsCount || 0));
            setReadGuides((prevGuides) => {
              const cloudGuides = data.readGuides || [];
              const union = Array.from(new Set([...prevGuides, ...cloudGuides]));
              return union;
            });
            setMessages((prevMsgs) => {
              const cloudMsgs = data.messages || [];
              if (cloudMsgs.length > prevMsgs.length) {
                return cloudMsgs;
              }
              return prevMsgs;
            });
          } else {
            // New register: push local progress to the cloud
            await syncToCloud(firebaseUser, ip, chatsCount, readGuides, messages);
          }
        } catch (e) {
          console.warn('Bulut verileri senkronize edilemedi:', e);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isHydrated, syncToCloud]);

  // Auth Operations
  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      if (auth.config?.apiKey?.includes('demo-key')) {
        return await handleMockLogin(email, password);
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (e) {
      if (e.code === 'auth/invalid-api-key' || e.code === 'auth/network-request-failed' || e.message?.includes('API key')) {
        return await handleMockLogin(email, password);
      }
      throw new Error(e.message || 'Giris yapilamadi.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    setAuthLoading(true);
    try {
      if (auth.config?.apiKey?.includes('demo-key')) {
        return await handleMockRegister(email, password, name);
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;
      if (name) {
        await updateProfile(u, { displayName: name });
      }
      await syncToCloud(u, ip, chatsCount, readGuides, messages);
      return u;
    } catch (e) {
      if (e.code === 'auth/invalid-api-key' || e.code === 'auth/network-request-failed' || e.message?.includes('API key')) {
        return await handleMockRegister(email, password, name);
      }
      throw new Error(e.message || 'Kayit olunamadi.');
    } finally {
      setAuthLoading(false);
    }
  }, [ip, chatsCount, readGuides, messages, syncToCloud]);

  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      if (user && user.isMock) {
        await AsyncStorage.removeItem('manevi_rehber_active_mock_user');
      } else {
        await signOut(auth);
      }
      setUser(null); // UI'ı misafir moduna geçirmek için kullanıcı durumunu sıfırla
      setIp(0);
      setChatsCount(0);
      setReadGuides([]);
      setMessages([WELCOME_MESSAGE]);
      await clearChatHistory();
      await AsyncStorage.removeItem('manevi_rehber_ip');
      await AsyncStorage.removeItem('manevi_rehber_chats_count');
      await AsyncStorage.removeItem('manevi_rehber_read_guides');
    } catch (e) {
      throw new Error(e.message || 'Cikis yapilamadi.');
    } finally {
      setAuthLoading(false);
    }
  }, [user]);

  // Scoring triggers
  const markGuideAsRead = useCallback((guideId) => {
    setReadGuides((prev) => {
      if (prev.includes(guideId)) return prev;
      const updated = [...prev, guideId];
      addIp(20); // Reward 20 points for reading a full guide
      return updated;
    });
  }, [addIp]);

  const incrementChatsCount = useCallback(() => {
    setChatsCount((prev) => {
      const updated = prev + 1;
      addIp(5); // Reward 5 points per message
      return updated;
    });
  }, [addIp]);

  const resetChat = useCallback(async () => {
    await clearChatHistory();
    setMessages([WELCOME_MESSAGE]);
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { messages: [WELCOME_MESSAGE] }, { merge: true });
      } catch (e) {
        console.warn('Bulut temizleme hatasi:', e);
      }
    }
  }, [user]);

  const sendMessage = useCallback(
    async (text) => {
      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      incrementChatsCount();

      try {
        const historyForApi = messages
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.text,
          }));

        const reply = await sendMessageToBilgeAI(GEMINI_API_KEY, text, historyForApi);

        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        const errorMsg = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: error.message || 'Bir hata olustu. Lutfen tekrar deneyin.',
          timestamp: Date.now(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, incrementChatsCount]
  );

  const value = useMemo(
    () => ({
      apiKey: GEMINI_API_KEY,
      hasApiKey: true,
      messages,
      isLoading,
      isHydrated,
      sendMessage,
      resetChat,
      user,
      isLoadingAuth: authLoading,
      ip,
      chatsCount,
      readGuides,
      isConfettiActive,
      setIsConfettiActive,
      login,
      register,
      logout,
      addIp,
      markGuideAsRead,
    }),
    [
      messages,
      isLoading,
      isHydrated,
      sendMessage,
      resetChat,
      user,
      authLoading,
      ip,
      chatsCount,
      readGuides,
      isConfettiActive,
      login,
      register,
      logout,
      addIp,
      markGuideAsRead,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp yalnizca AppProvider icinde kullanilabilir.');
  }
  return ctx;
}
