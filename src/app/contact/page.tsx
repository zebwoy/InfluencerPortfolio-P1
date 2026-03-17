"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SocialIcons from "@/components/SocialIcons";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

export default function ContactPage() {
  const [email] = useState("zsarfaraz80@gmail.com");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as any).toString(),
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-0 max-[350px]:px-3">
      <div className="rounded-2xl bg-black text-white border border-white/15 p-6 sm:p-10 max-[350px]:p-4 overflow-hidden">
        
        <div className="text-center space-y-2 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl tracking-tight max-[350px]:text-xl"
          >
            Contact
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-white/70 text-sm sm:text-base max-[350px]:text-[13px]"
          />
        </div>

        {/* Direct message options */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mb-8 max-[350px]:gap-2">

          <a
            className="rounded-lg border border-white/25 px-3 py-3 text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors max-[350px]:py-2 max-[350px]:text-xs"
            href="https://www.instagram.com/zeya__sol/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon fontSize="small" />
            Instagram
          </a>

          <a
            className="rounded-lg border border-white/25 px-3 py-3 text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors max-[350px]:py-2 max-[350px]:text-xs"
            href="https://wa.me/918210980639"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon fontSize="small" />
            WhatsApp
          </a>

          <a
            className="rounded-lg border border-white/25 px-3 py-3 text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors max-[350px]:py-2 max-[350px]:text-xs"
            href={`mailto:${email}`}
          >
            <EmailIcon fontSize="small" />
            Email
          </a>

        </div>

        {/* Contact form */}
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="grid gap-4 rounded-xl border border-white/20 p-4 sm:p-6 max-[350px]:p-3 max-[350px]:gap-3 overflow-hidden"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>Don't fill this out: <input name="bot-field" /></label>
          </p>

          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm text-white/80">Name</label>
            <input
              id="name"
              name="name"
              required
              className="h-10 w-full rounded-md border border-white/30 px-3 bg-transparent placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 max-[350px]:h-9 max-[350px]:text-sm"
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
              className="h-10 w-full rounded-md border border-white/30 px-3 bg-transparent placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 max-[350px]:h-9 max-[350px]:text-sm"
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
              className="w-full rounded-md border border-white/30 px-3 py-2 bg-transparent placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 max-[350px]:text-sm"
              placeholder="How can I help?"
            />
          </div>

          <div className="flex items-center justify-between max-[350px]:flex-col max-[350px]:items-stretch max-[350px]:gap-3">
            <SocialIcons size={18} colorClassName="text-white/80" />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50 max-[350px]:py-2 max-[350px]:w-full"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>

          {submitted && (
            <p className="text-xs text-green-400">
              Thanks! Your message was received. For faster replies, use Instagram or WhatsApp.
            </p>
          )}

          {error && (
            <p className="text-xs text-red-400">
              Something went wrong. Please try again or reach out directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}