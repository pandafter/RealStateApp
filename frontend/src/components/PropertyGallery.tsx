"use client";

import { useState } from "react";

export default function PropertyGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <section>
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
        <div className="aspect-[4/3] w-full">
          <img
            src={images[active]}
            alt={`Foto ${active + 1}`}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 overflow-hidden rounded-md border transition ${
                i === active ? "border-indigo-600 ring-2 ring-indigo-100" : "border-gray-200"
              }`}
              aria-label={`Miniatura ${i + 1}`}
            >
              <img src={src} alt={`Miniatura ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
