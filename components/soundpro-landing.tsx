"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
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

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

const pulseAnimation = {
  scale: [1, 1.03, 1],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export function SoundProLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [formMessage, setFormMessage] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    
    // Enable smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormMessage("Ricevuto! Ti contatteremo entro 24 ore. Grazie di aver scelto SoundPro Acoustic.")
    setTimeout(() => {
      setFormMessage("")
      const form = e.currentTarget
      form.reset()
    }, 3000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20" style={{ scrollBehavior: 'smooth' }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          scrollY > 50 ? "shadow-md" : ""
        }`}
      >
        <div className="w-full px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between max-w-full">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/soundpro-logo.png" alt="SoundPro Acoustic" className="h-10 w-auto" />
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#why" className="text-sm font-medium transition-colors hover:text-primary">
              Perché
            </Link>
            <Link href="#method" className="text-sm font-medium transition-colors hover:text-primary">
              Metodo
            </Link>
            <Link href="#cases" className="text-sm font-medium transition-colors hover:text-primary">
              Case
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contatti
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button size="sm" className="rounded-full">
              Richiedi analisi gratuita
            </Button>
          </div>
          <button className="flex md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
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
            {["Perché", "Metodo", "Case", "Contatti"].map((item, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="flex items-center justify-between rounded-3xl px-3 py-2 text-lg font-medium hover:bg-accent"
                  onClick={toggleMenu}
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full min-h-screen flex items-center overflow-hidden relative">
          <div className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center max-w-7xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInLeft}
                className="flex flex-col justify-center space-y-4 py-10"
              >
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                      <Zap className="mr-1 h-3 w-3" />
                    </motion.span>
                    Pannelli acustici su misura
                  </motion.div>
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
                      Inizia da un'analisi reale.
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                  >
                    Misuriamo l'acustica del tuo ambiente e progettiamo pannelli su misura. Non standard. Tuoi.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="rounded-full group">
                      Richiedi analisi gratuita
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
                    <Button variant="outline" size="lg" className="rounded-full">
                      Scopri di più
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center justify-center h-full"
              >
                <motion.div
                  animate={floatingAnimation}
                  className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-2xl"
                >
                  <motion.div
                    animate={pulseAnimation}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-70 text-primary" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground">Spazio sonoro ottimizzato</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section id="why" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Perché i pannelli standard non risolvono il tuo problema
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Comprare pannelli acustici online è facile. Risolvere davvero i problemi di suono del tuo spazio è
                un'altra cosa.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto"
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
                  title: "Artigianalità vs. Industriale",
                  description:
                    "Pannelli su misura, realizzati a mano, con materiali scelti per il TUO spazio.",
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
                  className="rounded-3xl border bg-background p-6 shadow-sm cursor-pointer group relative overflow-hidden"
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

        {/* Method Section */}
        <section id="method" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
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
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Come lavoriamo</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Un processo trasparente e scientifico in 4 step
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-4 relative max-w-6xl mx-auto"
            >
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
                  title: "Sopralluogo",
                  description: "Visitiamo il tuo spazio. Ascoltiamo, osserviamo, capiamo il tuo problema specifico.",
                },
                {
                  step: "2",
                  title: "Misurazione",
                  description:
                    "Usiamo strumenti professionali per misurare frequenze, riverbero, problemi di fase. Dati reali.",
                },
                {
                  step: "3",
                  title: "Progettazione",
                  description:
                    "Progettiamo pannelli acustici su misura per il TUO spazio. Tutto calcolato nei dettagli.",
                },
                {
                  step: "4",
                  title: "Realizzazione Artigianale",
                  description: "Costruiamo ogni pannello a mano. Installazione professionale inclusa.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="relative rounded-3xl border bg-background p-6 shadow-sm group hover:shadow-lg hover:border-primary/50 transition-all"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                    className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-500 text-white flex items-center justify-center font-bold shadow-lg group-hover:shadow-xl transition-shadow"
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 mt-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Cases Section */}
        <section id="cases" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
          >
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Spazi trasformati</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Vedi come abbiamo trasformato gli ambienti dei nostri clienti
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
            >
              {[
                {
                  problem: "Rimbombo eccessivo, suono confuso",
                  solution: "8 pannelli acustici su misura, posizionamento strategico",
                  result: "Chiarezza sui transienti, suono definito",
                },
                {
                  problem: "Riverbero eccessivo",
                  solution: "6 pannelli su misura",
                  result: "Migliore definizione sonora",
                },
                {
                  problem: "Problemi di fase",
                  solution: "Pannelli dimensionati ad-hoc",
                  result: "Immagine stereofonica più coerente",
                },
                {
                  problem: "Confusione nei transienti",
                  solution: "Mix di diffusori e assorbitori su misura",
                  result: "Dettaglio e precisione",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="rounded-3xl border bg-background p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl mb-4 flex items-center justify-center text-muted-foreground group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                      Foto caso studio
                    </div>
                    <p className="text-sm font-semibold mb-2 text-primary">Problema</p>
                    <p className="text-sm mb-3">{item.problem}</p>
                    <p className="text-sm font-semibold mb-2 text-primary">Soluzione</p>
                    <p className="text-sm mb-3">{item.solution}</p>
                    <p className="text-sm font-semibold mb-2 text-primary">Risultato</p>
                    <p className="text-sm text-muted-foreground">{item.result}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Final Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
          >
            <motion.div
              whileHover={{ boxShadow: "0 20px 60px rgba(107, 163, 212, 0.2)" }}
              transition={{ duration: 0.3 }}
              className="border border-muted rounded-3xl bg-muted/20 py-16 px-6 md:px-12 relative overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center space-y-4 text-center relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                >
                  Pronto a trasformare il tuo spazio?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                >
                  Richiedi l'analisi acustica gratuita. Ti contatteremo entro 24 ore.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6"
                >
                  <Button size="lg" className="rounded-full">
                    Inizia qui
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full px-4 md:px-6 lg:px-8 relative z-10 max-w-full"
          >
            <div className="grid items-center gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Richiedi analisi gratuita</h2>
                <p className="text-muted-foreground md:text-xl">
                  Contattaci per iniziare a trasformare il tuo spazio acustico. Ti risponderemo entro 24 ore.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    { icon: MapPin, label: "Ubicazione", text: "Ercolano (NA), Italia" },
                    { icon: Mail, label: "Email", text: "info@soundproacoustic.com" },
                    { icon: Phone, label: "Telefono", text: "+39 (081) 123-4567" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <motion.div
                        className="rounded-full bg-primary/20 p-2 group-hover:bg-primary/30 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">Contattaci</h3>
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Input placeholder="Nome" required className="rounded-2xl" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Input type="email" placeholder="Email" required className="rounded-2xl" />
                    </motion.div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Input type="tel" placeholder="Telefono (opzionale)" className="rounded-2xl" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <select className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="">Seleziona servizio</option>
                      <option>Progetto acustico (sopralluogo + misurazione) - Gratuito</option>
                      <option>Prodotti su misura (pannelli acustici artigianali)</option>
                    </select>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Textarea placeholder="Descrivi il tuo progetto" required className="rounded-2xl" rows={4} />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Input type="text" placeholder="Misura stanza (es: 5m x 4m x 3m)" className="rounded-2xl" />
                  </motion.div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" required />
                    <span className="text-sm">Accetto la privacy</span>
                  </label>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button type="submit" className="w-full rounded-full">
                      Invia
                    </Button>
                  </motion.div>
                  {formMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-green-600 mt-2"
                    >
                      {formMessage}
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t">
        <div className="w-full px-4 md:px-6 lg:px-8 py-8 max-w-full">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/soundpro-logo.png" alt="SoundPro Acoustic" className="h-8 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                Pannelli acustici su misura per home studio, sale d'ascolto e ambienti professionali.
              </p>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/soundproacoustic/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://www.facebook.com/358599897338607?ref=NONE_xav_ig_profile_page_web" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Link veloci</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="#why" className="text-muted-foreground hover:text-primary">
                  Perché
                </Link>
                <Link href="#method" className="text-muted-foreground hover:text-primary">
                  Metodo
                </Link>
                <Link href="#cases" className="text-muted-foreground hover:text-primary">
                  Case Studio
                </Link>
                <Link href="#contact" className="text-muted-foreground hover:text-primary">
                  Contatti
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Contatti</h4>
              <p className="text-sm text-muted-foreground">
                Ercolano (NA), Italia
                <br />
                info@soundproacoustic.com
                <br />
                +39 (081) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row max-w-6xl mx-auto">
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
