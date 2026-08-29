import { useEffect, useState } from "react";

interface Hospital {
  name: string;
  area: string;
  icu_available: number;
  icu_total: number;
}

export default function HospitalStatus() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/hospitals/`)
      .then((r) => r.json())
      .then(setHospitals)
      .catch(() => setHospitals([]));
  }, []);

  const getColor = (pct: number) => {
    if (pct >= 85) return "var(--critical)";
    if (pct >= 60) return "var(--warning)";
    return "var(--success)";
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Hospital Status (Live Capacity)</div>
        <span
          style={{
            fontSize: "11.5px",
            color: "var(--accent)",
            cursor: "pointer",
          }}
        >
          View All
        </span>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {hospitals.map((h) => {
          const occupiedPct = Math.round(
            (1 - h.icu_available / h.icu_total) * 100
          );

          return (
            <div key={h.name} className="hospital-row">
              <div className="hospital-name">
                {h.name}{" "}
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: 400,
                  }}
                >
                  ({h.area})
                </span>
              </div>

              <div
                className="hospital-pct"
                style={{ color: getColor(occupiedPct) }}
              >
                {occupiedPct}%
              </div>

              <div className="capacity-bar">
                <div
                  className="capacity-fill"
                  style={{
                    width: `${occupiedPct}%`,
                    background: getColor(occupiedPct),
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ICU: {h.icu_available}/{h.icu_total}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}