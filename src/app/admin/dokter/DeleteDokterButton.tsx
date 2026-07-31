"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export function DeleteDokterButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const remove = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/dokter/${id}`, { method: "DELETE" });
      if (response.ok) router.refresh();
      else alert((await response.json()).error || "Gagal menghapus data dokter.");
    } catch {
      alert("Terjadi kesalahan jaringan saat menghapus data dokter.");
    } finally {
      setPending(false);
    }
  };
  return <ConfirmDeleteButton itemName="dokter" pending={pending} onConfirm={remove} />;
}
