import LogForm from "@/components/log/LogForm";

export default function LogPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-sm text-white/40 font-sora">
          Select a date, toggle tasks per person, and save. Use &quot;Load Existing&quot; to prefill from the database.
        </p>
      </div>
      <LogForm />
    </div>
  );
}
