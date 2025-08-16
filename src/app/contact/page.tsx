"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SocialIcons from "@/components/SocialIcons";

export default function ContactPage() {
  const [email] = useState("zsarfaraz80@gmail.com");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="max-w-3xl mx-auto">
      <div className="rounded-2xl bg-black text-white border border-white/15 p-6 sm:p-10">
        <div className="text-center space-y-2 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl tracking-tight"
          >
            Contact
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-white/70 text-sm sm:text-base"
          ></motion.p>
        </div>

        {/* Direct message options */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <a
            className="rounded-lg border border-white/25 px-3 py-3 text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors"
            href="https://www.instagram.com/zeya__ugc/" target="_blank" rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            Instagram
          </a>
          <a
            className="rounded-lg border border-white/25 px-3 py-3 text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors"
            href="https://wa.me/918210980639" target="_blank" rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
              <path d="M12 3a9 9 0 0 0-7.6 13.6L3 21l4.6-1.4A9 9 0 1 0 12 3Z" stroke="currentColor" />
              <path d="M8.5 9.8c.2-.6.4-.6.7-.6h.6c.2 0 .5 0 .6.4.2.5.7 1.6.8 1.8.1.3 0 .5-.1.6l-.4.5c-.1.2-.2.3 0 .6.3.4 1.2 1.9 3 2.6 1.5.6 1.8.5 2.1.4l.7-.3c.2-.1.5 0 .6.2l.9 1.6c.1.2 0 .4-.1.5-.3.2-.8.6-1.5.6-1.4.1-3.6-.2-5.4-1.4-2.1-1.3-3.9-3.6-4.5-5-.3-.8-.3-1.4-.3-1.7 0-.6.2-1.1.3-1.3Z" fill="currentColor" />
            </svg>
            WhatsApp
          </a>
          <a
            className="rounded-lg border border-white/25 px-3 py-3 text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors"
            href={`mailto:${email}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
              <path d="M4 7l8 6 8-6" stroke="currentColor" />
            </svg>
            Email
          </a>
        </div>

        {/* Contact form */}
      <form
          className="grid gap-4 rounded-xl border border-white/20 p-4 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm text-white/80">Name</label>
            <input
              id="name"
              name="name"
              required
              className="h-10 rounded-md border border-white/30 px-3 bg-transparent placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm text-white/80">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-10 rounded-md border border-white/30 px-3 bg-transparent placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="message" className="text-sm text-white/80">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="rounded-md border border-white/30 px-3 py-2 bg-transparent placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="How can I help?"
            />
          </div>
          <div className="flex items-center justify-between">
            <SocialIcons size={18} colorClassName="text-white/80" />
            <button
              type="submit"
              className="rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white hover:text-black transition-colors"
            >
              Send
            </button>
          </div>
          {submitted && (
            <p className="text-xs text-white/70">Thanks! Your message was noted. For faster replies, use Instagram or WhatsApp.</p>
          )}
        </form>
      </div>
    </section>
  );
}

