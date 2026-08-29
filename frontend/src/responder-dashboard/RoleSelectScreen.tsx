const ROLES = [
  { id: "ngo", label: "NGO" },
  { id: "fire_brigade", label: "Fire Brigade" },
  { id: "medical", label: "Medical / Hospital" },
  { id: "police", label: "Police" },
  { id: "disaster_management", label: "Disaster Management Authority" },
  { id: "volunteer_coordinator", label: "Volunteer Coordinator" },
];

interface RoleSelectScreenProps {
  onSelectRole: (role: string) => void;
}

export default function RoleSelectScreen({
  onSelectRole,
}: RoleSelectScreenProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f4f6f9",
      }}
    >
      <h2 style={{ color: "#0c447c", marginBottom: "20px" }}>
        Select Your Role
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 220px)",
          gap: "16px",
        }}
      >
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            style={{
              padding: "18px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              background: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}