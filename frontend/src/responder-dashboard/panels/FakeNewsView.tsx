import { useState } from "react";
import { AlertOctagon, ShieldAlert } from "lucide-react";

interface Rumor {
  id: number;
  text: string;
  confidence: number;
  source: string;
  status: "pending" | "warned";
}

const INITIAL_RUMORS: Rumor[] = [
  {
    id: 1,
    text: '"Dam has burst near Osman Sagar" — circulating on WhatsApp',
    confidence: 96,
    source: "WhatsApp Forward",
    status: "pending",
  },
  {
    id: 2,
    text: '"All relief camps in Ameerpet are full, do not go" — unverified post',
    confidence: 82,
    source: "Twitter/X",
    status: "pending",
  },
  {
    id: 3,
    text: '"Free ambulance number changed to XXXX" — unofficial forward',
    confidence: 74,
    source: "WhatsApp Forward",
    status: "pending",
  },
];

export default function FakeNewsView(): React.ReactElement {
  const [rumors, setRumors] = useState<Rumor[]>(INITIAL_RUMORS);

  const issueWarning = (id: number): void => {
    setRumors((prev) =>
      prev.map((rumor) =>
        rumor.id === id
          ? { ...rumor, status: "warned" }
          : rumor
      )
    );
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">
          Misinformation Monitor
        </span>
      </div>

      {rumors.map((rumor) => (
        <div
          key={rumor.id}
          style={{
            border: "1px solid #fecaca",
            background: "var(--critical-bg)",
            borderRadius: "var(--radius-sm)",
            padding: "12px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <AlertOctagon
                size={16}
                color="var(--critical)"
                style={{
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />

              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {rumor.text}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginTop: 4,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Confidence: {rumor.confidence}% &middot; Source:{" "}
                  {rumor.source}
                </div>
              </div>
            </div>

            <span className="badge red">
              Likely Fake
            </span>
          </div>

          <button
            onClick={() => issueWarning(rumor.id)}
            disabled={rumor.status === "warned"}
            className="btn"
            style={{
              marginTop: "10px",
              width: "auto",
              padding: "6px 14px",
              background:
                rumor.status === "warned"
                  ? "var(--success-bg)"
                  : "var(--critical)",
              color:
                rumor.status === "warned"
                  ? "var(--success)"
                  : "white",
            }}
          >
            <ShieldAlert
              size={13}
              style={{
                verticalAlign: "-2px",
                marginRight: 4,
              }}
            />
            {rumor.status === "warned"
              ? "Warning Issued ✓"
              : "Issue Public Warning"}
          </button>
        </div>
      ))}
    </div>
  );
}