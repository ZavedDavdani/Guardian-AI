import { useState, type KeyboardEvent,type ChangeEvent } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState<string>("");

  const handleSend = (): void => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "10px",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type in Telugu, Hindi, Urdu, English..."
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />

      <button
        onClick={handleSend}
        style={{
          padding: "10px 18px",
          borderRadius: "20px",
          border: "none",
          background: "#0c447c",
          color: "white",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}