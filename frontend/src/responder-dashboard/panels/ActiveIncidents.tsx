import { AlertTriangle } from "lucide-react";
import { getSeverityColor } from "../../shared/severity";
import type { Incident } from "../../shared/types";



interface ActiveIncidentsProps {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}
function timeAgo(timestamp?: string): string {
  if (!timestamp) return "just now";

  // Backend sends naive UTC timestamps
  const utcString = timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`;

  const diffMs = Date.now() - new Date(utcString).getTime();
  const mins = Math.round(diffMs / 60000);

  return mins <= 0 ? "just now" : `${mins}m ago`;
}

export default function ActiveIncidents({
  incidents = [],
  onSelect,
}: ActiveIncidentsProps) {
  return (
    <div className="panel" style={{ flex: 1, minWidth: "260px" }}>
      <div className="panel-header">
        <h3>Active Incidents</h3>
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

      {incidents.length === 0 && (
        <div
          style={{
            fontSize: "12.5px",
            color: "var(--text-secondary)",
          }}
        >
          No incidents yet — waiting for reports...
        </div>
      )}

      {incidents.map((inc) => {
        const color = getSeverityColor(inc.urgency);

        const iconColor =
          color === "red"
            ? "var(--critical)"
            : color === "yellow"
            ? "var(--warning)"
            : "var(--success)";

        const title =
          inc.need_type === "fire"
            ? "Fire"
            : inc.need_type === "medical"
            ? "Medical Emergency"
            : "Flood";

        return (
          <div
            key={inc.incident_id}
            className={`incident-card severity-${color}`}
            onClick={() => onSelect(inc)}
            style={{ cursor: "pointer" }}
          >
            <div className="incident-title">
              <span>
                <AlertTriangle
                  size={13}
                  color={iconColor}
                  style={{
                    verticalAlign: "-2px",
                    marginRight: 5,
                  }}
                />
                {title}
                {inc.location_text ? ` — ${inc.location_text}` : ""}
              </span>

              <span className={`badge ${color}`}>
                {inc.urgency.toUpperCase()}
              </span>
            </div>

            <div className="incident-meta">
              {inc.victim_count} victims &middot; {timeAgo(inc.created_at)}
              &middot; {Math.round((inc.confidence ?? 0) * 100)}% confidence
            </div>
          </div>
        );
      })}
    </div>
  );
}