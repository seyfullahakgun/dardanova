"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseClient";

const LoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="bg-transparent border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="relative h-48 w-full bg-slate-200 animate-pulse" />
          <div className="p-6">
            <div className="h-6 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default function BlogPage() {
  const t = useTranslations("Blog");
  const router = useRouter();
  const { locale } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 1. Post'ları çek
        const postsQuery = query(
          collection(db, "posts"),
          where("isPublished", "==", true),
          where("lang", "==", locale),
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
        setError(t("error"));
        console.error("Blog yazıları yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [t]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto"></div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-transparent border border-gray-200 shadow-lg overflow-hidden transition-transform duration-200 hover:shadow hover:shadow-gray-600"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.imageUrl || "/placeholder-image.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-200"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <div className={`text-gray-600 mb-4 line-clamp-3`}>
                  <ReactMarkdown
                    components={{
                      // Resimleri gösterme
                      img: () => null,
                      // Başlıkları paragraf olarak göster
                      h1: ({ children }) => <p>{children}</p>,
                      h2: ({ children }) => <p>{children}</p>,
                      h3: ({ children }) => <p>{children}</p>,
                      h4: ({ children }) => <p>{children}</p>,
                      h5: ({ children }) => <p>{children}</p>,
                      h6: ({ children }) => <p>{children}</p>,
                      // Kod bloklarını düz metin olarak göster
                      code: ({ children }) => <span>{children}</span>,
                      pre: ({ children }) => <span>{children}</span>,
                      // Listeleri düz metin olarak göster
                      ul: ({ children }) => <p>{children}</p>,
                      ol: ({ children }) => <p>{children}</p>,
                      li: ({ children }) => <span>{children}</span>,
                      // Alıntıları düz metin olarak göster
                      blockquote: ({ children }) => (
                        <div className="border-l-4 border-gray-300 pl-4 mb-4">
                          {children}
                        </div>
                      ),
                      // Tabloları düz metin olarak göster
                      table: ({ children }) => <p>{children}</p>,
                      thead: ({ children }) => <span>{children}</span>,
                      tbody: ({ children }) => <span>{children}</span>,
                      tr: ({ children }) => <span>{children}</span>,
                      th: ({ children }) => <span>{children}</span>,
                      td: ({ children }) => <span>{children}</span>,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {post.createdAt?.toLocaleDateString("tr-TR")}
                  </span>
                  <Button
                    onClick={() => router.push(`/blog/${post.id}`)}
                    className="inline-flex items-center px-4 py-2 rounded-none bg-white text-dark hover:bg-primary transition-colors transform duration-300"
                  >
                    {t("readMore")}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">{t("noPosts")}</div>
      )}
    </div>
  );
}
