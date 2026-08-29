import { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";

interface MicButtonProps {
  onTranscript: (transcript: string) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function MicButton({
  onTranscript,
}: MicButtonProps): React.JSX.Element {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <button
      onClick={listening ? stopListening : startListening}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: "none",
        background: listening ? "var(--critical)" : "#eef1f6",
        color: listening ? "white" : "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        animation: listening ? "pulse-dot 1s infinite" : "none",
      }}
      title={listening ? "Listening... click to stop" : "Tap to speak"}
    >
      {listening ? <Square size={16} /> : <Mic size={18} />}
    </button>
  );
}