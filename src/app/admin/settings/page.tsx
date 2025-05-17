"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { toast } from "sonner";

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Şifre en az 6 karakter olmalıdır.",
    }),
    newPassword: z.string().min(6, {
      message: "Şifre en az 6 karakter olmalıdır.",
    }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Şifreler eşleşmiyor.",
      path: ["confirmPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SettingsPage() {
  const { user, updateUserProfile, updateUserPassword, uploadProfileImage } =
    useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user?.photoURL) {
      setPreviewUrl(user.photoURL);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      let photoURL = user.photoURL;
      if (profileImage) {
        photoURL = await uploadProfileImage(profileImage);
      }

      await updateUserProfile({
        displayName: data.displayName,
        photoURL: photoURL || undefined,
      });

      setIsEditing(false);
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserPassword(data.currentPassword, data.newPassword);
      passwordForm.reset();
      setIsChangingPassword(false);
      toast.success("Şifre başarıyla güncellendi");
    } catch (error) {
      console.error("Şifre güncellenirken hata:", error);
      toast.error("Şifre güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Ayarları</CardTitle>
          <CardDescription>
            Profil bilgilerinizi ve şifrenizi güncelleyebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Profil Formu */}
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={previewUrl || "/images/default-avatar.jpg"}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full rounded-full object-cover"
                      />
                      {isEditing && (
                        <Label
                          htmlFor="profile-image"
                          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </Label>
                      )}
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Görünen Ad</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem>
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input value={user?.email || ""} disabled />
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {!isEditing ? (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        Düzenle
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            profileForm.reset();
                            setProfileImage(null);
                            setPreviewUrl(user?.photoURL || null);
                          }}
                        >
                          İptal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Form>

            {/* Şifre Formu */}
            <div className="pt-4 border-t">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Şifre Değiştir</h3>
                    {!isChangingPassword ? (
                      <Button
                        type="button"
                        onClick={() => setIsChangingPassword(true)}
                        variant="outline"
                      >
                        Şifreyi Güncelle
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsChangingPassword(false);
                            passwordForm.reset();
                          }}
                        >
                          İptal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Güncelleniyor..." : "Güncelle"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {isChangingPassword && (
                    <div className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mevcut Şifre</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yeni Şifre</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifre Tekrar</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 