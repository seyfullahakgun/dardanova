"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { Clock, Eye, ArrowLeft, Calendar, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Post } from "@/types";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mdComponents = {
    h1: ({ ...props }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
    ),
    p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
    a: ({ ...props }) => (
      <a className="text-blue-600 hover:underline" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc list-inside mb-4" {...props} />
    ),
    li: ({ ...props }) => <li className="mb-2" {...props} />,
    // istediğiniz diğer etiketler...
    blockquote: ({ ...props }) => (
      <div className="border-l-4 border-gray-300 pl-4 mb-4" {...props} />
    ),
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, "posts", id);
        const postDoc = await getDoc(postRef);

        if (!postDoc.exists()) {
          setError("Blog yazısı bulunamadı.");
          return;
        }

        // localStorage'dan görüntülenme durumunu kontrol et
        const viewedPosts = JSON.parse(
          localStorage.getItem("viewedPosts") || "{}"
        );
        const lastViewTime = viewedPosts[id];
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000; // 24 saat

        // Eğer son görüntüleme 24 saatten eskiyse veya hiç görüntülenmemişse
        if (!lastViewTime || now - lastViewTime > ONE_DAY) {
          const currentViews = postDoc.data().views || 0;
          await updateDoc(postRef, {
            views: currentViews + 1,
          });

          // localStorage'ı güncelle
          viewedPosts[id] = now;
          localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
        }

        const postData = {
          id: postDoc.id,
          ...postDoc.data(),
          createdAt: postDoc.data().createdAt?.toDate(),
          updatedAt: postDoc.data().updatedAt?.toDate(),
          views: postDoc.data().views || 0,
        } as Post;

        if (!postData.isPublished) {
          setError("Bu blog yazısı yayınlanmamış.");
          return;
        }

        setPost(postData);
      } catch (err) {
        setError("Blog yazısı yüklenirken bir hata oluştu.");
        console.error("Blog yazısı yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 rounded w-3/4" />
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-slate-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-32" />
                <div className="h-4 bg-slate-200 rounded w-24" />
              </div>
            </div>
            <div className="h-[400px] bg-slate-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800">
          Blog sayfasına dön
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <article className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-300">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{post.createdAt?.toLocaleDateString("tr-TR")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{Math.ceil(post.content.length / 1000)} dakika okuma</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>{post.views} görüntülenme</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-[400px] w-full mb-12 rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl || "/placeholder-image.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <article className="max-w-none mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={mdComponents}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Footer */}
        <footer className="border-t pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Blog yazılarına geri dön
          </Link>
        </footer>
      </article>
    </div>
  );
}
