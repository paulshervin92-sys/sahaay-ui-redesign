interface CalendarPickerProps {
  initialDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const CalendarPicker = ({ initialDate, onSelect, onClose }: CalendarPickerProps) => {

  // Use a simple input type="date" for now (can be replaced with a custom calendar)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl p-6 w-[320px] shadow-xl relative animate-fade-in flex flex-col items-center">
        <button className="absolute top-2 right-2 text-muted-foreground" onClick={onClose}>&times;</button>
        <h3 className="font-bold text-lg mb-4">Pick a date</h3>
        <input
          type="date"
          className="rounded border px-2 py-1 bg-background text-foreground"
          defaultValue={initialDate.toISOString().slice(0, 10)}
          onChange={e => onSelect(new Date(e.target.value))}
        />
      </div>
    </div>
  );
};

export default CalendarPicker;
