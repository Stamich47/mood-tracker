export interface Log {
  id?: string;
  user_id?: string;
  date: string;
  mood: number;
  worked_out: boolean;
  exercises: string[];
  drinks: number;
  notes?: string;
  created_at?: string;
}
