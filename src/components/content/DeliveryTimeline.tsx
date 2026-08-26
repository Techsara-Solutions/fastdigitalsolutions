import { deliveryStages } from "@/content/delivery-method";

type DeliveryTimelineProps = {
  /** "preview" (home page: one sentence per stage) or "full" (/how-we-work/). */
  variant?: "preview" | "full";
  /** Whether the timeline sits on the dark espresso surface. */
  onDark?: boolean;
};

/**
 * Five-stage delivery timeline (PRD §11, §14.1E): horizontal sequence on
 * desktop, vertical on mobile. Pure CSS — no motion required.
 */
export function DeliveryTimeline({ variant = "preview", onDark = false }: DeliveryTimelineProps) {
  const nameColor = onDark ? "text-paper" : "text-ink";
  const textColor = onDark ? "text-stone" : "text-muted";
  const lineColor = onDark ? "bg-white/15" : "bg-stone";

  return (
    <ol className="grid gap-x-6 gap-y-10 md:grid-cols-5">
      {deliveryStages.map((stage, index) => (
        <li key={stage.name} className="relative flex gap-4 md:block">
          {/* Connector line */}
          {index < deliveryStages.length - 1 ? (
            <span
              aria-hidden="true"
              className={`absolute left-[1.1875rem] top-12 h-[calc(100%-1rem)] w-px md:left-14 md:top-[1.1875rem] md:h-px md:w-[calc(100%-2.5rem)] ${lineColor}`}
            />
          ) : null}
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
              onDark ? "border-clay bg-espresso text-clay" : "border-clay bg-paper text-clay-dark"
            }`}
          >
            {stage.number}
          </span>
          <div className="md:mt-5">
            <h3 className={`text-base font-bold ${nameColor}`}>{stage.name}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${textColor}`}>{stage.short}</p>
            {variant === "full" ? (
              <ul className={`mt-3 space-y-1 text-sm ${textColor}`}>
                {stage.purpose.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-2.5 shrink-0 rounded-full bg-clay/70"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
