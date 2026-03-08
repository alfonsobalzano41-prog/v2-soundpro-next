"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

type HeroShowcaseImage = {
  src: string
  alt: string
  objectPosition?: string
}

type HeroWorkShowcaseCardProps = {
  enabled?: boolean
}

// Reversible Hero config: timing and motion can be tuned/disabled in one place.
const HERO_SHOWCASE_CONFIG = {
  rotationIntervalMs: 4500,
  floatDurationSeconds: 6.8,
  crossfadeSeconds: 0.75,
  preloadAhead: 2,
  baseScale: 1,
  activeScale: 1.035,
  hoverScale: 1.018,
}

// Hero photos already present in /public.
// Ordered to alternate cool/warm scenes for a smoother visual rhythm.
const HERO_SHOWCASE_IMAGES: HeroShowcaseImage[] = [
  {
    src: "/Campanile-18.JPEG",
    alt: "Studio trattato SoundPro con pannelli acustici su misura",
    objectPosition: "center center",
  },
  {
    src: "/HERO-Campanile-17.jpeg",
    alt: "Studio trattato con pannelli acustici artigianali",
    objectPosition: "center center",
  },
  {
    src: "/Studio-Rosso-Hero.jpg",
    alt: "Control room con trattamento acustico e setup produzione",
    objectPosition: "center center",
  },
  {
    src: "/hero-2-Campanile-10.jpeg",
    alt: "Postazione studio con monitor e pannelli su misura",
    objectPosition: "center center",
  },
  {
    src: "/HQ-Paradise-Studio-HERO.jpeg",
    alt: "Setup amplificatori con pannelli acustici ad alte prestazioni",
    objectPosition: "center 38%",
  },
  {
    src: "/HQ-Paradise-Studio-HERO-2jpeg.jpeg",
    alt: "Ambiente trattato SoundPro con illuminazione cinematica",
    objectPosition: "center center",
  },
]

export function HeroWorkShowcaseCard({ enabled = true }: HeroWorkShowcaseCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [fallbackBySrc, setFallbackBySrc] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!enabled || HERO_SHOWCASE_IMAGES.length <= 1 || isHovered) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SHOWCASE_IMAGES.length)
    }, HERO_SHOWCASE_CONFIG.rotationIntervalMs)

    return () => window.clearInterval(timer)
  }, [enabled, isHovered])

  useEffect(() => {
    if (!enabled || HERO_SHOWCASE_IMAGES.length === 0) return

    // Progressive preload: current + next slides to keep crossfade smooth.
    const preloadIndexes = Array.from({ length: Math.min(HERO_SHOWCASE_CONFIG.preloadAhead + 1, HERO_SHOWCASE_IMAGES.length) }, (_, offset) => {
      return (activeIndex + offset) % HERO_SHOWCASE_IMAGES.length
    })

    preloadIndexes.forEach((index) => {
      const src = HERO_SHOWCASE_IMAGES[index]?.src
      if (!src) return
      const img = new window.Image()
      img.src = src
    })
  }, [activeIndex, enabled])

  if (!enabled || HERO_SHOWCASE_IMAGES.length === 0) return null

  const activeImage = HERO_SHOWCASE_IMAGES[activeIndex]
  const resolvedSrc = fallbackBySrc[activeImage.src] ? "/hero-product.jpg" : activeImage.src

  return (
    <motion.div
      // Organic premium interaction: light zoom/lift and richer shadow on hover.
      className="group relative h-full w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={isHovered ? { scale: HERO_SHOWCASE_CONFIG.hoverScale, y: -3 } : { scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{
        boxShadow: "0 28px 58px rgba(31, 41, 55, 0.28)",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={isHovered ? { y: -1 } : { y: [0, -7, 0] }}
        transition={
          isHovered
            ? { duration: 0.5, ease: "easeOut" }
            : {
                duration: HERO_SHOWCASE_CONFIG.floatDurationSeconds,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage.src}
            className="relative h-full w-full"
            initial={{ opacity: 0, scale: HERO_SHOWCASE_CONFIG.baseScale }}
            animate={{ opacity: 1, scale: HERO_SHOWCASE_CONFIG.activeScale }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              duration: HERO_SHOWCASE_CONFIG.crossfadeSeconds,
              ease: "easeInOut",
            }}
          >
            <Image
              src={resolvedSrc}
              alt={activeImage.alt}
              fill
              priority={activeIndex === 0}
              sizes="(min-width: 1536px) 64rem, (min-width: 1280px) 58rem, (min-width: 1024px) 52vw, 100vw"
              className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
              style={{ objectPosition: activeImage.objectPosition ?? "center center" }}
              onError={() => {
                setFallbackBySrc((prev) => {
                  if (prev[activeImage.src]) return prev
                  return { ...prev, [activeImage.src]: true }
                })
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 transition-opacity duration-500 group-hover:opacity-80" />
    </motion.div>
  )
}
