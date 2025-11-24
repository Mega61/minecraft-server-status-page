import { cn } from "@/lib/utils"

interface StatusProps {
  status: "online" | "offline" | "starting"
}

export function StatusIndicator({ status }: StatusProps) {
  return (
    <div className="relative group perspective-1000">
      <div
        className={cn(
          "relative z-10 w-full p-8 border-4 border-black transform transition-transform duration-100 group-hover:-translate-y-2 group-hover:translate-x-2 text-center",
          status === "online" ? "bg-green-500" : status === "starting" ? "bg-yellow-400" : "bg-red-600",
        )}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-stroke">
          STATUS CHECK
        </h2>
        <div className="mt-4 text-2xl md:text-4xl font-mono bg-black text-white p-4 inline-block transform -rotate-2">
          {status === "online" && "ONLINE 🟢 NO CAP"}
          {status === "offline" && "LITERALLY DEAD 💀"}
          {status === "starting" && "COOKING... 🍳"}
        </div>

        {status === "offline" && <p className="mt-4 font-bold text-xl animate-pulse text-white">(cringe)</p>}
      </div>

      {/* Brutalist Shadow */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full border-4 border-black bg-white z-0 translate-x-4 translate-y-4",
          status === "online" ? "bg-green-900" : status === "starting" ? "bg-yellow-900" : "bg-red-900",
        )}
      />
    </div>
  )
}
