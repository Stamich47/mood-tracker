import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InsightsView from "@/components/InsightsView";

export default async function InsightsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch all logs for the user to allow historical insights
  const { data: logs } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  return <InsightsView logs={logs || []} />;
}
