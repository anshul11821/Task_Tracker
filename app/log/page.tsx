import LogForm from "@/components/log/LogForm";

export default function LogPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-sm text-white/40 font-sora">
          Saved checkboxes for the selected day load automatically. Toggle tasks per person, then save.
        </p>
      </div>
      <LogForm />
    </div>
  );
}
