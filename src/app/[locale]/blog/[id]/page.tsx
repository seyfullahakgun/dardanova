"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, "posts", id));

        console.log(postDoc.data());

        if (!postDoc.exists()) {
          setError("Blog yazısı bulunamadı.");
          return;
        }

        const postData = {
          id: postDoc.id,
          ...postDoc.data(),
          createdAt: postDoc.data().createdAt?.toDate(),
          updatedAt: postDoc.data().updatedAt?.toDate(),
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Blog sayfasına dön
      </Link>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl || "/placeholder-image.jpg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-8 pt-8 border-t text-sm text-gray-500">
          <p>
            Yayınlanma Tarihi: {post.createdAt?.toLocaleDateString("tr-TR")}
          </p>
          {post.updatedAt && post.updatedAt > post.createdAt && (
            <p>Son Güncelleme: {post.updatedAt?.toLocaleDateString("tr-TR")}</p>
          )}
        </div>
      </article>
    </div>
  );
}
