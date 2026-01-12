"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: string;
}

// Toolbar Icons
const BoldIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
  </svg>
);

const ItalicIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
  </svg>
);

const UnderlineIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
  </svg>
);

const StrikeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" />
  </svg>
);

const HeadingIcon = ({ level }: { level: number }) => (
  <span className="text-xs font-bold">H{level}</span>
);

const BulletListIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
  </svg>
);

const OrderedListIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

const QuoteIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
  </svg>
);

// Text Alignment Icons
const AlignLeftIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
  </svg>
);

const AlignRightIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
  </svg>
);

const AlignJustifyIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
  </svg>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Tulis konten di sini...",
  disabled = false,
  height = "300px",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'resizable-image',
          style: 'max-width: 100%; height: auto; cursor: pointer;',
        },
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Add resize functionality to images - simpler approach
  React.useEffect(() => {
    if (!editor) return;

    const editorElement = document.querySelector(".tiptap-editor-wrapper .ProseMirror");
    if (!editorElement) return;

    let selectedImg: HTMLImageElement | null = null;
    let resizing = false;
    let startX = 0;
    let startWidth = 0;

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        selectedImg = target as HTMLImageElement;
        selectedImg.style.cursor = "ew-resize";
      } else {
        if (selectedImg) {
          selectedImg.style.cursor = "pointer";
          selectedImg = null;
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (selectedImg && e.target === selectedImg) {
        resizing = true;
        startX = e.clientX;
        startWidth = selectedImg.offsetWidth;
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (resizing && selectedImg) {
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + deltaX);
        selectedImg.style.width = `${newWidth}px`;
        selectedImg.style.height = "auto";
        selectedImg.setAttribute("width", newWidth.toString());
      }
    };

    const handleMouseUp = () => {
      if (resizing) {
        resizing = false;
        if (editor && selectedImg) {
          // Update content to persist
          editor.commands.focus();
        }
      }
    };

    editorElement.addEventListener("click", handleImageClick as EventListener);
    editorElement.addEventListener("mousedown", handleMouseDown as EventListener);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      editorElement.removeEventListener("click", handleImageClick as EventListener);
      editorElement.removeEventListener("mousedown", handleMouseDown as EventListener);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [editor]);

  const [showLinkDialog, setShowLinkDialog] = React.useState(false);
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert to WebP
        const webpBlob = await convertToWebP(file);
        
        const formData = new FormData();
        formData.append("file", webpBlob, file.name.replace(/\.[^/.]+$/, ".webp"));

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        
        if (editor) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      }
      
      setShowImageDialog(false);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Gagal upload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Conversion to WebP failed"));
              }
            },
            "image/webp",
            0.9
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (!editor) {
    return <div className="h-[300px] bg-default-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="relative">
      <div className="tiptap-editor-wrapper border-2 border-default-200 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-default-100 border-b-2 border-default-200">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("heading", { level: 1 }) ? "bg-primary text-white" : ""
          }`}
        >
          <HeadingIcon level={1} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-primary text-white" : ""
          }`}
        >
          <HeadingIcon level={2} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("heading", { level: 3 }) ? "bg-primary text-white" : ""
          }`}
        >
          <HeadingIcon level={3} />
        </button>

        <div className="w-px h-8 bg-default-300 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("bold") ? "bg-primary text-white" : ""
          }`}
        >
          <BoldIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("italic") ? "bg-primary text-white" : ""
          }`}
        >
          <ItalicIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("underline") ? "bg-primary text-white" : ""
          }`}
        >
          <UnderlineIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("strike") ? "bg-primary text-white" : ""
          }`}
        >
          <StrikeIcon />
        </button>

        <div className="w-px h-8 bg-default-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("bulletList") ? "bg-primary text-white" : ""
          }`}
        >
          <BulletListIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("orderedList") ? "bg-primary text-white" : ""
          }`}
        >
          <OrderedListIcon />
        </button>

        <div className="w-px h-8 bg-default-300 mx-1" />

        {/* Quote & Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("blockquote") ? "bg-primary text-white" : ""
          }`}
        >
          <QuoteIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("codeBlock") ? "bg-primary text-white" : ""
          }`}
        >
          <CodeIcon />
        </button>

        <div className="w-px h-8 bg-default-300 mx-1" />

        {/* Link & Image */}
        <button
          type="button"
          onClick={() => setShowLinkDialog(true)}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive("link") ? "bg-primary text-white" : ""
          }`}
        >
          <LinkIcon />
        </button>
        <button
          type="button"
          onClick={() => setShowImageDialog(true)}
          className="p-2 rounded hover:bg-default-200"
          disabled={uploadingImage}
        >
          <ImageIcon />
        </button>

        <div className="w-px h-8 bg-default-300 mx-1" />

        {/* Image size presets */}
        <button
          type="button"
          onClick={() => {
            const img = document.querySelector(".ProseMirror img.ProseMirror-selectednode") as HTMLImageElement;
            if (img) {
              img.style.width = "25%";
              img.style.height = "auto";
            }
          }}
          className="px-2 py-1 text-xs rounded hover:bg-default-200"
          title="Small (25%)"
        >
          S
        </button>
        <button
          type="button"
          onClick={() => {
            const img = document.querySelector(".ProseMirror img.ProseMirror-selectednode") as HTMLImageElement;
            if (img) {
              img.style.width = "50%";
              img.style.height = "auto";
            }
          }}
          className="px-2 py-1 text-xs rounded hover:bg-default-200"
          title="Medium (50%)"
        >
          M
        </button>
        <button
          type="button"
          onClick={() => {
            const img = document.querySelector(".ProseMirror img.ProseMirror-selectednode") as HTMLImageElement;
            if (img) {
              img.style.width = "100%";
              img.style.height = "auto";
            }
          }}
          className="px-2 py-1 text-xs rounded hover:bg-default-200"
          title="Large (100%)"
        >
          L
        </button>

        <div className="w-px h-8 bg-default-300 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive({ textAlign: 'left' }) ? "bg-primary text-white" : ""
          }`}
          title="Rata Kiri"
        >
          <AlignLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive({ textAlign: 'center' }) ? "bg-primary text-white" : ""
          }`}
          title="Rata Tengah"
        >
          <AlignCenterIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive({ textAlign: 'right' }) ? "bg-primary text-white" : ""
          }`}
          title="Rata Kanan"
        >
          <AlignRightIcon />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded hover:bg-default-200 ${
            editor.isActive({ textAlign: 'justify' }) ? "bg-primary text-white" : ""
          }`}
          title="Rata Kiri Kanan (Justify)"
        >
          <AlignJustifyIcon />
        </button>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkDialog(false)}>
          <div className="bg-default-50 rounded-lg p-4 w-96 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3">Masukkan Link</h3>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border-2 border-default-200 rounded-lg mb-3 focus:outline-none focus:border-primary"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addLink();
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl("");
                }}
                className="px-4 py-2 rounded-lg hover:bg-default-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
              >
                Tambah Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageDialog(false)}>
          <div className="bg-default-50 rounded-lg p-4 w-96 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3">Upload Gambar</h3>
            <p className="text-sm text-default-600 mb-3">
              Upload gambar (PNG, JPG, JPEG). Otomatis convert ke WebP. Bisa upload multiple.
            </p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border-2 border-default-200 rounded-lg mb-3 focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-600"
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <div className="text-center text-sm text-primary">
                Uploading dan converting ke WebP...
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowImageDialog(false)}
                className="px-4 py-2 rounded-lg hover:bg-default-100"
                disabled={uploadingImage}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-4 bg-default-50"
        style={{ minHeight: height, maxHeight: "500px", overflowY: "auto" }}
      />

      <style jsx global>{`
        .tiptap-editor-wrapper .ProseMirror {
          outline: none;
          font-size: 15px;
          line-height: 1.6;
          color: hsl(var(--nextui-foreground));
        }

        .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder}";
          color: hsl(var(--nextui-default-400));
          float: left;
          height: 0;
          pointer-events: none;
        }

        .tiptap-editor-wrapper .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .tiptap-editor-wrapper .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .tiptap-editor-wrapper .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .tiptap-editor-wrapper .ProseMirror ul,
        .tiptap-editor-wrapper .ProseMirror ol {
          padding-left: 2em;
          margin: 0.5em 0;
        }

        .tiptap-editor-wrapper .ProseMirror ul {
          list-style-type: disc;
        }

        .tiptap-editor-wrapper .ProseMirror ol {
          list-style-type: decimal;
        }

        .tiptap-editor-wrapper .ProseMirror li {
          display: list-item;
          margin: 0.25em 0;
        }

        .tiptap-editor-wrapper .ProseMirror blockquote {
          border-left: 4px solid hsl(var(--nextui-primary));
          padding-left: 1em;
          margin: 1em 0;
          color: hsl(var(--nextui-default-700));
        }

        .tiptap-editor-wrapper .ProseMirror code {
          background: hsl(var(--nextui-default-100));
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Courier New", monospace;
          font-size: 0.9em;
        }

        .tiptap-editor-wrapper .ProseMirror pre {
          background: hsl(var(--nextui-default-100));
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }

        .tiptap-editor-wrapper .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .tiptap-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
          cursor: pointer;
          transition: all 0.2s;
          display: block;
        }

        .tiptap-editor-wrapper .ProseMirror img:hover {
          box-shadow: 0 0 0 3px hsl(var(--nextui-primary) / 0.3);
          outline: 2px solid hsl(var(--nextui-primary));
          outline-offset: 2px;
        }

        .tiptap-editor-wrapper .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid hsl(var(--nextui-primary));
          outline-offset: 3px;
        }

        .tiptap-editor-wrapper .ProseMirror img::after {
          content: "↔️ Drag to resize";
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          background: hsl(var(--nextui-primary));
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }

        .tiptap-editor-wrapper .ProseMirror img:hover::after {
          opacity: 1;
        }

        .tiptap-editor-wrapper .ProseMirror a {
          color: hsl(var(--nextui-primary));
          text-decoration: underline;
          cursor: pointer;
        }

        .tiptap-editor-wrapper .ProseMirror a:hover {
          color: hsl(var(--nextui-primary-600));
        }
      `}</style>
      </div>
    </div>
  );
};

// Component untuk menampilkan konten HTML yang sudah di-render
interface RichTextViewerProps {
  content: string;
  className?: string;
}

export const RichTextViewer: React.FC<RichTextViewerProps> = ({
  content,
  className = "",
}) => {
  return (
    <div
      className={`rich-text-viewer prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
