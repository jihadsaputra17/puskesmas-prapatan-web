"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export function DeleteLayananButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const remove = async () => { setPending(true); try { const response = await fetch(`/api/layanan/${id}`, { method: "DELETE" }); if (response.ok) router.refresh(); else alert((await response.json()).error || "Gagal menghapus layanan."); } catch { alert("Terjadi kesalahan jaringan saat menghapus layanan."); } finally { setPending(false); } };
  return <ConfirmDeleteButton itemName="layanan" pending={pending} onConfirm={remove} />;
}
