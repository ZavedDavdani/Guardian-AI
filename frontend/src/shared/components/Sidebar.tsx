import {
  LayoutDashboard,
  AlertCircle,
  Map,
  Building2,
  Package,
  Radio,
  Users,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  active: string;
  onNavigate: (view: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Command Center", icon: LayoutDashboard },
  { label: "Incidents", icon: AlertCircle },
  { label: "Live Map", icon: Map },
  { label: "Hospitals", icon: Building2 },
  { label: "Resources", icon: Package },
  { label: "Fake News", icon: Radio },
  { label: "Volunteers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

const AGENTS: string[] = [
  "Victim Assistance",
  "Emergency Intelligence",
  "Resource Finder",
  "NGO Dashboard",
];

export default function Sidebar({
  active,
  onNavigate,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">🛡️ GuardianAI</div>
        <div className="sidebar-subtitle">
          AI Emergency Command Center
        </div>
      </div>

      <div className="sidebar-nav">
        {NAV_ITEMS.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className={`sidebar-item ${
              active === label ? "active" : ""
            }`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={15} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-agents">
        <div className="sidebar-agents-title">
          AI Agents Status
        </div>

        {AGENTS.map((name) => (
          <div key={name} className="agent-row">
            <span>{name}</span>
            <span className="status-dot" />
          </div>
        ))}
      </div>
    </div>
  );
}