"use client";

type ConfirmDeleteButtonProps = {
  onConfirm: () => void | Promise<void>;
  itemName: string;
  pending?: boolean;
};

export default function ConfirmDeleteButton({ onConfirm, itemName, pending = false }: ConfirmDeleteButtonProps) {
  const handleClick = () => {
    if (window.confirm(`Hapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`)) {
      void onConfirm();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-medium text-red-600 transition-colors hover:text-red-800 disabled:text-[var(--muted)]"
    >
      {pending ? "Menghapus..." : `Hapus ${itemName}`}
    </button>
  );
}
