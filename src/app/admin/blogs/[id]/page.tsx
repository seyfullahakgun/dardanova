"use client";

import { useEffect, useState, use, HTMLAttributes } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, ArrowLeft, Calendar, User, Edit } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MDXEditor } from "@mdxeditor/editor";
import {
  imagePlugin,
  headingsPlugin,
  toolbarPlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertImage,
  InsertTable,
  CreateLink,
  InsertCodeBlock,
  ListsToggle,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  UndoRedo,
  listsPlugin,
  CodeMirrorEditor,
  thematicBreakPlugin,
  InsertThematicBreak,
} from "@mdxeditor/editor";
import { db } from "@/lib/firebaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@mdxeditor/editor/style.css";
import styles from "../editor.module.css";
import { toast } from "sonner";
import debounce from "lodash/debounce";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseClient";
import { serverTimestamp } from "firebase/firestore";
import remarkGfm from "remark-gfm";
import rehypeHighlight from 'rehype-highlight'


export default function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [authorName, setAuthorName] = useState("");
  const [language, setLanguage] = useState("tr");

  const mdComponents: Components = {
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
    ),
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
    ),
    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-4 leading-relaxed" {...props} />
    ),
    a: (props: HTMLAttributes<HTMLAnchorElement>) => (
      <a className="text-blue-600 hover:underline" {...props} />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc list-inside mb-4" {...props} />
    ),
    li: (props: HTMLAttributes<HTMLLIElement>) => (
      <li className="mb-2" {...props} />
    ),
    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 mb-4" {...props} />
    ),
  };

  // Debounce ile optimize edilmiş content güncelleme fonksiyonu
  const debouncedSetContent = debounce((value: string) => {
    setContent(value);
  }, 300);

  // Editor değişiklik handler'ı
  const handleEditorChange = (value: string) => {
    debouncedSetContent(value);
  };

  const fetchPost = async () => {
    try {
      const postRef = doc(db, "posts", id);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        setError("Blog yazısı bulunamadı.");
        return;
      }

      await updateDoc(postRef, {
        views: (postDoc.data().views || 0) + 1,
      });

      const postData = {
        id: postDoc.id,
        ...postDoc.data(),
        createdAt: postDoc.data().createdAt?.toDate(),
        updatedAt: postDoc.data().updatedAt?.toDate(),
        views: (postDoc.data().views || 0) + 1,
      } as Post;

      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);
      setAuthorName(postData.authorName);
      setLanguage(postData.lang);
      setImagePreview(postData.imageUrl || "");
    } catch (err) {
      setError("Blog yazısı yüklenirken bir hata oluştu.");
      console.error("Blog yazısı yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setLoading(true);

    try {
      let imageUrl = post.imageUrl;
      if (featuredImage) {
        const storageRef = ref(
          storage,
          `images/${Date.now()}_${featuredImage.name}`
        );
        await uploadBytes(storageRef, featuredImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const postData = {
        title,
        content,
        imageUrl,
        authorName,
        lang: language,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, "posts", id), postData);
      toast.success("Blog yazısı başarıyla güncellendi");
      fetchPost();
      setIsEditing(false);
    } catch (error) {
      console.error("Blog yazısı güncellenirken hata:", error);
      toast.error("Blog yazısı güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-5xl mx-auto p-4">
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
        <Link href="/admin/blogs" className="text-blue-600 hover:text-blue-800">
          Blog yazılarına geri dön
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  if (!isEditing) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16">
        <article className="bg-dark max-w-5xl mx-auto p-4">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {post.title}
              </h1>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-dark"
              >
                <Edit className="w-4 h-4" />
                Düzenle
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-200">
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
                <span>
                  {Math.ceil(post.content.length / 1000)} dakika okuma
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{post.views || 0} görüntülenme</span>
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
          <div className="max-w-none mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={mdComponents}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <footer className="border-t pt-8">
            <Link
              href="/admin/blogs"
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Yazısını Düzenle</h1>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Önizlemeye Dön
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Blog yazısı başlığı"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorName">Yazar</Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              placeholder="Yazar adı"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Dil</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Dil seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="en">İngilizce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Öne Çıkan Görsel</Label>
            <Input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageChange}
              className="cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Önizleme"
                  width={100}
                  height={100}
                  className="max-h-48 rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>İçerik</Label>
            <div className={styles.editorContainer}>
              <MDXEditor
                markdown={content}
                onChange={handleEditorChange}
                plugins={[
                  imagePlugin({
                    imageUploadHandler: async (file: File) => {
                      try {
                        const storageRef = ref(
                          storage,
                          `images/${Date.now()}_${file.name}`
                        );
                        await uploadBytes(storageRef, file);
                        return await getDownloadURL(storageRef);
                      } catch (error) {
                        console.error("Resim yüklenirken hata:", error);
                        toast.error("Resim yüklenirken bir hata oluştu");
                        return "";
                      }
                    },
                  }),
                  headingsPlugin(),
                  listsPlugin(),
                  thematicBreakPlugin(),
                  linkPlugin(),
                  linkDialogPlugin(),
                  tablePlugin(),
                  codeMirrorPlugin({
                    codeBlockLanguages: {
                      js: "JavaScript",
                      jsx: "React",
                      ts: "TypeScript",
                      tsx: "React + TypeScript",
                      html: "HTML",
                      css: "CSS",
                      python: "Python",
                      java: "Java",
                      csharp: "C#",
                      php: "PHP",
                      ruby: "Ruby",
                      go: "Go",
                      rust: "Rust",
                      swift: "Swift",
                      kotlin: "Kotlin",
                      sql: "SQL",
                      json: "JSON",
                      yaml: "YAML",
                      markdown: "Markdown",
                      bash: "Bash",
                      shell: "Shell",
                    },
                  }),
                  codeBlockPlugin({
                    defaultCodeBlockLanguage: "javascript",
                    codeBlockEditorDescriptors: [
                      {
                        match: () => true,
                        priority: 0,
                        Editor: CodeMirrorEditor,
                      },
                    ],
                  }),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <BlockTypeSelect />
                        <ListsToggle />
                        <CodeToggle />
                        <CreateLink />
                        <InsertImage />
                        <InsertTable />
                        <InsertCodeBlock />
                        <InsertThematicBreak />
                      </>
                    ),
                  }),
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blogs")}
            >
              İptal
            </Button>
            <Button type="submit">Kaydet</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
