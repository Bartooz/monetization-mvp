// pages/index.js
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white antialiased">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_-10%,rgba(79,139,255,0.25),transparent_60%)]"
        />
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-[48px] leading-[1.05] sm:text-[56px] md:text-[64px] font-extrabold tracking-tight">
              Monetize your mobile game with ease
            </h1>
            <p className="mt-5 text-lg text-white/70 max-w-xl">
              Design high‑converting offer screens, plan your Live Ops calendar, and run A/B tests with real‑time insights—no app updates, no engineering queue. Let AI generate visuals, learn from results, and suggest the next best campaign.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="#cta"
                className="rounded-xl bg-[#4F8BFF] px-6 py-3 text-base font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#4F8BFF]/40"
                aria-label="Get access to Monetize"
              >
                Get Access
              </Link>
              <Link
                href="#features"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                See Features
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-10">
              <p className="text-xs uppercase tracking-wider text-white/40">Trusted by teams from</p>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-6 opacity-70">
                {/* Swap these SVGs/images for your logos */}
                <div className="h-6 bg-white/10 rounded" aria-hidden="true" />
                <div className="h-6 bg-white/10 rounded" aria-hidden="true" />
                <div className="h-6 bg-white/10 rounded" aria-hidden="true" />
                <div className="h-6 bg-white/10 rounded" aria-hidden="true" />
                <div className="h-6 bg-white/10 rounded" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-[#4F8BFF]/20 blur-2xl opacity-60" aria-hidden="true" />
            <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-5">
              {/* iPhone-ish frame */}
              <div className="mx-auto w-[320px] rounded-[36px] border border-white/15 bg-black/60 p-3 shadow-2xl">
                <img
                  src="/assets/phone-preview.png"
                  alt="Offer screen preview inside a phone mockup"
                  className="rounded-[28px] w-full"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-sm text-white/60">
              Design, preview, and deploy in‑game offers—instantly
            </p>
          </div>
        </section>
      </header>

      {/* Problem / Solution */}
      
      <section className="border-t border-white/[0.06] bg-[#0D1324]">
      
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white text-center">
            What’s broken in Live Ops monetization
          </h2>
          <p className="mt-3 text-center text-white/60">
            From dev bottlenecks to slow feedback loops—these are the roadblocks that hold back revenue growth.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Fragmented Workflows", desc: "Live Ops planning, design, QA, and launch happen in separate tools, causing delays and handoff errors.", icon: "🧩", accent: "text-red-300" },
              { title: "Dev-Dependent Changes", desc: "Every pricing tweak or layout adjustment needs engineering time and an app update, slowing improvements and adding cost.", icon: "🛠️", accent: "text-yellow-300" },
              { title: "No Standardized Tooling", desc: "Custom scripts and processes create miscommunication, inconsistent results, and higher operational overhead.", icon: "🧱", accent: "text-orange-300" },
              { title: "Manual Ops & QA", desc: "Spreadsheets, custom back offices, and manual checks introduce mistakes, are hard to audit, and don’t scale.", icon: "📋", accent: "text-pink-300" },
              { title: "Slow Experimentation", desc: "Testing a new offer can take weeks, missing timely revenue opportunities.", icon: "⏳", accent: "text-blue-300" },
              { title: "Limited Decision Support", desc: "Insights are often delayed or spread thin, making it hard to react quickly and optimize monetization with confidence.", icon: "📉", accent: "text-purple-300" },
            ].map(({ title, desc, icon, accent }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl ${accent}`} aria-hidden="true">{icon}</span>
                  <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <p className="mt-2 text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      {/* Solution / Features (alternating layout, with one added feature) */}
      <section id="features" className="border-t border-white/[0.06] bg-[#0B0F19]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          {/* Section header */}
          <header className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Powerful features for modern Live Ops
            </h2>
            <p className="mt-3 text-white/60">
              A single workspace to plan, design, configure, and optimize monetization—AI assists when useful, you stay in control.
            </p>
          </header>

          {/* Feature 1: Visual Builder & Templates */}
          <div className="mt-14 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-white">Visual Builder & Templates</h3>
              <p className="mt-3 text-white/70">
                Design offers, missions, challenges, and other monetization tools with a drag‑and‑drop builder. Choose from a large template library and generate on‑brand variations with AI.
              </p>
              <ul className="mt-5 space-y-2 text-white/80">
                <li>• Templates for offers, missions, challenges & tools</li>
                <li>• AI‑assisted design and layout suggestions</li>
                <li>• Real‑time device preview; no coding required</li>
              </ul>
            </div>
            <div className="order-first md:order-none">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <img
                  src="/assets/editor-preview.png"
                  alt="Visual Builder & Templates preview"
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>

          {/* Feature 2: Calendar‑as‑Back Office (alternating image) */}
          <div className="mt-14 grid items-center gap-8 md:grid-cols-2">
            <div className="md:order-1">
              <h3 className="text-2xl font-bold text-white">Calendar‑as‑Back Office</h3>
              <p className="mt-3 text-white/70">
                What you plan is what ships. Configure events directly on the calendar—no separate back office, no duplicate work.
              </p>
              <ul className="mt-5 space-y-2 text-white/80">
                <li>• Plan and configure in one place</li>
                <li>• Guardrails for safe updates and clear ownership</li>
                <li>• Single source of truth for Live Ops</li>
              </ul>
            </div>
            <div className="md:order-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <img
                  src="/assets/calendar-preview.png"
                  alt="Calendar‑as‑Back Office preview"
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>

          {/* Feature 3: Optimization & Real‑Time Insights */}
          <div className="mt-14 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-white">Optimization & Real‑Time Insights</h3>
              <p className="mt-3 text-white/70">
                Move from reactive reports to proactive guidance. See performance live, run A/B tests, and get recommendations on what to run next.
              </p>
              <ul className="mt-5 space-y-2 text-white/80">
                <li>• AI‑recommended Live Ops calendars from past results</li>
                <li>• Segment‑level insights and variant suggestions</li>
                <li>• Real‑time alerts for underperforming events</li>
              </ul>
            </div>
            <div className="order-first md:order-none">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <img
                  src="/assets/ab-preview.png"
                  alt="Optimization & Real‑Time Insights dashboard"
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>

          {/* Feature 4: Segmentation & Configurations (added feature) */}
          <div className="mt-14 grid items-center gap-8 md:grid-cols-2">
            <div className="md:order-1">
              <h3 className="text-2xl font-bold text-white">Segmentation & Configurations</h3>
              <p className="mt-3 text-white/70">
                Target the right players with reusable setups that keep teams aligned. Build segments, apply configurations, and reuse them across events.
              </p>
              <ul className="mt-5 space-y-2 text-white/80">
                <li>• Reusable configurations by event/offer type</li>
                <li>• Segment builder for cohorts, behavior, and lifecycle</li>
                <li>• Consistent QA guardrails and approvals</li>
              </ul>
            </div>
            <div className="md:order-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <img
                  src="/assets/editor-preview.png"  // reuse an existing asset to avoid broken images
                  alt="Segmentation & Configurations preview"
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Who It's For */}
      {/* Who It's For */}
      <section className="border-t border-white/[0.06] bg-[#0D1324]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white text-center">
            Built for every kind of Live Ops team
          </h2>
          <p className="mt-3 text-center text-white/60">
            Whether you’re a solo developer or part of a large studio, Monetize scales with your needs and helps you move faster.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Monetization Managers */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-bold">Monetization Managers</h3>
              <p className="mt-2 text-white/70">
                Optimize revenue streams with actionable insights and rapid iteration—without waiting on dev or BI teams.
              </p>
              <ul className="mt-4 space-y-1 text-white/80">
                <li>• Revenue optimization and testing tools</li>
                <li>• Real-time analytics dashboard with alerts</li>
                <li>• Performance benchmarking across events and segments</li>
              </ul>
            </div>

            {/* Live Ops Teams */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-bold">Live Ops Teams</h3>
              <p className="mt-2 text-white/70">
                Plan, configure, and launch campaigns from one source of truth—keeping everyone in sync.
              </p>
              <ul className="mt-4 space-y-1 text-white/80">
                <li>• Team collaboration and status tracking</li>
                <li>• Calendar-driven configuration (what you plan is what ships)</li>
                <li>• Workflow automation and safe deployment</li>
              </ul>
            </div>

            {/* Small Studios */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-bold">Small Studios</h3>
              <p className="mt-2 text-white/70">
                Enterprise-level monetization capabilities, without the complexity or cost.
              </p>
              <ul className="mt-4 space-y-1 text-white/80">
                <li>• Easy setup and onboarding</li>
                <li>• Affordable, scalable pricing</li>
                <li>• Access to premium templates and AI-assisted design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Social proof (optional testimonial block) */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <blockquote className="text-white/90 text-lg leading-relaxed">
              “We shipped a seasonal offer in 48 hours—no app update, no engineer time.
              Revenue lift in the first week was +18%.”
            </blockquote>
            <div className="mt-4 text-sm text-white/60">— Head of LiveOps, F2P RPG</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <footer id="cta" className="border-t border-white/[0.06] bg-[#0D1324]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to boost your game revenue?</h2>
          <p className="mt-3 text-white/70">
            Join the waitlist or schedule a live walkthrough with our founder.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/waitlist"
              className="rounded-xl bg-[#4F8BFF] px-6 py-3 font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#4F8BFF]/40"
            >
              Join Waitlist
            </Link>
            <Link
              href="/demo"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Book a Demo
            </Link>
          </div>

          <p className="mt-10 text-xs text-white/40">
            © {new Date().getFullYear()} Monetize. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
