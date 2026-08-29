import { useState } from "react";
import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import type { Incident } from "../../shared/types";

interface AIActionPlanProps {
  incident: Incident | null;
}

export default function AIActionPlan({
  incident,
}: AIActionPlanProps): React.JSX.Element {
  const [status, setStatus] = useState<
    "pending" | "approved" | "overridden"
  >("pending");

  if (!incident) {
    return (
      <div className="panel" style={{ flex: 1 }}>
        <div className="panel-header">
          <span className="panel-title">AI Action Plan</span>
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          Waiting for incident data...
        </div>
      </div>
    );
  }

  const {
    action_plan,
    reasoning,
    confidence,
    urgency,
    victim_count,
  } = incident;

  const distributionPlan = action_plan?.distribution_plan ?? [];
  const reasoningList = reasoning ?? [];

  const logDecision = async (
    decision: "approved" | "overridden"
  ): Promise<void> => {
    setStatus(decision);

    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/responder/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incident_id: incident.incident_id,
            decision,
          }),
        }
      );
    } catch (e) {
      console.error("Failed to log decision", e);
    }
  };

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header">
        <span className="panel-title">
          <Sparkles
            size={13}
            style={{ verticalAlign: "-2px", marginRight: 4 }}
          />
          AI Action Plan
        </span>

        <div className="badge medium">
          {Math.round(confidence * 100)}% confidence
        </div>
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          marginBottom: "8px",
        }}
      >
        {victim_count} victims &middot; {urgency} urgency
      </div>

      {distributionPlan.map((plan, index) => (
        <div key={index} className="plan-row">
          <span>{plan.hospital_name}</span>
          <span className="plan-victims">
            {plan.victims_assigned} pts &middot; {plan.beds_available} beds
          </span>
        </div>
      ))}

      <div className="reasoning-box">
        {reasoningList.map((reason, index) => (
          <div key={index} className="reasoning-item">
            <CheckCircle2
              size={13}
              color="var(--success)"
            />{" "}
            {reason}
          </div>
        ))}
      </div>

      <div className="btn-row">
        {status === "pending" && (
          <>
            <button
              className="btn btn-approve"
              onClick={() => logDecision("approved")}
            >
              <CheckCircle2
                size={14}
                style={{
                  verticalAlign: "-2px",
                  marginRight: 4,
                }}
              />
              {" "}Approve Plan
            </button>

            <button
              className="btn btn-override"
              onClick={() => logDecision("overridden")}
            >
              <AlertTriangle
                size={14}
                style={{
                  verticalAlign: "-2px",
                  marginRight: 4,
                }}
              />
              {" "}Override
            </button>
          </>
        )}

        {status === "approved" && (
          <button className="btn btn-approved" disabled>
            ✓ Plan Approved
          </button>
        )}

        {status === "overridden" && (
          <button className="btn btn-override" disabled>
            ⚠ Overridden by you
          </button>
        )}
      </div>
    </div>
  );
}