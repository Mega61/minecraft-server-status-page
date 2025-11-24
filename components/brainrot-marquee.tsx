import { cn } from "@/lib/utils"

export function BrainrotMarquee({
  className,
  text,
  direction = "left",
}: { className?: string; text: string; direction?: "left" | "right" }) {
  return (
    <div
      className={cn(
        "overflow-hidden whitespace-nowrap bg-primary text-black py-2 font-mono text-xl border-y-4 border-black select-none",
        className,
      )}
    >
      <div className={cn("inline-block animate-marquee", direction === "right" && "animate-marquee-reverse")}>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  )
}
