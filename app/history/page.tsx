"use client";

import { useEffect, useState } from "react";
import { Entry } from "@/lib/types";
import HistoryTable from "@/components/history/HistoryTable";

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/entries");
      const data = await res.json();
      setEntries(data);
    } catch {
      console.error("Failed to fetch entries");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/entries/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      console.error("Failed to delete entry");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-white/30 font-sora animate-pulse">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-sm text-white/40 font-sora">
          View and manage all logged entries. Filter by task, person, or month.
        </p>
      </div>
      <HistoryTable entries={entries} onDelete={handleDelete} />
    </div>
  );
}
