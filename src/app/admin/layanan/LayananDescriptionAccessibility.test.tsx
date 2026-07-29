import { forwardRef, useImperativeHandle, useRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/dynamic", () => ({
  default: () => forwardRef(function QuillMock(_props, ref) {
    const editor = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({ getEditor: () => ({ root: editor.current }) }));
    return <div ref={editor} contentEditable />;
  }),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));

import TambahLayananForm from "./tambah/TambahLayananForm";
import EditLayananForm from "./[id]/edit/EditLayananForm";

describe("service description editor accessibility", () => {
  it.each([
    ["create", <TambahLayananForm key="create" />, "Simpan Layanan"],
    ["edit", <EditLayananForm key="edit" layanan={{ id: "1", nama_poli: "Umum", icon: "🏥" }} />, "Simpan Perubahan"],
  ])("binds label and validation error to %s Quill editable control", (_kind, form, submitLabel) => {
    render(form);

    fireEvent.change(screen.getByLabelText("Nama Poli / Layanan"), { target: { value: "Poli Umum" } });
    fireEvent.click(screen.getByRole("button", { name: submitLabel }));

    const editor = screen.getByLabelText("Deskripsi Layanan");
    expect(editor).toHaveAttribute("contenteditable", "true");
    expect(editor).toHaveAttribute("aria-describedby", "deskripsi-error");
    expect(document.getElementById("deskripsi-error")).toHaveTextContent("Required");
  });
});
