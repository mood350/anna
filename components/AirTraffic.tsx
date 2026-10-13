/**
 * Quelques avions traversent le carnet comme une ligne griffonnée sur une
 * carte postale. Décoratif uniquement : il ne capte jamais les interactions.
 */
function Plane({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 120 48"
      className={`sky-plane sky-plane-${direction}`}
      aria-hidden="true"
    >
      <path d="M5 25h42l15-8 4 2-7 6h39c8 0 13 3 17 7-8-2-16-2-25-1l-30 3-13 9-4-2 7-9-24-2z" fill="currentColor" />
      <path d="M55 24 45 7l5-1 16 18M60 29l-9 15 5 1 13-17" fill="currentColor" opacity=".82" />
    </svg>
  );
}

export default function AirTraffic() {
  return (
    <div className="air-traffic" aria-hidden="true">
      <div className="flight-path flight-path-one"><Plane /></div>
      <div className="flight-path flight-path-two"><Plane direction="left" /></div>
      <div className="flight-path flight-path-three"><Plane /></div>
    </div>
  );
}
