"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

export type CaseStudy = {
  id: string
  problem: string
  solution: string
  result: string
  imageBasePath: string
  images: string[]
}

type CaseStudyCardProps = {
  item: CaseStudy
  enableGallery?: boolean
}

const VISIBLE_THUMBNAILS = 3
const CASE_GALLERY_PRELOAD_AHEAD = 2

export function CaseStudyCard({ item, enableGallery = false }: CaseStudyCardProps) {
  const galleryImages = useMemo(() => item.images, [item.images])
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const hasImages = galleryImages.length > 0
  const galleryEnabled = enableGallery && galleryImages.length > 1
  const safeIndex = hasImages ? Math.min(activeImageIndex, galleryImages.length - 1) : 0
  const activeImage = hasImages ? galleryImages[safeIndex] : null
  const visibleThumbs = galleryEnabled
    ? Array.from({ length: Math.min(VISIBLE_THUMBNAILS, galleryImages.length) }, (_, offset) => {
        const imageIndex = (safeIndex + offset) % galleryImages.length
        return { image: galleryImages[imageIndex], imageIndex }
      })
    : []

  useEffect(() => {
    if (!galleryEnabled || galleryImages.length === 0) return

    // Preload active + upcoming gallery images for instant thumbnail switch.
    const preloadIndexes = Array.from({ length: Math.min(CASE_GALLERY_PRELOAD_AHEAD + 1, galleryImages.length) }, (_, offset) => {
      return (safeIndex + offset) % galleryImages.length
    })

    preloadIndexes.forEach((index) => {
      const src = galleryImages[index]
      if (!src) return
      const img = new window.Image()
      img.src = src
    })
  }, [galleryEnabled, galleryImages, safeIndex])

  return (
    <div className="relative z-10">
      <div className="mb-4 space-y-3">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 transform-gpu [backface-visibility:hidden] [transform:translateZ(0)]">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={`Case ${item.id} - immagine ${safeIndex + 1}`}
              fill
              sizes="(min-width: 1280px) 26vw, (min-width: 768px) 42vw, 100vw"
                  className="object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
              priority={safeIndex === 0}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground sm:text-sm">
              Area immagine pronta ({item.imageBasePath})
            </div>
          )}
        </div>

        {galleryEnabled && (
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${Math.min(VISIBLE_THUMBNAILS, galleryImages.length)}, minmax(0, 1fr))` }}
          >
            {visibleThumbs.map(({ image, imageIndex }) => {
              const isActive = imageIndex === safeIndex
              return (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImageIndex(imageIndex)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "border-primary ring-2 ring-primary/35"
                      : "border-border hover:border-primary/50 hover:scale-[1.02]"
                  }`}
                  aria-label={`Mostra immagine ${imageIndex + 1} del caso studio`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${imageIndex + 1} case ${item.id}`}
                    fill
                    sizes="(min-width: 1280px) 6vw, (min-width: 768px) 10vw, 22vw"
                    className="object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
                    loading={imageIndex === 0 ? "eager" : "lazy"}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>

      <p className="mb-2 text-sm font-semibold text-primary">Problema</p>
      <p className="mb-3 text-sm">{item.problem}</p>
      <p className="mb-2 text-sm font-semibold text-primary">Soluzione</p>
      <p className="mb-3 text-sm">{item.solution}</p>
      <p className="mb-2 text-sm font-semibold text-primary">Risultato</p>
      <p className="text-sm text-muted-foreground">{item.result}</p>
    </div>
  )
}
