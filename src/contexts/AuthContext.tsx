"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseClient";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Kullanıcı giriş yaptığında cookie'yi ayarla
        Cookies.set("auth", user.uid, { expires: 7 }); // 7 gün geçerli
      } else {
        // Kullanıcı çıkış yaptığında cookie'yi sil
        Cookies.remove("auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      // Giriş başarılı olduğunda cookie'yi ayarla
      Cookies.set("auth", userCredential.user.uid, { expires: 7 });
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      // Çıkış yapıldığında cookie'yi sil
      Cookies.remove("auth");
    } catch (error) {
      throw error;
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!user) throw new Error("Kullanıcı giriş yapmamış");
    const storageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) throw new Error("Kullanıcı giriş yapmamış");
    try {
      await updateProfile(user, data);
      setUser({ ...user, ...data });
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      toast.error("Profil güncellenirken bir hata oluştu");
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("Kullanıcı giriş yapmamış");
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Şifre başarıyla güncellendi");
    } catch (error) {
      toast.error("Şifre güncellenirken bir hata oluştu");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    updateUserProfile,
    updateUserPassword,
    uploadProfileImage,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
