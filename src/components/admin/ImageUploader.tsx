"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

export default function ImageUploader({ defaultImage }: { defaultImage?: string }) {
  const [images, setImages] = useState<string[]>(defaultImage && defaultImage !== '' ? [defaultImage] : []);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Fungsi Kompresi dan Konversi Gambar ke WebP
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // Standar Web: Max Width 1200px
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Konversi ke WebP dengan Kualitas 80% (Sangat ringan!)
          resolve(canvas.toDataURL("image/webp", 0.8));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files: File[]) => {
    setIsCompressing(true);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    const compressedImages = await Promise.all(validFiles.map(file => compressImage(file)));
    
    // Tambahkan gambar baru ke state yang sudah ada
    setImages(prev => [...prev, ...compressedImages]);
    setIsCompressing(false);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Fungsi untuk memindahkan gambar ke urutan pertama (menjadi Cover)
  const makeCover = (indexToPromote: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      const [promoted] = newImages.splice(indexToPromote, 1);
      newImages.unshift(promoted);
      return newImages;
    });
  };

  return (
    <div className="space-y-4">
      {/* Area Drag & Drop */}
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Klik atau Tarik Gambar ke Sini"
        />
        <div className="pointer-events-none">
          <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium text-slate-700">Tarik dan lepas gambar di sini, atau klik untuk memilih file</p>
          <p className="text-xs text-slate-500 mt-1">Mendukung banyak gambar. Otomatis dikompres & dikonversi ke WebP.</p>
        </div>
        
        {isCompressing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl backdrop-blur-sm z-10">
            <span className="text-teal-600 font-semibold animate-pulse">Sedang mengompres gambar...</span>
          </div>
        )}
      </div>

      {/* Preview Gambar */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video">
              <Image src={img} alt={`Preview ${index}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button 
                    type="button" 
                    onClick={() => makeCover(index)}
                    className="bg-teal-600 text-white text-xs px-2.5 py-1.5 rounded hover:bg-teal-700 transition-colors"
                    title="Jadikan Cover Utama"
                  >
                    Jadikan Cover
                  </button>
                )}
                <button 
                  type="button" 
                  onClick={() => removeImage(index)}
                  className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors"
                  title="Hapus gambar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {index === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-teal-600 text-white text-xs text-center py-1 font-medium z-10 pointer-events-none">Cover Utama</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hidden inputs untuk dikirim ke Server Action */}
      {images.map((img, index) => (
        <input key={index} type="hidden" name="images" value={img} />
      ))}
    </div>
  );
}