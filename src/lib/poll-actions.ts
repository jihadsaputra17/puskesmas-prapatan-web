import { sql } from "@vercel/postgres";

export const POLL_OPTIONS = [
  { key: "sangat_bermanfaat", label: "Sangat Bermanfaat" },
  { key: "cukup_bermanfaat", label: "Cukup Bermanfaat" },
  { key: "bermanfaat", label: "Bermanfaat" },
  { key: "kurang_bermanfaat", label: "Kurang Bermanfaat" },
] as const;

export type PollOptionKey = (typeof POLL_OPTIONS)[number]["key"];

export type PollOptionResult = {
  key: PollOptionKey;
  label: string;
  votes: number;
  percentage: number;
};

export type PollSummary = {
  totalVotes: number;
  results: PollOptionResult[];
};

export async function getPollSummary(): Promise<PollSummary> {
  const counts: Record<PollOptionKey, number> = {
    sangat_bermanfaat: 0,
    cukup_bermanfaat: 0,
    bermanfaat: 0,
    kurang_bermanfaat: 0,
  };

  try {
    const { rows } = await sql`SELECT option_key, votes FROM website_poll`;
    for (const row of rows) {
      const k = String(row.option_key) as PollOptionKey;
      if (k in counts) {
        counts[k] = Math.max(0, Number(row.votes ?? 0));
      }
    }
  } catch (error) {
    console.error("Database Error - getPollSummary:", error);
  }

  const totalVotes = Object.values(counts).reduce((acc, v) => acc + v, 0);

  const results: PollOptionResult[] = POLL_OPTIONS.map((opt) => {
    const votes = counts[opt.key] ?? 0;
    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    return {
      key: opt.key,
      label: opt.label,
      votes,
      percentage,
    };
  });

  return { totalVotes, results };
}
