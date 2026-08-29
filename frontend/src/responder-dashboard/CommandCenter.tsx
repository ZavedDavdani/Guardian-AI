import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Users,
  Building2,
  ShieldCheck,
  Clock,
} from "lucide-react";

import Sidebar from "../shared/components/Sidebar";
import TopBar from "../shared/components/TopBar";
import StatCard from "../shared/components/StatCard";

import ActiveIncidents from "./panels/ActiveIncidents";
import LiveMap from "./panels/LiveMap";
import AIActionPlan from "./panels/AIActionPlan";
import HospitalStatus from "./panels/HospitalStatus";
import ResourcesView from "./panels/ResourcesView";
import FakeNewsView from "./panels/FakeNewsView";
import VolunteersView from "./panels/VolunteersView";
import AnalyticsView from "./panels/AnalyticsView";
import ReportsView from "./panels/ReportsView";
import SettingsView from "./panels/SettingsView";

import { canView } from "../shared/permissions";
import { useWebSocket } from "../shared/hooks/useWebSocket";
import type { Incident, WebSocketMessage } from "../shared/types";

interface CommandCenterProps {
  role: string;
}

export default function CommandCenter({
  role,
}: CommandCenterProps): React.JSX.Element {
  const wsMessage = useWebSocket() as WebSocketMessage | null;

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [view, setView] = useState<string>("Command Center");

  useEffect(() => {
    if (wsMessage?.type === "incident_update") {
      const incident = wsMessage.payload;

      setIncidents((prev) => {
        const exists = prev.find(
          (i) => i.incident_id === incident.incident_id
        );

        if (exists) {
          return prev.map((i) =>
            i.incident_id === incident.incident_id ? incident : i
          );
        }

        return [incident, ...prev];
      });

      setActiveIncident(incident);
    }
  }, [wsMessage]);

  const visibleIncidents =
    role === "ngo" || role === "disaster_management"
      ? incidents
      : incidents.filter((i) => i.responder_role === role);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar active={view} onNavigate={setView} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TopBar role={role} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <div className="stat-row">
            <StatCard
              icon={<AlertTriangle size={18} color="var(--critical)" />}
              iconBg="var(--critical-bg)"
              label="Critical Incidents"
              value={visibleIncidents.length}
              sub={`+${visibleIncidents.length} new`}
            />

            <StatCard
              icon={<Users size={18} color="var(--accent)" />}
              iconBg="var(--accent-glow)"
              label="People Assisted"
              value={visibleIncidents.reduce(
                (sum, incident) => sum + (incident.victim_count || 0),
                0
              )}
            />

            <StatCard
              icon={<Building2 size={18} color="var(--success)" />}
              iconBg="var(--success-bg)"
              label="Hospitals Connected"
              value="4"
            />

            <StatCard
              icon={<ShieldCheck size={18} color="var(--warning)" />}
              iconBg="var(--warning-bg)"
              label="AI Confidence"
              value={
                activeIncident
                  ? `${Math.round(activeIncident.confidence * 100)}%`
                  : "—"
              }
            />

            <StatCard
              icon={<Clock size={18} color="var(--accent)" />}
              iconBg="var(--accent-glow)"
              label="Avg Response Time"
              value="8m 24s"
            />
          </div>

          {view === "Command Center" && (
            <>
              <div className="panel-grid">
                {canView(role, "incidents") && (
                  <ActiveIncidents
                    incidents={visibleIncidents}
                    onSelect={setActiveIncident}
                  />
                )}

                {canView(role, "map") && (
                  <LiveMap incidents={visibleIncidents} />
                )}

                {canView(role, "action_plan") && (
                  <AIActionPlan incident={activeIncident} />
                )}
              </div>

              {canView(role, "hospitals") && (
                <div style={{ padding: "0 24px 24px" }}>
                  <HospitalStatus />
                </div>
              )}
            </>
          )}

          {view === "Incidents" && (
            <div style={{ padding: "16px 24px" }}>
              <ActiveIncidents
                incidents={visibleIncidents}
                onSelect={setActiveIncident}
              />
            </div>
          )}

          {view === "Live Map" && (
            <div style={{ padding: "16px 24px" }}>
              <LiveMap incidents={visibleIncidents} />
            </div>
          )}

          {view === "Hospitals" && (
            <div style={{ padding: "16px 24px" }}>
              <HospitalStatus />
            </div>
          )}

          {view === "Resources" && (
            <div style={{ padding: "16px 24px" }}>
              <ResourcesView />
            </div>
          )}

          {view === "Fake News" && (
            <div style={{ padding: "16px 24px" }}>
              <FakeNewsView />
            </div>
          )}

          {view === "Volunteers" && (
            <div style={{ padding: "16px 24px" }}>
              <VolunteersView />
            </div>
          )}

          {view === "Analytics" && (
            <div style={{ padding: "16px 24px" }}>
              <AnalyticsView incidents={visibleIncidents} />
            </div>
          )}

          {view === "Reports" && (
            <div style={{ padding: "16px 24px" }}>
              <ReportsView incidents={visibleIncidents} />
            </div>
          )}

          {view === "Settings" && (
            <div style={{ padding: "16px 24px" }}>
              <SettingsView role={role} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}