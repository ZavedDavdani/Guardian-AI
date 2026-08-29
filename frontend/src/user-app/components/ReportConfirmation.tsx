interface ReportConfirmationProps {
  shelterInfo: unknown;
}

export default function ReportConfirmation({
  shelterInfo,
}: ReportConfirmationProps) {
  if (!shelterInfo) return null;

  return (
    <div
      style={{
        background: "#e8f4ea",
        border: "1px solid #b7dfc0",
        borderRadius: "10px",
        padding: "10px 14px",
        marginTop: "8px",
        fontSize: "13px",
        color: "#1a5c2a",
      }}
    >
      ✓ Report received — Rescue team notified
    </div>
  );
}