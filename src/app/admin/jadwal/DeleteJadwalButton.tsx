"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default function DeleteJadwalButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const remove = async () => { setPending(true); try { const response = await fetch(`/api/jadwal/${id}`, { method: "DELETE" }); if (response.ok) router.refresh(); else alert((await response.json()).error || "Gagal menghapus jadwal."); } catch { alert("Terjadi kesalahan jaringan saat menghapus jadwal."); } finally { setPending(false); } };
  return <ConfirmDeleteButton itemName="jadwal" pending={pending} onConfirm={remove} />;
}
