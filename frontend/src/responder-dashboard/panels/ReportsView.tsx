import { Download } from "lucide-react";
import type { Incident } from "../../shared/types";
import { getIncidentLabel } from "../../shared/incidentLabels";

interface ReportsViewProps {
  incidents?: Incident[];
}

export default function ReportsView({
  incidents = [],
}: ReportsViewProps): React.JSX.Element {
  const exportCSV = (): void => {
    const header =
      "Incident ID,Location,Type,Urgency,Victims,Confidence,Time\n";

    const rows = incidents
      .map(
        (i) =>
          `${i.incident_id},${i.location_text ?? ""},${getIncidentLabel(
            i.need_type
          )},${i.urgency},${i.victim_count},${i.confidence},${
            i.created_at ?? ""
          }`
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "guardianai_incident_report.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Incident Reports</span>

        <button
          onClick={exportCSV}
          className="btn btn-approve"
          style={{
            width: "auto",
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <table
        style={{
          width: "100%",
          fontSize: "12.5px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              color: "var(--text-secondary)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <th style={{ padding: "6px 0" }}>Location</th>
            <th>Type</th>
            <th>Urgency</th>
            <th>Victims</th>
            <th>Confidence</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.incident_id}
              style={{
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <td style={{ padding: "6px 0" }}>
                {incident.location_text ?? "Unknown"}
              </td>

              <td>{getIncidentLabel(incident.need_type)}</td>

              <td style={{ textTransform: "capitalize" }}>
                {incident.urgency}
              </td>

              <td
                style={{
                  fontFamily: "var(--font-mono)",
                }}
              >
                {incident.victim_count}
              </td>

              <td
                style={{
                  fontFamily: "var(--font-mono)",
                }}
              >
                {Math.round((incident.confidence ?? 0) * 100)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}