type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-white/35">{label}</p>
      <p className="mt-4 text-4xl font-light text-white">{value}</p>
      {helper ? <p className="mt-3 text-sm leading-6 text-white/45">{helper}</p> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const paid = status === "PAID";
  const pending = status === "PAYMENT_PENDING";
  const cancelled = status === "CANCELLED";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
        paid
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
          : pending
            ? "border-[#d6b46a]/30 bg-[#d6b46a]/10 text-[#f0cf82]"
            : cancelled
              ? "border-red-300/30 bg-red-300/10 text-red-200"
              : "border-white/10 bg-white/[0.03] text-white/50"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function formatAdminDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
