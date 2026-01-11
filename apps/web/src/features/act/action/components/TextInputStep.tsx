type TextInputStepProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
};

export function TextInputStep({
  value,
  onChange,
  placeholder,
}: TextInputStepProps) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <textarea
        className="flex-1 min-h-[200px] p-4 text-body-medium resize-none scrollbar-hide focus:outline-none focus:ring-0 bg-white/60 rounded-2xl border border-white shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
