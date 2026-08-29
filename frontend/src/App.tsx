import { useState } from "react";
import ChatScreen from "./user-app/ChatScreen";
import RoleSelectScreen from "./responder-dashboard/RoleSelectScreen";
import CommandCenter from "./responder-dashboard/CommandCenter";

function App() {
  const [mode, setMode] = useState<"user" | "responder" | null>(null);
  const [role, setRole] = useState<string | null>(null);

  if (mode === "user") return <ChatScreen />;
  if (mode === "responder" && role) return <CommandCenter role={role} />;
  if (mode === "responder") return <RoleSelectScreen onSelectRole={setRole} />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "16px",
      }}
    >
      <h1>GuardianAI</h1>

      <button
        onClick={() => setMode("user")}
        style={{
          padding: "12px 24px",
          borderRadius: "8px",
          background: "#0c447c",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        I Need Help (User)
      </button>

      <button
        onClick={() => setMode("responder")}
        style={{
          padding: "12px 24px",
          borderRadius: "8px",
          background: "white",
          color: "#0c447c",
          border: "1px solid #0c447c",
          cursor: "pointer",
        }}
      >
        I'm a Responder
      </button>
    </div>
  );
}

export default App;