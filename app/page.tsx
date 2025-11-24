import { ServerCard } from "@/components/server-card"
import { BrainrotMarquee } from "@/components/brainrot-marquee"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative flex flex-col">
      {/* Top Marquee */}
      <BrainrotMarquee
        text="KUMAFORCE ON TOP 😤 SKIBIDI RIZZ ONLY 🚽 NO GRIEFING (OPTIONAL) 💀 GYATT LEVEL 1000 🍑"
        className="rotate-1 z-30 border-b-4 border-black"
      />

      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <ServerCard />
      </div>

      {/* Decorative Chaos */}
      <div className="fixed top-1/4 left-10 w-32 h-32 bg-secondary border-4 border-black rotate-12 -z-10 hidden md:block" />
      <div className="fixed bottom-1/4 right-10 w-48 h-48 bg-accent border-4 border-black -rotate-12 rounded-full -z-10 hidden md:block" />

      {/* Bottom Marquee */}
      <BrainrotMarquee
        text="SERVER STATUS: LOCKED IN 🔒 JOIN NOW OR YOU'RE FANUM TAXED 🌭 SHEEEEEESH 🥶"
        direction="right"
        className="-rotate-1 z-30 bg-secondary text-white border-t-4 border-black mt-auto"
      />
    </main>
  )
}
