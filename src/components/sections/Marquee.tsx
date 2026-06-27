export function Marquee({ words: marquee }: { words: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...marquee, ...marquee].map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  )
}
