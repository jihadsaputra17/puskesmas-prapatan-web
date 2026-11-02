import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import TambahPpidForm from "./TambahPpidForm";

export const metadata: Metadata = {
  title: "Tambah Informasi PPID | Admin",
};

export default async function TambahPpidPage() {
  await requireAdmin();
  return <TambahPpidForm />;
}
