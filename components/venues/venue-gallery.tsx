"use client";

import Image from "next/image";
import { Images } from "lucide-react";

import type { GalleryImage } from "@/lib/venue-detail";

type Props = {
  images: GalleryImage[]; // diterima dari page.tsx
  totalPhotos: number;    // diterima dari page.tsx
  venueName: string;      // diterima dari page.tsx
};

export function VenueGallery({ images, totalPhotos, venueName }: Props) {
  // Pecah array jadi 2: gambar pertama (main) dan sisanya (thumbnails)
  const [main, ...thumbnails] = images;
  const lastThumbnailIndex = thumbnails.length - 1;

  //_slug tanpa foto tidak boleh bikin halaman crash saat baca main.src
  if (!main) return null;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_1fr]">
      {/* Gambar utama, kiri */}
      <div className="relative h-72 overflow-hidden rounded-xl md:h-[26rem]">
        <Image
          src={main.src}
          alt={main.title ?? venueName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {main.tag && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            {main.tag}
          </span>
        )}

        {(main.title || main.caption) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            {main.title && (
              <p className="text-base font-semibold">{main.title}</p>
            )}
            {main.caption && (
              <p className="text-xs text-white/80">{main.caption}</p>
            )}
          </div>
        )}

        <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
          1 / {totalPhotos}
        </span>
      </div>

      {/* 4 thumbnail, grid 2x2, kanan */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {thumbnails.map((img, i) => {
          const isLast = i === lastThumbnailIndex;

          return (
            <div
              key={`${img.src}-${i}`}
              className="relative h-[9rem] overflow-hidden rounded-xl md:h-full"
            >
              <Image
                src={img.src}
                alt={img.title ?? venueName}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />

              {img.title && !isLast && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                  <p className="text-xs font-semibold text-white">
                    {img.title}
                  </p>
                </div>
              )}

              {/* Overlay "View All Photos" khusus di gambar terakhir */}
              {isLast && (
                <button
                  type="button"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 text-white transition hover:bg-black/60"
                >
                  <Images className="size-5" />
                  <span className="text-xs font-semibold">
                    View All {totalPhotos} Photos
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}