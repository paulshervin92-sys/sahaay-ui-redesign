import React, { useState, useEffect } from "react";
import { saveDiaryEntry } from "@/lib/diaryApi";

const DiaryEditor = ({ entry, date }) => {
  const [content, setContent] = useState(entry?.content || "");
  const [saving, setSaving] = useState(false);
  useEffect(() => { setContent(entry?.content || ""); }, [entry]);

  // Auto-save after user stops typing
  useEffect(() => {
    if (content === (entry?.content || "")) return;
    const timeout = setTimeout(async () => {
      setSaving(true);
      await saveDiaryEntry({ date: date.toISOString().slice(0, 10), content });
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
