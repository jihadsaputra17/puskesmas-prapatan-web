type Feedback = { type: "success" | "error"; message: string } | null;

export default function AdminFeedback({ result }: { result: Feedback }) {
  if (!result) return null;
  return <div role={result.type === "error" ? "alert" : "status"} className={`mb-6 rounded-lg border p-4 text-sm ${result.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-teal-200 bg-teal-50 text-teal-800"}`}>{result.message}</div>;
}
