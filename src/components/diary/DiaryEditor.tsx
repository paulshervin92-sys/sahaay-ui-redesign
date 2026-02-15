import React, { useState, useEffect } from "react";
import { saveDiaryEntry, DiaryEntry } from "@/lib/diaryApi";

interface DiaryEditorProps {
  entry?: DiaryEntry | null;
  date: Date;
}

const DiaryEditor = ({ entry, date }: DiaryEditorProps) => {
  const [content, setContent] = useState(entry?.entry || "");
  const [saving, setSaving] = useState(false);
  useEffect(() => { setContent(entry?.entry || ""); }, [entry]);

  // Auto-save after user stops typing
  useEffect(() => {
    if (content === (entry?.entry || "")) return;
    const timeout = setTimeout(async () => {
      setSaving(true);
      await saveDiaryEntry({
        createdAt: date.toISOString().slice(0, 10),
        entry: content,
        prompt: "Journal Entry"
      });
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content, entry, date]);



  return (
    <div className="relative flex-1">
      <textarea
        className="w-full h-48 bg-transparent border-none outline-none resize-none text-base font-mono leading-relaxed diary-lines"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write your thoughts here..."
        rows={12}
        spellCheck={true}
        style={{ background: "none" }}
      />
      {saving && <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">Saving...</div>}
    </div>
  );
};

export default DiaryEditor;
