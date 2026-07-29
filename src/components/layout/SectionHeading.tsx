export default function SectionHeading({ title, description, id }: { title: string; description?: string; id?: string }) {
  return <div className="max-w-2xl"><h2 id={id} className="text-3xl font-bold tracking-tight text-[#12304a] sm:text-4xl">{title}</h2>{description && <p className="mt-3 text-lg leading-8 text-slate-600">{description}</p>}</div>;
}
