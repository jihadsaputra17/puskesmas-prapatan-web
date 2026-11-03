import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { getStandarPelayananBySlug } from "@/lib/standar-pelayanan-actions";
import EditStandarPelayananForm from "./EditStandarPelayananForm";

export const metadata: Metadata = {
  title: "Edit Standar Pelayanan | Admin",
};

export default async function EditStandarPelayananPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const resolvedParams = await params;
  const item = await getStandarPelayananBySlug(resolvedParams.slug);

  if (!item) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Data Standar Pelayanan Tidak Ditemukan
        </h1>
        <p className="text-slate-600">
          Informasi Standar Pelayanan yang ingin Anda edit tidak ditemukan di database.
        </p>
      </div>
    );
  }

  return <EditStandarPelayananForm item={item} />;
}
