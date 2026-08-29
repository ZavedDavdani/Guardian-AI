export type Urgency = "critical" | "high" | "medium" | "low";

export interface DistributionPlan {
  hospital_name: string;
  victims_assigned: number;
  beds_available: number;
}

export interface ActionPlan {
  distribution_plan: DistributionPlan[];
}

export interface Incident {
  incident_id: string;

  responder_role: string;

  victim_count: number;

  confidence: number;

  urgency: Urgency;

  created_at?: string;

  latitude?: number;
  longitude?: number;

  need_type?: string;

  location_text?: string;

  // Needed by AIActionPlan
  reasoning?: string[];
  action_plan?: ActionPlan;
}

export interface WebSocketMessage {
  type: string;
  payload: Incident;
}