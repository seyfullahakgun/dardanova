"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MDXEditor } from "@mdxeditor/editor";
import Image from "next/image";
import {
  imagePlugin,
  headingsPlugin,
  toolbarPlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  codeBlockPlugin,
  thematicBreakPlugin,
  codeMirrorPlugin,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  CreateLink,
  InsertCodeBlock,
  ListsToggle,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  UndoRedo,
  listsPlugin,
  CodeMirrorEditor,
} from "@mdxeditor/editor";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { storage, db, auth } from "@/lib/firebaseClient";
import { Button } from "@/components/ui/button";
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
import debounce from "lodash/debounce";

export default function NewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("tr");

  // Debounce ile optimize edilmiş content güncelleme fonksiyonu
  const debouncedSetContent = useCallback(
    debounce((value: string) => {
      setContent(value);
    }, 300),
    []
  );

  // Editor değişiklik handler'ı
  const handleEditorChange = useCallback(
    (value: string) => {
      debouncedSetContent(value);
    },
    [debouncedSetContent]
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAuthorName(user.displayName || user.email || "");
    }
  }, []);

  const handleImageUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (featuredImage) {
        imageUrl = await handleImageUpload(featuredImage);
      }

      const postData = {
        title,
        content,
        imageUrl,
        authorName,
        lang: language,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublished: false,
        views: 0,
      };

      await addDoc(collection(db, "posts"), postData);
      toast.success("Blog yazısı başarıyla oluşturuldu");
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Blog yazısı oluşturulurken hata:", error);
      toast.error("Blog yazısı oluşturulurken bir hata oluştu");
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Yeni Blog Yazısı</h1>

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
                    imageUploadHandler: handleImageUpload,
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
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
