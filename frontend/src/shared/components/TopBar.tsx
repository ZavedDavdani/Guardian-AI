import { Bell, User } from "lucide-react";

interface TopBarProps {
  role?: string;
}

export default function TopBar({ role }: TopBarProps) {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-eyebrow">
          AI Emergency Command Center
        </div>

        <div className="topbar-title">
          Live Operations Overview

          <span className="live-badge">
            <span
              className="status-dot"
              style={{ boxShadow: "none" }}
            />
            System Operational
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ position: "relative" }}>
          <Bell size={19} color="var(--text-secondary)" />

          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--critical)",
              color: "white",
              fontSize: "9.5px",
              fontWeight: 700,
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            12
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={16} color="var(--accent)" />
          </div>

          <div style={{ fontSize: "12.5px" }}>
            <div style={{ fontWeight: 600 }}>
              Rescue Coordinator
            </div>

            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "11px",
              }}
            >
              {role
                ? role.replace("_", " ").toUpperCase()
                : "NGO TEAM"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}