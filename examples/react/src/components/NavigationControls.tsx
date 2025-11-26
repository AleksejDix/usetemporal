import type { Period } from "@allystudio/usetemporal";
import type { TemporalBuilder } from "@allystudio/usetemporal-react";

interface NavigationControlsProps {
  temporal: TemporalBuilder;
  targetPeriod: Period;
}

export function NavigationControls({
  temporal,
  targetPeriod,
}: NavigationControlsProps) {
  return (
    <div className="toolbar-row">
      <button
        type="button"
        className="nav-button"
        onClick={() => temporal.previous(targetPeriod)}
      >
        ← Previous
      </button>
      <button
        type="button"
        className="nav-button"
        onClick={() => temporal.next(targetPeriod)}
      >
        Next →
      </button>
    </div>
  );
}
