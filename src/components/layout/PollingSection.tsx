import { getPollSummary } from "@/lib/poll-actions";
import PollingWidget from "./PollingWidget";

export default async function PollingSection() {
  const initialSummary = await getPollSummary();

  return (
    <section
      className="section-band bg-[var(--sky-wash)]"
      id="polling"
      aria-labelledby="polling-heading"
    >
      <div className="content-container">
        <PollingWidget initialSummary={initialSummary} />
      </div>
    </section>
  );
}
