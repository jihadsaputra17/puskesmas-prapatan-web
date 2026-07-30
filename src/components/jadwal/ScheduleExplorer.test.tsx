import { fireEvent, render, screen } from "@testing-library/react";
import ScheduleExplorer from "./ScheduleExplorer";

const rows = [
  { id: "1", doctor: "Dr. A", poli: "Umum", day: "Senin", hours: "08.00 - 12.00", jam_mulai: "08:00", jam_selesai: "12:00" },
  { id: "2", doctor: "Dr. B", poli: "Gigi", day: "Selasa", hours: "08.00 - 12.00", jam_mulai: "08:00", jam_selesai: "12:00" },
];

describe("ScheduleExplorer", () => {
  it("filters rows by selected poli", () => {
    render(<ScheduleExplorer scheduleData={rows} />);
    fireEvent.change(screen.getByLabelText("Filter poli"), { target: { value: "Gigi" } });
    expect(screen.getByText("Dr. B")).toBeInTheDocument();
    expect(screen.queryByText("Dr. A")).not.toBeInTheDocument();
  });
});
