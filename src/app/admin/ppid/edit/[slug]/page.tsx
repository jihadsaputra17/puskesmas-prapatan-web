import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { getPpidBySlug } from "@/lib/ppid-actions";
import EditPpidForm from "./EditPpidForm";

export const metadata: Metadata = {
  title: "Edit Informasi PPID | Admin",
};

export default async function EditPpidPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const resolvedParams = await params;
  const item = await getPpidBySlug(resolvedParams.slug);

  if (!item) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Data PPID Tidak Ditemukan</h1>
        <p className="text-slate-600">
          Informasi PPID yang ingin Anda edit tidak ditemukan di database.
        </p>
      </div>
    );
  }

  return <EditPpidForm item={item} />;
}
