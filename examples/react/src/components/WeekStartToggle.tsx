import type { Dispatch, SetStateAction } from "react";

interface WeekStartToggleProps {
  weekStartsOn: 0 | 1;
  onChange: Dispatch<SetStateAction<0 | 1>>;
}

/**
 * Allows switching between Sunday/Monday week starts.
 * The adapter recreates upstream when this value changes.
 */
export function WeekStartToggle({
  weekStartsOn,
  onChange,
}: WeekStartToggleProps) {
  return (
    <div className="toolbar-section">
      <p className="toolbar-label">Week starts on</p>
      <div className="toggle-group">
        <button
          type="button"
          className={weekStartsOn === 0 ? "toggle is-active" : "toggle"}
          onClick={() => onChange(0)}
        >
          Sunday
        </button>
        <button
          type="button"
          className={weekStartsOn === 1 ? "toggle is-active" : "toggle"}
          onClick={() => onChange(1)}
        >
          Monday
        </button>
      </div>
    </div>
  );
}
