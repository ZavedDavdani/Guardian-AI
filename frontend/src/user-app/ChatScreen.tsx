import { useState, useRef, useEffect } from "react";
import { Send, ShieldCheck, Loader2 } from "lucide-react";
import { sendVictimMessage } from "../shared/api/client";
import MicButton from "./components/MicButton";

interface Message {
  sender: "bot" | "user";
  text: string;
  confirmed?: boolean;
}

export default function ChatScreen(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi, I'm here to help. Tell me what's happening and where — type, or tap the mic to speak in Telugu, Hindi, Urdu or English.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const text = overrideText ?? input;

    if (!text.trim() || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);

    try {
      const result = await sendVictimMessage(
        text,
        "u_" + Date.now()
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: result.victim_reply,
          confirmed: true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Connection issue — please try sending again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    handleSend(transcript);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "460px",
        margin: "0 auto",
        background: "var(--bg-app)",
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          background: "var(--bg-sidebar)",
          color: "white",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          🛡️ GuardianAI
        </div>

        <div
          style={{
            fontSize: "11.5px",
            color: "var(--text-muted-inverse)",
          }}
        >
          Emergency Assistance — Always here
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                m.sender === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                background:
                  m.sender === "user"
                    ? "var(--accent)"
                    : "white",
                color:
                  m.sender === "user"
                    ? "white"
                    : "var(--text-primary)",
                padding: "10px 14px",
                borderRadius: "14px",
                borderBottomRightRadius:
                  m.sender === "user" ? "4px" : "14px",
                borderBottomLeftRadius:
                  m.sender === "bot" ? "4px" : "14px",
                maxWidth: "80%",
                fontSize: "14px",
                boxShadow: "var(--shadow-card)",
                lineHeight: 1.4,
              }}
            >
              {m.text}

              {m.confirmed && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 6,
                    fontSize: "11px",
                    color: "var(--success)",
                  }}
                >
                  <ShieldCheck size={12} />
                  Report received — Rescue team notified
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "12.5px",
              color: "var(--text-secondary)",
            }}
          >
            <Loader2 size={14} className="spin" />
            Processing your report...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px",
          borderTop: "1px solid var(--border-subtle)",
          background: "white",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSend()
          }
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "11px 14px",
            borderRadius: "22px",
            border: "1px solid var(--border-subtle)",
            fontSize: "14px",
            outline: "none",
          }}
        />

        <MicButton onTranscript={handleVoiceTranscript} />

        <button
          onClick={() => handleSend()}
          disabled={loading}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            background: "var(--accent)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}