"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default function DeleteUserButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const remove = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (response.ok) router.refresh(); else alert("Gagal menghapus pengguna. Coba lagi.");
    } catch { alert("Gagal menghapus pengguna. Periksa koneksi lalu coba lagi."); }
    finally { setPending(false); }
  };
  return <ConfirmDeleteButton itemName="pengguna" pending={pending} onConfirm={remove} />;
}
