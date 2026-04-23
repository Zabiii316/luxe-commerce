type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
      <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">{label}</p>
      <p className="mt-4 text-4xl font-light text-[#181818]">{value}</p>
      {helper ? <p className="mt-3 text-sm leading-6 text-[#6b6b6b]">{helper}</p> : null}
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
          ? "border-emerald-300/40 bg-emerald-50 text-emerald-700"
          : pending
            ? "border-[#e9d8dc] bg-[#fcebed] text-[#b3132b]"
            : cancelled
              ? "border-red-300/40 bg-red-50 text-red-700"
              : "border-[#e9d8dc] bg-white text-[#6b6b6b]"
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
