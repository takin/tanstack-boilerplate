import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-background px-6 py-12 sm:py-16">
      {/* Decorative gradient blob */}
      <motion.div
        initial={{ y: 0, scale: 1 }}
        animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-168 w-2xl rounded-full bg-linear-to-br from-primary/25 via-accent/20 to-ring/25 blur-3xl dark:from-primary/20 dark:via-accent/15 dark:to-ring/20" />
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto grid w-full max-w-3xl gap-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Page not found
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="bg-linear-to-b from-primary to-primary/40 bg-clip-text text-[90px] font-extrabold leading-none tracking-tight text-transparent sm:text-[120px] md:text-[150px]"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="text-balance text-2xl font-semibold text-foreground sm:text-3xl"
          >
            Oops — we couldn't find that page
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="text-pretty max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            The link may be broken or the page might have been removed. Check
            the URL or explore one of the options below.
          </motion.p>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <HomeIcon className="h-4 w-4" />
            Go home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <DashboardIcon className="h-4 w-4" />
            Open dashboard
          </Link>
          <button
            type="button"
            onClick={() =>
              typeof window !== 'undefined' ? window.history.back() : null
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-transparent px-4 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go back
          </button>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mt-2 flex items-center gap-3 text-xs text-muted-foreground sm:text-sm"
        >
          <a
            href="mailto:support@example.com?subject=Broken%20link%20report"
            className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
          >
            <SparkleIcon className="h-3.5 w-3.5" />
            Report an issue
          </a>
          <span aria-hidden>•</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="underline-offset-4 hover:underline"
          >
            Back to top
          </a>
        </motion.div>
      </motion.section>
    </main>
  )
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="m3 9 9-7 9 7" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="3" y="3" width="7" height="9" rx="2" />
      <rect x="14" y="3" width="7" height="5" rx="2" />
      <rect x="14" y="10" width="7" height="11" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
  )
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 19l-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3z" />
    </svg>
  )
}
