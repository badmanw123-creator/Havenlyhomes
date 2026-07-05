import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

const submitContact = createServerFn({ method: "POST" }).handler(async ({ data }: { data: { firstName: string; lastName: string; email: string; phone?: string; interest: string; message?: string } }) => {
  "use server";
  const { firstName, lastName, email, phone, interest, message } = data;
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return { success: false, error: "First name, last name, and email are required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { success: false, error: "Please provide a valid email address." };
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`INSERT INTO leads (first_name, last_name, email, phone, interest, message) VALUES (${firstName.trim()}, ${lastName.trim()}, ${email.trim().toLowerCase()}, ${phone?.trim() || null}, ${interest || ""}, ${message?.trim() || ""})`;
    return { success: true, message: "Thanks for reaching out! One of our agents will contact you within 2 hours." };
  } catch {
    return { success: false, error: "Something went wrong. Please try again or call us at (555) 123-HOME." };
  }
});

function Home() {
  const businessName = Route.useLoaderData();

  return (
    <div className="min-h-dvh">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-havenly-500 text-lg font-bold text-white">
              H
            </span>
            <span className="text-xl font-bold text-navy-900">{businessName}</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-navy-700 transition-colors hover:text-havenly-600">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-navy-700 transition-colors hover:text-havenly-600">
              Pricing
            </a>
            <a href="#about" className="text-sm font-medium text-navy-700 transition-colors hover:text-havenly-600">
              About
            </a>
            <Link to="/listings" className="text-sm font-medium text-navy-700 transition-colors hover:text-havenly-600">
              Listings
            </Link>
            <a href="#contact" className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 hover:shadow-lg">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero.jpg)" }}
        />
        {/* Overlay */}
        <div className="hero-gradient absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center text-white md:py-32">
          <span className="mb-6 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            Flat-Fee Real Estate • Tech-First Experience
          </span>
          <h1 className="text-balance mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Buy or Sell Your Home for a Flat Fee — <br />
            <span className="text-havenly-300">No Percentages, No Surprises</span>
          </h1>
          <p className="text-balance mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            {businessName} combines modern technology with expert agents to make real estate
            simpler, faster, and far more affordable. Save thousands on commissions without
            sacrificing service.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="rounded-full bg-havenly-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-havenly-600 hover:shadow-xl"
            >
              Start Your Home Journey
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
            >
              How It Works
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-white sm:text-4xl">$3k</p>
              <p className="mt-1 text-sm text-white/70">Flat listing fee</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white sm:text-4xl">$0</p>
              <p className="mt-1 text-sm text-white/70">Hidden charges</p>
            </div>
            <div className="col-span-2 text-center sm:col-span-1">
              <p className="text-3xl font-bold text-white sm:text-4xl">10x</p>
              <p className="mt-1 text-sm text-white/70">Better value than 6% commissions</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="bg-warm-50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-havenly-600">
              Simple Process
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl md:text-5xl">
              How {businessName} Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-600">
              Sell or buy your home in three straightforward steps. No runaround, no hidden fees.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-havenly-100 text-2xl font-bold text-havenly-600">
                1
              </div>
              <h3 className="text-xl font-bold text-navy-900">List Your Home</h3>
              <p className="mt-3 text-navy-600">
                Upload your property details, photos, and virtual tour — all through our
                intuitive digital platform. No paperwork stacks, no back-and-forth.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-havenly-100 text-2xl font-bold text-havenly-600">
                2
              </div>
              <h3 className="text-xl font-bold text-navy-900">Get Market Exposure</h3>
              <p className="mt-3 text-navy-600">
                We syndicate your listing across top platforms (Zillow, Realtor.com, MLS)
                and run targeted digital ads. AI-powered pricing ensures you sell at the
                right price.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-havenly-100 text-2xl font-bold text-havenly-600">
                3
              </div>
              <h3 className="text-xl font-bold text-navy-900">Close & Save</h3>
              <p className="mt-3 text-navy-600">
                E-sign all documents, track every offer in real time, and close with
                confidence — all while keeping thousands in savings versus traditional
                brokerages.
              </p>
            </div>
          </div>

          {/* Buyer side note */}
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-navy-900 p-8 text-center text-white sm:p-10">
            <p className="text-lg font-semibold sm:text-xl">
              Buying? We rebate a portion of our commission to you — making your purchase
              more affordable too.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Pricing Tiers ─── */}
      <section id="pricing" className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-havenly-600">
              Transparent Pricing
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl md:text-5xl">
              Flat-Fee Packages
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-600">
              No percentage commissions. No hidden fees. Just flat, upfront pricing that
              saves you thousands.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Essential */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-navy-900">Essential</h3>
              <p className="mt-1 text-sm text-navy-500">For sellers who want the basics</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-navy-900">$3,000</span>
                <span className="text-sm text-navy-500"> flat fee</span>
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "MLS listing & syndication",
                  "Professional photography",
                  "Digital yard sign",
                  "Offer management portal",
                  "e-Signature document processing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-havenly-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://buy.stripe.com/14AfZgbHi3BC8s8bbP2kw00"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full rounded-full border-2 border-navy-200 py-3 text-center text-sm font-semibold text-navy-900 transition-all hover:border-navy-900 hover:bg-navy-50"
              >
                Buy Now — $3,000
              </a>
            </div>

            {/* Standard — featured */}
            <div className="relative rounded-2xl border-2 border-havenly-400 bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-havenly-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Most Popular
              </span>
              <h3 className="text-xl font-bold text-navy-900">Standard</h3>
              <p className="mt-1 text-sm text-navy-500">Best value for most sellers</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-navy-900">$4,000</span>
                <span className="text-sm text-navy-500"> flat fee</span>
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Everything in Essential",
                  "Virtual 3D tour & floor plan",
                  "Targeted social media ads",
                  "Open house coordination",
                  "Buyer commission included",
                  "Dedicated agent support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-havenly-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://buy.stripe.com/14A9ASaDe1tudMsgw92kw01"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full rounded-full bg-havenly-500 py-3 text-center text-sm font-semibold text-white shadow transition-all hover:bg-havenly-600 hover:shadow-md"
              >
                Buy Now — $4,000
              </a>
            </div>

            {/* Premium */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-navy-900">Premium</h3>
              <p className="mt-1 text-sm text-navy-500">Full-service, white-glove experience</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-navy-900">$5,000</span>
                <span className="text-sm text-navy-500"> flat fee</span>
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Everything in Standard",
                  "Professional staging consultation",
                  "Concierge moving assistance",
                  "Drone aerial photography",
                  "Premium listing on all portals",
                  "Priority support & same-day responses",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-havenly-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://buy.stripe.com/6oUbJ09za5JK7o41Bf2kw02"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full rounded-full border-2 border-navy-200 py-3 text-center text-sm font-semibold text-navy-900 transition-all hover:border-navy-900 hover:bg-navy-50"
              >
                Buy Now — $5,000
              </a>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-navy-500">
            Compared to a traditional 6% commission on a $500k home ($30,000), you save up to 90%.
            No gimmicks — just fair, transparent pricing.
          </p>
        </div>
      </section>

      {/* ─── Why Havenly / About ─── */}
      <section id="about" className="bg-navy-950 px-6 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-havenly-300">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
              Real Estate, Reimagined
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
              We believe buying or selling your home shouldn't cost a fortune. Here's what
              makes {businessName} different.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Left side - features grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-havenly-500/20">
                  <svg className="h-5 w-5 text-havenly-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Flat-Fee Savings</h3>
                <p className="mt-2 text-sm text-white/60">
                  Pay $3k–$5k total, not 6% of your sale price. The average Havenly seller
                  saves over $20,000.
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-havenly-500/20">
                  <svg className="h-5 w-5 text-havenly-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Digital-First Platform</h3>
                <p className="mt-2 text-sm text-white/60">
                  Virtual tours, e-signatures, automated paperwork, AI pricing — all from
                  your phone or laptop.
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-havenly-500/20">
                  <svg className="h-5 w-5 text-havenly-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Real Human Agents</h3>
                <p className="mt-2 text-sm text-white/60">
                  Tech-powered, but never impersonal. Licensed experts guide you through
                  every step with care.
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-havenly-500/20">
                  <svg className="h-5 w-5 text-havenly-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Full Transparency</h3>
                <p className="mt-2 text-sm text-white/60">
                  Every offer, every document, every fee — all visible in your dashboard.
                  No surprises, no fine print.
                </p>
              </div>
            </div>

            {/* Right side - image & quote */}
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/modern-home.jpg"
                  alt="Modern home interior"
                  className="h-72 w-full object-cover sm:h-80"
                />
              </div>
              <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
                <svg className="mb-3 h-8 w-8 text-havenly-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg italic leading-relaxed text-white/80">
                  "We saved over $18,000 selling our home with Havenly. The process was
                  completely digital, our agent was incredible, and we closed in 3 weeks.
                  I'll never use a traditional broker again."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-havenly-500/30 flex items-center justify-center text-sm font-bold text-havenly-300">
                    SJ
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Sarah & James M.</p>
                    <p className="text-xs text-white/50">Sold their home in Austin, TX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="bg-havenly-500 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <p className="text-3xl font-bold text-white sm:text-4xl">$24M+</p>
              <p className="mt-1 text-sm text-havenly-100">Properties sold</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white sm:text-4xl">500+</p>
              <p className="mt-1 text-sm text-havenly-100">Happy customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white sm:text-4xl">$18k</p>
              <p className="mt-1 text-sm text-havenly-100">Avg. savings per seller</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white sm:text-4xl">4.9★</p>
              <p className="mt-1 text-sm text-havenly-100">Customer rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Refer a Friend ─── */}
      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-havenly-600">
              Share the Savings
            </span>
            <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl md:text-5xl">
              Refer a Friend & Earn $500
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-600">
              Know someone thinking of selling? When they list with Havenly, you get 
              <strong className="text-havenly-600"> $500</strong> — and they save thousands on commissions.
              It's a win-win.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-warm-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-havenly-100 text-2xl font-bold text-havenly-600">
                1
              </div>
              <h3 className="text-lg font-bold text-navy-900">Tell a Friend</h3>
              <p className="mt-2 text-sm text-navy-600">
                Share Havenly with someone who's planning to sell their home.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-warm-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-havenly-100 text-2xl font-bold text-havenly-600">
                2
              </div>
              <h3 className="text-lg font-bold text-navy-900">They List & Save</h3>
              <p className="mt-2 text-sm text-navy-600">
                Your friend sells with Havenly and pays just $3k–$5k flat fee instead of 6%.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-warm-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-havenly-100 text-2xl font-bold text-havenly-600">
                3
              </div>
              <h3 className="text-lg font-bold text-navy-900">You Get $500</h3>
              <p className="mt-2 text-sm text-navy-600">
                After they close, we send you a $500 thank-you. Simple as that.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-navy-900 p-8 text-center text-white">
            <p className="text-lg font-semibold">
              Know someone? Send them to{' '}
              <span className="text-havenly-300">havenlyhomes.ctonew.app</span>
            </p>
            <p className="mt-2 text-sm text-white/60">
              Make sure they mention your name when they reach out!
            </p>
          </div>
        </div>
      </section>

      {/* ─── Contact / Lead Capture ─── */}
      <section id="contact" className="bg-warm-50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Left */}
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold uppercase tracking-widest text-havenly-600">
                Get in Touch
              </span>
              <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl md:text-5xl">
                Ready to Save Thousands?
              </h2>
              <p className="mt-4 max-w-md text-lg text-navy-600">
                Fill out the form and one of our agents will reach out within 2 hours.
                No pressure, no obligation — just honest advice.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-havenly-100">
                    <svg className="h-5 w-5 text-havenly-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-navy-700">havenly-edcfbab7@ctomail.io</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-havenly-100">
                    <svg className="h-5 w-5 text-havenly-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm text-navy-700">(555) 123-HOME</span>
                </div>
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl">
                <img
                  src="/images/team.jpg"
                  alt="Havenly team"
                  className="h-48 w-full object-cover"
                />
              </div>
            </div>

            {/* Right — Form */}
            <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-navy-950 px-6 py-12 text-white/60">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-havenly-500 text-sm font-bold text-white">
                H
              </span>
              <span className="text-base font-bold text-white">{businessName}</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a>
              <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
              <a href="#about" className="transition-colors hover:text-white">About</a>
              <a href="#contact" className="transition-colors hover:text-white">Contact</a>
              <Link to="/listings" className="transition-colors hover:text-white">Listings</Link>
            </nav>
            <p className="text-xs">
              &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs">
            {businessName} is a licensed real estate brokerage. Each office is independently
            owned and operated. Equal Housing Opportunity.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
            const data = await submitContact({ data: formData });
            if (!data.success) {
              throw new Error(data.error || "Something went wrong.");
            }
            setStatus("success");
            setFormData({ firstName: "", lastName: "", email: "", phone: "", interest: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-navy-900">Message Sent!</h3>
        <p className="mt-2 text-navy-600">Thanks for reaching out! One of our agents will contact you within 2 hours.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full bg-havenly-500 px-6 py-2 text-sm font-semibold text-white hover:bg-havenly-600"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-navy-800">First Name</label>
          <input id="firstName" type="text" placeholder="Jane" value={formData.firstName} onChange={handleChange}
            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-warm-50/50 px-4 py-3 text-sm text-navy-900 placeholder:text-gray-400 focus:border-havenly-400 focus:outline-none focus:ring-2 focus:ring-havenly-200" required />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-navy-800">Last Name</label>
          <input id="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleChange}
            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-warm-50/50 px-4 py-3 text-sm text-navy-900 placeholder:text-gray-400 focus:border-havenly-400 focus:outline-none focus:ring-2 focus:ring-havenly-200" required />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy-800">Email Address</label>
        <input id="email" type="email" placeholder="jane@example.com" value={formData.email} onChange={handleChange}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-warm-50/50 px-4 py-3 text-sm text-navy-900 placeholder:text-gray-400 focus:border-havenly-400 focus:outline-none focus:ring-2 focus:ring-havenly-200" required />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-navy-800">Phone Number</label>
        <input id="phone" type="tel" placeholder="(555) 000-0000" value={formData.phone} onChange={handleChange}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-warm-50/50 px-4 py-3 text-sm text-navy-900 placeholder:text-gray-400 focus:border-havenly-400 focus:outline-none focus:ring-2 focus:ring-havenly-200" />
      </div>
      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-navy-800">I'm interested in...</label>
        <select id="interest" value={formData.interest} onChange={handleChange}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-warm-50/50 px-4 py-3 text-sm text-navy-900 focus:border-havenly-400 focus:outline-none focus:ring-2 focus:ring-havenly-200" required>
          <option value="">Select an option</option>
          <option value="sell">Selling my home</option>
          <option value="buy">Buying a home</option>
          <option value="both">Both buying &amp; selling</option>
          <option value="just-looking">Just looking / learning</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy-800">Message (optional)</label>
        <textarea id="message" rows={3} placeholder="Tell us about your property or what you're looking for..." value={formData.message} onChange={handleChange}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-warm-50/50 px-4 py-3 text-sm text-navy-900 placeholder:text-gray-400 focus:border-havenly-400 focus:outline-none focus:ring-2 focus:ring-havenly-200" />
      </div>
      {status === "error" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMsg}</p>
      )}
      <button type="submit" disabled={status === "loading"}
        className="flex w-full items-center justify-center rounded-full bg-havenly-500 py-3.5 text-base font-bold text-white shadow transition-all hover:bg-havenly-600 hover:shadow-lg disabled:opacity-60">
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
      <p className="text-center text-xs text-navy-400">
        By submitting, you agree to our Terms of Service and Privacy Policy. We'll never share your information.
      </p>
    </form>
  );
}