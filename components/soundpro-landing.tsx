"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, easeInOut } from "framer-motion"
import {
  X,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Mail,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HeroWorkShowcaseCard } from "@/components/hero-work-showcase-card"
import { CaseStudyCard, type CaseStudy } from "@/components/case-study-card"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: easeInOut,
  },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
}

const socialLinks = [
  {
    href: "https://www.instagram.com/soundproacoustic/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.facebook.com/358599897338607?ref=NONE_xav_ig_profile_page_web",
    label: "Facebook",
    icon: Facebook,
  },
]

const quickNavItems = [
  { label: "Chi siamo", id: "chi-siamo" },
  { label: "Perché", id: "why" },
  { label: "Lavori", id: "cases" },
  { label: "Contatti", id: "contact" },
]

const contactDetailItems = [
  { icon: MapPin, label: "Ubicazione", text: "Ercolano (NA), Italia" },
  { icon: Mail, label: "Email", text: "info@soundproacoustic.com" },
]

const ENABLE_ABOUT_PHOTO_PANEL = true

const ABOUT_SECTION_CONFIG = {
  photoSrc: "/about-soundpro-panel.jpeg",
  fallbackPhotoSrc: "/hero-product.jpg",
  imageAlt: "Pannello acustico Sound Pro con badge del brand",
  imageObjectPosition: "20% center",
}

const ENABLE_ABOUT_FULL_BLEED = true

const ENABLE_HERO_DESKTOP_DEZOOM = true

const ANCHOR_SCROLL_OFFSET = 100

const getAnchorOffset = () => {
  const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0
  return Math.max(ANCHOR_SCROLL_OFFSET, Math.round(headerHeight + 32))
}

const scrollToSection = (sectionId: string, options: { updateHash?: boolean } = {}) => {
  if (typeof window === "undefined") return

  const normalizedId = sectionId.replace(/^#/, "")
  const target = document.getElementById(normalizedId)

  if (!target) return

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const top = Math.max(target.getBoundingClientRect().top + window.scrollY - getAnchorOffset(), 0)

  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  })

  if (options.updateHash === false) return

  const nextHash = `#${normalizedId}`
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, "", nextHash)
  }
}

// Case study data model: each item is ready to receive future image galleries.
const caseStudies: CaseStudy[] = [
  {
    id: "case1",
    imageBasePath: "/cases/case1",
    images: [
      "/cases/case1/case1-1.jpg",
      "/cases/case1/case1-2.jpg",
      "/cases/case1/case1-3.jpg",
      "/cases/case1/case1-4.jpg",
      "/cases/case1/case1-5.jpg",
    ],
    problem: "Rimbombo eccessivo sui bassi, suono confuso.",
    solution: "Bass trap con scutter integrato e mix di diffusori e assorbitori, posizionamento strategico.",
    result: "Chiarezza sui transienti, suono definito.",
  },
  {
    id: "case2",
    imageBasePath: "/cases/case2",
    images: [
      "/cases/case2/case2-1.jpeg",
      "/cases/case2/case2-2.jpeg",
      "/cases/case2/case2-3.jpeg",
      "/cases/case2/case2-4.jpg",
    ],
    problem: "Riverbero eccessivo.",
    solution: "Bass trap negli angoli e pannelli acustici su misura posizionati sui punti di prima riflessione.",
    result: "Migliore definizione sonora.",
  },
  {
    id: "case3",
    imageBasePath: "/cases/case3",
    images: [
      "/cases/case3/case3-1.jpeg",
      "/cases/case3/case3-2.jpeg",
      "/cases/case3/case3-3.jpeg",
      "/cases/case3/case3-4.jpeg",
      "/cases/case3/case3-5.jpeg",
    ],
    problem: "Confusione nei transienti.",
    solution: "Mix di assorbitori e diffusori posizionati ad-hoc.",
    result: "Dettaglio e precisione, con un suono più naturale.",
  },
  {
    id: "case4",
    imageBasePath: "/cases/case4",
    images: [
      "/cases/case4/case4-1.jpg",
      "/cases/case4/case4-2.jpg",
      "/cases/case4/case4-3.jpg",
      "/cases/case4/case4-4.jpg",
    ],
    problem: "Rimbombo eccessivo, problemi di fase.",
    solution: "Mix di diffusori e assorbitori su misura.",
    result: "Dettaglio e precisione, immagine stereofonica più coerente.",
  },
]

export function SoundProLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [formError, setFormError] = useState("")
  const [isFormCompleted, setIsFormCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFilesCount, setSelectedFilesCount] = useState(0)
  const [aboutPanelImageSrc, setAboutPanelImageSrc] = useState(ABOUT_SECTION_CONFIG.photoSrc)
  // Feature flags
  const ENABLE_SECTION_DIVIDERS = false
  const ENABLE_HERO_WORK_SHOWCASE = true // reversible: set false to restore single static hero image
  const ENABLE_CASES_VISUAL_GALLERY = true // reversible: set false to keep all case cards in static mode

  useEffect(() => {
    let rafId = 0

    const handleScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        const nextIsScrolled = window.scrollY > 50
        setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled))
        rafId = 0
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    let frameId = 0

    const syncHashScroll = () => {
      if (!window.location.hash) return

      frameId = window.requestAnimationFrame(() => {
        scrollToSection(window.location.hash, { updateHash: false })
      })
    }

    syncHashScroll()
    window.addEventListener("hashchange", syncHashScroll)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener("hashchange", syncHashScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)
    setFormError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("submit_failed")
      }

      setIsFormCompleted(true)
      setSelectedFilesCount(0)
      form.reset()
    } catch {
      setFormError("Invio non riuscito. Riprova tra poco o contattaci via email.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f0e8] via-[#e1e1e1] to-muted/20" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Header */}
      <motion.header
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
          <div className="w-full px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between max-w-full">
            <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/soundpro-logo.png"
                alt="SoundPro Acoustic"
                width={260}
                height={120}
                priority
                className="h-16 md:h-20 w-auto"
              />
            </Link>
          </div>
          {/* services marquee center */}
          <div className="hidden md:flex items-center flex-1 mx-4 overflow-hidden relative">
            <motion.div
              className="whitespace-nowrap text-sm md:text-base flex items-center"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
            >
              {['Trattamento acustico', 'Isolamento acustico', 'Design', 'Consulenza']
                .map((t, i, arr) => `${t}${i < arr.length - 1 ? ' | ' : ''}`)
                .join(' ')}
            </motion.div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button
              size="sm"
              className="rounded-full hover:scale-105 transition-transform duration-150"
              onClick={() => scrollToSection("contact", { updateHash: false })}
            >
              Richiedi i nostri servizi
            </Button>
          </div>
          <button className="flex md:hidden items-center justify-center h-10 w-10" onClick={toggleMenu} aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}>
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <span className="inline-flex flex-col gap-1">
                <span className="block h-0.5 w-7 rounded-full bg-foreground" />
                <span className="block h-0.5 w-7 rounded-full bg-foreground" />
                <span className="block h-0.5 w-7 rounded-full bg-foreground" />
              </span>
            )}
            <span className="sr-only">{isMenuOpen ? "Chiudi menu" : "Apri menu"}</span>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background md:hidden pt-16"
        >
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full px-4 md:px-6 lg:px-8 grid gap-3 pb-8 pt-6"
          >
            {quickNavItems.map((item) => (
              <motion.div key={item.id} variants={itemFadeIn}>
                <Link
                  href={`#${item.id}`}
                  className="flex items-center justify-between rounded-3xl px-3 py-2 text-lg font-medium hover:bg-accent"
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(item.id)
                    setIsMenuOpen(false)
                  }}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="landing-hero-section relative flex w-full min-h-screen items-center overflow-hidden">
          <div className="landing-hero-content relative z-10 w-full max-w-full px-4 md:px-6 lg:px-8">
            <div className="landing-hero-grid mx-auto grid max-w-[92rem] items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={false}
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInLeft}
                className="landing-hero-copy flex flex-col justify-center space-y-4 py-10"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground/80 sm:text-xs md:text-sm">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.1 }}
                      className="inline-flex items-center gap-3 whitespace-nowrap"
                    >
                      <span aria-hidden="true" className="h-px w-6 bg-primary/35" />
                      <span>Pannelli acustici su misura</span>
                    </motion.span>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary/35" />
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      Spazio sonoro ottimizzato
                    </motion.span>
                  </div>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  >
                    Il tuo spazio suona male?{" "}
                    <motion.span
                      className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent inline-block"
                      animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Scopri come trasformarlo in 48 ore.
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                  >
                    Non sono i pannelli che mancano. È l&apos;analisi giusta. Progettiamo l&apos;acustica del tuo spazio nei minimi dettagli.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="rounded-full group"
                      onClick={() => scrollToSection("contact", { updateHash: false })}
                    >
                      Richiedi i nostri servizi
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </motion.span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full"
                      onClick={() => scrollToSection("why", { updateHash: false })}
                    >
                      Scopri di più
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={false}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="landing-hero-media-shell flex h-full items-center justify-center"
              >
                <motion.div
                  animate={floatingAnimation}
                  className={`landing-hero-media relative h-[360px] w-full sm:h-[460px] md:h-[560px] lg:h-auto ${
                    ENABLE_HERO_DESKTOP_DEZOOM
                      ? "lg:-mr-8 xl:-mr-10 lg:w-[122%] xl:w-[128%] lg:aspect-[16/9] xl:aspect-[20/11] lg:max-h-[680px]"
                      : "lg:-mr-16 lg:w-[135%] xl:w-[140%] lg:aspect-[16/9] xl:aspect-[20/11] lg:max-h-[720px]"
                  } overflow-hidden rounded-[40px] flex items-center justify-center shadow-2xl lg:ml-auto`}
                >
                {/* Reversible Hero visual upgrade: auto-rotating showcase card */}
                {ENABLE_HERO_WORK_SHOWCASE ? (
                  <HeroWorkShowcaseCard />
                ) : (
                  <Image
                    src="/hero-product.jpg"
                    alt="Pannello acustico personalizzato"
                    fill
                    priority
                    sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 50vw, 100vw"
                    className="object-cover rounded-3xl"
                  />
                )}
                </motion.div>
              </motion.div>
            </div>
          </div>
          <div className="landing-hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent via-[#dce5e8]/10 to-[#dce5e8]/28 md:h-10" />
        </section>

        {/* About Section */}
        <section
          id="chi-siamo"
          className={`anchor-section relative w-full overflow-hidden ${
            ENABLE_ABOUT_FULL_BLEED
              ? "bg-[#dce5e8]"
              : "py-5 md:py-7 lg:py-8 bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc]"
          }`}
        >
          {ENABLE_ABOUT_FULL_BLEED ? (
            <>
              {ENABLE_ABOUT_PHOTO_PANEL && (
                <>
                  <div className="absolute inset-0">
                    <Image
                      src={aboutPanelImageSrc}
                      alt={ABOUT_SECTION_CONFIG.imageAlt}
                      fill
                      sizes="100vw"
                      className="object-cover opacity-[0.88] saturate-[0.82] brightness-[0.8] scale-[1.02]"
                      style={{ objectPosition: ABOUT_SECTION_CONFIG.imageObjectPosition }}
                      onError={() => {
                        setAboutPanelImageSrc((currentSrc) => {
                          if (currentSrc === ABOUT_SECTION_CONFIG.fallbackPhotoSrc) {
                            return currentSrc
                          }
                          return ABOUT_SECTION_CONFIG.fallbackPhotoSrc
                        })
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,41,48,0.14)_0%,rgba(33,53,61,0.08)_24%,rgba(235,241,243,0.18)_58%,rgba(245,247,248,0.3)_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(236,242,244,0.22)_0%,rgba(236,242,244,0.18)_32%,rgba(240,244,245,0.24)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.16),rgba(255,255,255,0.05)_38%,transparent_68%)]" />
                </>
              )}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative z-10 w-full"
              >
                <div className="mx-auto flex min-h-[360px] max-w-[92rem] items-center justify-center px-6 py-10 sm:min-h-[420px] md:px-8 md:py-12 lg:min-h-[500px] lg:px-10 lg:py-14">
                  <div className="w-full max-w-[44rem] text-center">
                    <div className="inline-flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/82 sm:text-xs">
                      
                    </div>
                    <h2 className="mt-3 text-4xl font-bold tracking-tighter text-white sm:text-5xl lg:text-[4.25rem]">
                      Chi siamo
                    </h2>
                    <div className="mx-auto mt-4 max-w-[40rem] space-y-2 text-sm leading-relaxed text-white/88 sm:text-base md:text-[1.04rem]">
                      <p>
                        Sound Pro Acoustic Design nasce nel 2022 a Ercolano, dall&apos;incontro tra musica, acustica e cura artigianale del dettaglio.
                      </p>
                      <p>
                        Progettiamo interventi acustici per spazi in cui il suono non può essere lasciato al caso, con un approccio concreto e attenzione anche all&apos;estetica.
                      </p>
                    </div>
                    <p className="mt-5 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/70 sm:text-[0.78rem]">
                      Ercolano, Napoli
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 md:h-14 bg-gradient-to-b from-[#f8fafc]/90 via-[#f8fafc]/40 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-[#f8fafc]/80 via-[#f8fafc]/20 to-transparent" />
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
              >
                <div className="mx-auto max-w-[90rem]">
                  <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/52 shadow-[0_30px_90px_rgba(64,94,117,0.12)]">
                    {ENABLE_ABOUT_PHOTO_PANEL && (
                      <>
                        <div className="absolute inset-0">
                          <Image
                            src={aboutPanelImageSrc}
                            alt={ABOUT_SECTION_CONFIG.imageAlt}
                            fill
                            sizes="(min-width: 1536px) 78rem, (min-width: 1024px) 88vw, 100vw"
                            className="object-cover opacity-76 saturate-[0.88] brightness-[0.9] scale-[1.03]"
                            style={{ objectPosition: ABOUT_SECTION_CONFIG.imageObjectPosition }}
                            onError={() => {
                              setAboutPanelImageSrc((currentSrc) => {
                                if (currentSrc === ABOUT_SECTION_CONFIG.fallbackPhotoSrc) {
                                  return currentSrc
                                }
                                return ABOUT_SECTION_CONFIG.fallbackPhotoSrc
                              })
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.28)_0%,rgba(248,250,252,0.22)_24%,rgba(248,250,252,0.3)_52%,rgba(255,255,255,0.42)_100%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.24),rgba(255,255,255,0.08)_42%,transparent_74%)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.08)_36%,rgba(255,255,255,0.12)_100%)]" />
                      </>
                    )}

                    <div className="relative z-10 flex min-h-[320px] items-center justify-center px-5 py-8 sm:min-h-[350px] sm:px-7 sm:py-10 lg:min-h-[390px] lg:px-10 lg:py-12">
                      <div className="w-full max-w-[46rem] rounded-[28px] border border-white/42 bg-white/18 p-5 text-center backdrop-blur-[10px] sm:p-6 lg:max-w-[42rem] lg:p-8">
                        <div className="inline-flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/88 sm:text-xs">
                          <span aria-hidden="true" className="h-px w-6 bg-slate-500/40" />
                          <span>Sound Pro Acoustic Design</span>
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-[2.8rem]">Chi siamo</h2>
                        <div className="mx-auto mt-3 max-w-[39rem] space-y-2 text-sm leading-relaxed text-white/88 sm:text-[0.98rem] md:text-[1.02rem]">
                          <p>
                            Sound Pro Acoustic Design nasce nel 2022 a Ercolano, dall&apos;incontro tra musica, acustica e cura artigianale del dettaglio.
                          </p>
                          <p>
                            Progettiamo interventi acustici per spazi in cui il suono non può essere lasciato al caso, con un approccio concreto e attenzione anche all&apos;estetica.
                          </p>
                        </div>
                        <p className="mt-4 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/72 sm:text-[0.78rem]">
                          Ercolano, Napoli
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </section>


        {/* Method Section */}
        <section
          id="method"
          className="anchor-section w-full py-8 md:py-14 lg:py-16 bg-[#eef3f5] relative overflow-hidden"
        >
          <div className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full">
            <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-10"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Come lavoriamo</h2>
              <p className="mx-auto max-w-[760px] lg:max-w-[900px] text-muted-foreground md:text-xl">
                Un processo trasparente e scientifico in 3 step
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3 relative max-w-[90rem] mx-auto">
              {/* Animated connecting line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent hidden md:block"
                style={{ originX: 0 }}
              />

              {[
                {
                  step: "1",
                  title: "Sopralluogo e Misurazione",
                  description:
                    "Visitiamo il tuo spazio e rileviamo con strumenti professionali la risposta in frequenze, riverbero e problemi di fase, per partire da dati reali.",
                },
                {
                  step: "2",
                  title: "Progettazione",
                  description:
                    "Progettiamo pannelli acustici su misura per il TUO spazio, con ogni dettaglio calcolato e supportato da un render grafico avanzato.",
                },
                {
                  step: "3",
                  title: "Realizzazione Artigianale",
                  description: "Costruiamo ogni elemento a mano, con materiali di alta qualità. Installazione professionale su richiesta.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="relative rounded-3xl border bg-background p-6 shadow-sm group hover:shadow-lg hover:border-primary/50 transition-all"
                >
                  <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-500 text-white flex items-center justify-center font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 mt-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          </div>
        </section>

        {/* Why Section */}
        {ENABLE_SECTION_DIVIDERS && (
          <div className="relative h-12 md:h-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#f1f5f9] via-[#eef3f8] to-[#edf3f8]" />
            <div className="absolute inset-x-[10%] top-1/2 h-8 -translate-y-1/2 rounded-full bg-white/35 blur-2xl" />
          </div>
        )}
        <section
          id="why"
          className="anchor-section w-full py-8 md:py-14 lg:py-16 bg-[#ecf1f3] relative overflow-hidden"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Perché i pannelli standard non risolvono il tuo problema
              </h2>
              <p className="mx-auto max-w-[760px] lg:max-w-[900px] text-muted-foreground md:text-xl">
                Comprare pannelli acustici online è facile. Risolvere davvero i problemi di suono del tuo spazio è
                un&apos;altra cosa.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-3 max-w-[88rem] mx-auto"
            >
              {[
                {
                  icon: "🏠",
                  title: "Ogni stanza è unica",
                  description:
                    "Rimbombo, riverbero e problemi di fase cambiano da ambiente a ambiente. I pannelli generici ignorano questo.",
                },
                {
                  icon: "📏",
                  title: "Misurazioni precise = Risultati reali",
                  description:
                    "Senza dati acustici, stai solo indovinando. Noi misuriamo con strumenti professionali.",
                },
                {
                  icon: "🛠️",
                  title: "Materiali scelti, lavorazione artigianale",
                  description:
                    "Realizziamo pannelli artigianali con materiali selezionati, come legno massello e multistrato, lane minerali certificate e tessuti fonotraspiranti, per integrarsi nel tuo spazio con efficacia e cura estetica.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 20px 40px rgba(107, 163, 212, 0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="rounded-3xl border bg-background p-6 shadow-sm group relative overflow-hidden"
                >
                  <div className="relative z-10 space-y-3">
                    <div 
                      className="text-4xl"
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {ENABLE_SECTION_DIVIDERS && (
          <div className="relative h-12 md:h-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#eef2f7] via-[#ebf0f6] to-[#e9eff6]" />
            <div className="absolute inset-x-[10%] top-1/2 h-8 -translate-y-1/2 rounded-full bg-white/30 blur-2xl" />
          </div>
        )}

        {/* Cases Section */}
        <section
          id="cases"
          className="anchor-section w-full py-10 md:py-16 lg:py-20 bg-gradient-to-b from-[#ecf1f3] via-[#eff2f1] to-[#f3eee6] relative overflow-hidden"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
          >
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-10"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Spazi trasformati</h2>
              <p className="mx-auto max-w-[760px] lg:max-w-[900px] text-muted-foreground md:text-xl">
                Vedi come abbiamo trasformato gli ambienti dei nostri clienti
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-[90rem] xl:max-w-[104rem] 2xl:max-w-[112rem] mx-auto">
              {caseStudies.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="rounded-3xl border bg-background p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <CaseStudyCard item={item} enableGallery={ENABLE_CASES_VISUAL_GALLERY} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="anchor-section w-full py-10 md:py-14 lg:py-16 relative overflow-hidden bg-[#f3eee6]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
          >
            <div className="max-w-[90rem] mx-auto rounded-[32px] border border-white/60 bg-background/78 px-5 py-6 shadow-[0_26px_70px_rgba(64,94,117,0.1)] backdrop-blur-sm sm:px-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
              <div className="mx-auto max-w-[48rem] text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pronto a trasformare il tuo spazio?
                </h2>
                <p className="mt-3 text-muted-foreground md:text-xl">
                  Raccontaci il tuo progetto e compila il form. Ti ricontatteremo entro 24 ore con i prossimi passi per l&apos;analisi acustica del tuo spazio.
                </p>
              </div>

              <div className="mt-8 mx-auto max-w-[52rem]">
                <div className="mb-4 inline-flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground/80 sm:text-xs">
                  <span aria-hidden="true" className="h-px w-6 bg-primary/35" />
                  <span>Richiedi i nostri servizi</span>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="rounded-3xl border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AnimatePresence mode="wait">
                    {!isFormCompleted ? (
                      <motion.form
                        key="contact-form"
                        onSubmit={handleFormSubmit}
                        className="space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <h3 className="mb-2 text-xl font-bold">Compila il form</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Input
                              name="name"
                              placeholder="Nome"
                              required
                              className="rounded-2xl border-[#d8dde4] bg-[#f3f5f7] focus-visible:border-primary/50 focus-visible:ring-primary/20"
                            />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Input
                              name="email"
                              type="email"
                              placeholder="Email"
                              required
                              className="rounded-2xl border-[#d8dde4] bg-[#f3f5f7] focus-visible:border-primary/50 focus-visible:ring-primary/20"
                            />
                          </motion.div>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Input name="phone" type="tel" placeholder="Telefono (opzionale)" className="rounded-2xl" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="relative">
                          <select
                            name="service"
                            className="w-full appearance-none rounded-2xl border border-[#d8dde4] bg-[#f3f5f7] px-3 py-2 pr-10 text-sm text-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          >
                            <option value="">Seleziona servizio</option>
                            <option>Progetto acustico (sopralluogo + misurazione)</option>
                            <option>Prodotti su misura (pannelli acustici artigianali)</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Textarea
                            name="message"
                            placeholder="Descrivi il tuo progetto"
                            className="rounded-2xl border-[#d8dde4] bg-[#f3f5f7] focus-visible:border-primary/50 focus-visible:ring-primary/20"
                            rows={4}
                          />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Input name="roomSize" type="text" placeholder="Misura stanza (es: 5m x 4m x 3m)" className="rounded-2xl" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                          <label htmlFor="attachments" className="text-sm font-medium">
                            Allegati (opzionale)
                          </label>
                          <input
                            id="attachments"
                            name="attachments"
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            onChange={(e) => setSelectedFilesCount(e.target.files?.length ?? 0)}
                            className="block w-full rounded-2xl border border-input bg-background px-3 py-2 text-xs sm:text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs sm:file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            Carica planimetrie, foto o documenti ({selectedFilesCount} selezionati).
                          </p>
                        </motion.div>
                        <label className="flex items-center gap-2">
                          <input name="privacyAccepted" type="checkbox" required />
                          <span className="text-sm underline underline-offset-2">Accetto la privacy</span>
                        </label>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
                            {isSubmitting ? "Invio in corso..." : "Invia"}
                          </Button>
                        </motion.div>
                        {formError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {formError}
                          </motion.div>
                        )}
                      </motion.form>
                    ) : (
                      <motion.div
                        key="contact-thank-you"
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="space-y-5"
                      >
                        <div className="inline-flex items-center rounded-full border border-primary/30 bg-background/80 px-3 py-1 text-xs font-medium text-primary">
                          Richiesta inviata
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-2xl font-bold tracking-tight">Grazie per averci contattato.</h4>
                          <p className="text-sm text-muted-foreground sm:text-base">
                            Ti risponderemo entro 24 ore con i prossimi passi per l&apos;analisi acustica del tuo spazio.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-primary/20 bg-background/70 p-4">
                          <p className="text-sm font-medium">Nel frattempo, seguici sui social:</p>
                          <div className="mt-3 flex items-center gap-3">
                            {socialLinks.map((social) => (
                              <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-input bg-background p-2 text-muted-foreground transition-colors hover:text-primary"
                                aria-label={social.label}
                              >
                                <social.icon className="h-5 w-5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="mt-6 border-t border-border/70 pt-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {contactDetailItems.map((item) => (
                        <motion.div
                          key={item.label}
                          whileHover={{ x: 6 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex items-start gap-3 group"
                        >
                          <motion.div
                            className="rounded-full bg-primary/20 p-2 group-hover:bg-primary/30 transition-colors"
                            whileHover={{ scale: 1.08, rotate: 4 }}
                          >
                            <item.icon className="h-5 w-5 text-primary" />
                          </motion.div>
                          <div>
                            <h3 className="font-medium">{item.label}</h3>
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background">
        <div className="w-full px-4 md:px-6 lg:px-8 py-8 max-w-full">
          <div className="grid gap-8 md:grid-cols-3 max-w-[90rem] mx-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/soundpro-logo.png"
                  alt="SoundPro Acoustic"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Pannelli acustici su misura per home studio, sale d&apos;ascolto e ambienti professionali.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Link veloci</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                {quickNavItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary"
                    onClick={(event) => {
                      event.preventDefault()
                      scrollToSection(item.id)
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Contatti</h4>
              <p className="text-sm text-muted-foreground">
                Ercolano (NA), Italia
                <br />
                info@soundproacoustic.com
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row max-w-[90rem] mx-auto">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SoundPro Acoustic. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Fatto con passione a Ercolano</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
