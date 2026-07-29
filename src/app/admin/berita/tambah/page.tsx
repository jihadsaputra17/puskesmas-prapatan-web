import { Metadata } from "next";
import TambahBeritaForm from "./TambahBeritaForm";

export const metadata: Metadata = {
  title: "Tambah Berita | Admin",
};

export default function TambahBeritaPage() {
  return (
    <TambahBeritaForm />
  );
}