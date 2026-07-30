"use client";

import { useState, useEffect } from "react";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";

export default function ArticleContent({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Secara otomatis mencari semua gambar di dalam artikel
    const imgEls = document.querySelectorAll(".article-body img");
    const srcs = Array.from(imgEls).map((img) => (img as HTMLImageElement).src);
    setImages(srcs);
  }, [content]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Jika user mengklik gambar, buka Lightbox (Zoom Layar Penuh)
    if (target.tagName === "IMG") {
      const src = (target as HTMLImageElement).src;
      setCurrentImg(src);
      setIsOpen(true);
    }
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = images.indexOf(currentImg);
    if (idx !== -1) setCurrentImg(images[(idx + 1) % images.length]);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = images.indexOf(currentImg);
    if (idx !== -1) setCurrentImg(images[(idx - 1 + images.length) % images.length]);
  };

  return (
    <>
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(content) }}
        onClick={handleClick}
      />

      {/* Area Zoom (Lightbox) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl transition-all z-50"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>

          {images.length > 1 && (
            <button 
              className="absolute left-2 sm:left-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-2xl transition-all z-50"
              onClick={prevImg}
            >
              &#10094;
            </button>
          )}

          <img 
            src={currentImg} alt="Zoomed image" 
            className="max-w-[95%] max-h-[90vh] object-contain rounded-md shadow-2xl transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} // Mencegah tertutup saat gambarnya sendiri diklik
          />

          {images.length > 1 && (
            <button 
              className="absolute right-2 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-2xl transition-all z-50"
              onClick={nextImg}
            >
              &#10095;
            </button>
          )}
        </div>
      )}
    </>
  );
}