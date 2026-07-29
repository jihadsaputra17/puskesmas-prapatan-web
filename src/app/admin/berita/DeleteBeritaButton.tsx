"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default function DeleteBeritaButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const remove = async () => { setPending(true); try { const response = await fetch(`/api/berita/${id}`, { method: "DELETE" }); if (response.ok) router.refresh(); else alert((await response.json()).error || "Gagal menghapus berita."); } catch { alert("Terjadi kesalahan jaringan saat menghapus berita."); } finally { setPending(false); } };
  return <ConfirmDeleteButton itemName="berita" pending={pending} onConfirm={remove} />;
}
