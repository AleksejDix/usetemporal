import type { Period } from "@allystudio/usetemporal";

interface PeriodDisplayProps {
  month: Period;
  now: Period;
}

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const rangeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function PeriodDisplay({ month, now }: PeriodDisplayProps) {
  const label = monthFormatter.format(month.date);
  const isCurrentMonth =
    month.date.getFullYear() === now.date.getFullYear() &&
    month.date.getMonth() === now.date.getMonth();

  return (
    <div className="period-display">
      <div>
        <p className="eyebrow">Browsing</p>
        <h2>{label}</h2>
      </div>
      <dl>
        <div>
          <dt>Range</dt>
          <dd>
            {rangeFormatter.format(month.start)} –{" "}
            {rangeFormatter.format(month.end)}
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{isCurrentMonth ? "Current month" : "Historical view"}</dd>
        </div>
      </dl>
    </div>
  );
}
