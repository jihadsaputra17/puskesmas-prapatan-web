"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type ReactQuillType from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { compressImageFile } from "@/lib/image-compress";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center rounded-[var(--radius-sm)] border border-slate-200 bg-slate-50 text-sm text-slate-500">
      Memuat editor…
    </div>
  ),
}) as typeof import("react-quill-new").default;

type Props = {
  name?: string;
  labelId: string;
  defaultValue?: string;
  error?: string;
  describedBy?: string;
  placeholder?: string;
};

export default function RichTextEditor({
  name = "content",
  labelId,
  defaultValue = "",
  error,
  describedBy,
  placeholder = "Tulis isi berita di sini…",
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef<ReactQuillType>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link"],
          ["image"],
          ["clean"],
        ],
        handlers: {
          image: () => fileRef.current?.click(),
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "blockquote",
    "link",
    "image",
  ];

  useEffect(() => {
    const root = quillRef.current?.getEditor()?.root;
    if (!root) return;
    root.id = "content-editor";
    root.setAttribute("aria-labelledby", labelId);
    if (describedBy) root.setAttribute("aria-describedby", describedBy);
    else root.removeAttribute("aria-describedby");
  }, [labelId, describedBy, error]);

  async function onPickImage(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 1200, quality: 0.8 });
      const range = editor.getSelection(true);
      const index = range ? range.index : editor.getLength();
      editor.insertEmbed(index, "image", dataUrl, "user");
      editor.setSelection(index + 1, 0);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="berita-quill relative">
      <input type="hidden" name={name} value={value} />
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => void onPickImage(e.target.files?.[0] || null)}
      />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
      {uploading ? (
        <p className="mt-2 text-xs font-medium text-clinic-teal">Menyisipkan gambar…</p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          Toolbar: heading, tebal/miring, daftar, kutipan, tautan, gambar. Gambar diisi otomatis
          dikompres.
        </p>
      )}
      {error ? (
        <p id="content-error" className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
