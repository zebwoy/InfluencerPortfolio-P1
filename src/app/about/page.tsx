"use client"

import { motion } from "framer-motion"
import { FileText, Lightbulb, Camera, Zap } from "lucide-react"

const steps = [
  { id: 1, title: "Brief", desc: "Share your brand’s needs in 2 minutes.", icon: FileText },
  { id: 2, title: "Concept", desc: "Receive creative ideas tailored to your product.", icon: Lightbulb },
  { id: 3, title: "Create", desc: "Filming + editing with quick turnarounds.", icon: Camera },
  { id: 4, title: "Deliver", desc: "Final UGC ready in 48–72 hours.", icon: Zap },
]

export default function WorkflowSection() {
  return (
    <section className="w-full py-16 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          From <span className="text-yellow-400">Brief</span> to Delivery in 72 Hours ⚡
        </h2>
        <p className="text-lg text-gray-400 mb-12">
          A seamless workflow designed for brands that value speed + creativity.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-yellow-400 text-black rounded-full p-4 mb-4 shadow-lg">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Decorative line */}
        <div className="hidden md:block relative mt-12">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-700"></div>
          <div className="flex justify-between max-w-5xl mx-auto">
            {steps.map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.3 }}
                viewport={{ once: true }}
                className="w-4 h-4 rounded-full bg-yellow-400 relative z-10"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
