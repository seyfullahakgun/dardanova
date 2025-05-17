"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Pencil, Trash2, CircleCheck, CircleX } from "lucide-react";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToPublish, setPostToPublish] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Post[];

        setPosts(postsData);
      } catch (err) {
        setError("Blog yazıları yüklenirken bir hata oluştu.");
        console.error("Blog yazıları yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postToDelete.id));
      setPosts(posts.filter((post) => post.id !== postToDelete.id));
      toast.success("Blog yazısı başarıyla silindi");
    } catch (error) {
      console.error("Blog yazısı silinirken hata:", error);
      toast.error("Blog yazısı silinirken bir hata oluştu");
    } finally {
      setPostToDelete(null);
    }
  };

  const handlePublish = async () => {
    if (!postToPublish) return;

    try {
      await updateDoc(doc(db, "posts", postToPublish.id), {
        isPublished: !postToPublish.isPublished,
      });

      setPosts(
        posts.map((post) =>
          post.id === postToPublish.id
            ? { ...post, isPublished: !post.isPublished }
            : post
        )
      );

      toast.success(
        postToPublish.isPublished
          ? "Blog yazısı yayından kaldırıldı"
          : "Blog yazısı yayınlandı"
      );
    } catch (error) {
      console.error("Blog yazısı güncellenirken hata:", error);
      toast.error("Blog yazısı güncellenirken bir hata oluştu");
    } finally {
      setPostToPublish(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark">Blog Yazıları</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Yeni Yazı Ekle
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturulma Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.lang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.createdAt?.toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      onClick={() => router.push(`/admin/blogs/${post.id}`)}
                      variant="outline"
                      className="text-indigo-600 hover:text-indigo-900 bg-transparent hover:bg-indigo-100 p-2 rounded-md mr-4"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setPostToDelete(post)}
                      variant="outline"
                      className="text-red-600 hover:text-red-900 bg-transparent hover:bg-red-100 p-2 rounded-md mr-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setPostToPublish(post)}
                      variant="outline"
                      className={`${
                        post.isPublished
                          ? "text-red-600 hover:text-red-900 hover:bg-red-100"
                          : "text-green-600 hover:text-green-900 hover:bg-green-100"
                      } bg-transparent p-2 rounded-md mr-4`}
                    >
                      {post.isPublished ? (
                        <CircleX className="w-4 h-4" />
                      ) : (
                        <CircleCheck className="w-4 h-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-dark">
                  Blog yazısı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Silme Onay Modalı */}
      <AlertDialog
        open={!!postToDelete}
        onOpenChange={() => setPostToDelete(null)}
      >
        <AlertDialogContent className="text-dark">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Blog yazısını silmek istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Blog yazısı kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Yayınlama Onay Modalı */}
      <AlertDialog
        open={!!postToPublish}
        onOpenChange={() => setPostToPublish(null)}
      >
        <AlertDialogContent className="text-dark">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {postToPublish?.isPublished
                ? "Blog yazısını yayından kaldırmak istediğinize emin misiniz?"
                : "Blog yazısını yayınlamak istediğinize emin misiniz?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {postToPublish?.isPublished
                ? "Blog yazısı artık görüntülenemeyecek."
                : "Blog yazısı herkes tarafından görüntülenebilecek."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>
              {postToPublish?.isPublished ? "Yayından Kaldır" : "Yayınla"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
