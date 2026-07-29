import type { ReactNode } from "react";

export default function SectionHeading({
  title,
  description,
  id,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  id?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl accent-bar">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 id={id} className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {description}
          </p>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
