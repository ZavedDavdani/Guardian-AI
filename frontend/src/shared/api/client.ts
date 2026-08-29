import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function sendVictimMessage(message: string, userId: string) {
  const response = await axios.post(`${API_BASE}/pipeline/run`, {
    message,
    user_id: userId,
  });

  return {
    victim_reply:
      response.data.victim_reply ||
      "Help is on the way. Your report has been received.",
  };
}