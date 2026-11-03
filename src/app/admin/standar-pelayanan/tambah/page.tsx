import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import TambahStandarPelayananForm from "./TambahStandarPelayananForm";

export const metadata: Metadata = {
  title: "Tambah Standar Pelayanan | Admin",
};

export default async function TambahStandarPelayananPage() {
  await requireAdmin();
  return <TambahStandarPelayananForm />;
}
