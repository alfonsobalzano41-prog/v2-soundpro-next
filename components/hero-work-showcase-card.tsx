"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

type HeroShowcaseImage = {
  src: string
  alt: string
  objectPosition?: string
}

type HeroWorkShowcaseCardProps = {
  enabled?: boolean
  onReady?: () => void
}

// Reversible Hero config: timing and motion can be tuned/disabled in one place.
const HERO_SHOWCASE_CONFIG = {
  rotationIntervalMs: 5800,
  crossfadeSeconds: 1.15,
  preloadAhead: 1,
  fadeHoldProgress: 0.55,
  entryScale: 1.065,
  activeScale: 1.04,
  fallbackSrc: "/hero-product.jpg",
}

// Hero photos already present in /public.
// Ordered to alternate cool/warm scenes for a smoother visual rhythm.
const HERO_SHOWCASE_IMAGES: HeroShowcaseImage[] = [
  {
    src: "/hero-product.jpg",
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

export function HeroWorkShowcaseCard({ enabled = true, onReady }: HeroWorkShowcaseCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fallbackBySrc, setFallbackBySrc] = useState<Record<string, boolean>>({})
  const hasReportedReadyRef = useRef(false)

  const reportReady = () => {
    if (hasReportedReadyRef.current) return
    hasReportedReadyRef.current = true
    onReady?.()
  }

  useEffect(() => {
    if (!enabled || HERO_SHOWCASE_IMAGES.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SHOWCASE_IMAGES.length)
    }, HERO_SHOWCASE_CONFIG.rotationIntervalMs)

    return () => window.clearInterval(timer)
  }, [enabled])

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
  const resolvedSrc = fallbackBySrc[activeImage.src] ? HERO_SHOWCASE_CONFIG.fallbackSrc : activeImage.src
  const slideMotionDurationSeconds =
    HERO_SHOWCASE_CONFIG.rotationIntervalMs / 1000 + HERO_SHOWCASE_CONFIG.crossfadeSeconds

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeImage.src}
            className="absolute inset-[-2px] transform-gpu will-change-transform"
            initial={{ opacity: 0, scale: HERO_SHOWCASE_CONFIG.entryScale }}
            animate={{
              opacity: [0, 1, 1],
              scale: HERO_SHOWCASE_CONFIG.activeScale,
            }}
            exit={{ opacity: [1, 1, 0] }}
            transition={{
              opacity: {
                duration: HERO_SHOWCASE_CONFIG.crossfadeSeconds,
                times: [0, HERO_SHOWCASE_CONFIG.fadeHoldProgress, 1],
                ease: "easeInOut",
              },
              scale: {
                duration: slideMotionDurationSeconds,
                ease: "easeOut",
              },
            }}
          >
            <Image
              src={resolvedSrc}
              alt={activeImage.alt}
              fill
              priority={activeIndex === 0}
              sizes="(min-width: 1536px) 58rem, (min-width: 1280px) 53rem, (min-width: 1024px) 48vw, 100vw"
              className="object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
              style={{ objectPosition: activeImage.objectPosition ?? "center center" }}
              onLoad={reportReady}
              onError={() => {
                setFallbackBySrc((prev) => {
                  if (prev[activeImage.src]) return prev
                  return { ...prev, [activeImage.src]: true }
                })
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />
    </div>
  )
}
