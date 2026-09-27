import { useEffect, useState } from "react";
import { IDEA_STORAGE_KEY } from "./idea-submission";

export function useIdeaDraft() {
  const [draft, setDraft] = useState<string[]>(Array(7).fill(""));
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(IDEA_STORAGE_KEY) || "null");
      if (
        Array.isArray(value) &&
        value.length === 7 &&
        value.every((item) => typeof item === "string")
      ) {
        setDraft(value.map((item: string) => item.slice(0, 1000)));
      }
    } catch {
      setSaveError(true);
    }
    setReady(true);
  }, []);

  function save(values = draft) {
    try {
      localStorage.setItem(IDEA_STORAGE_KEY, JSON.stringify(values));
      setSaveError(false);
      return true;
    } catch {
      setSaveError(true);
      return false;
    }
  }

  function update(index: number, value: string) {
    const next = draft.map((item, itemIndex) =>
      itemIndex === index ? value.slice(0, 1000) : item,
    );
    setDraft(next);
    save(next);
  }

  return { draft, update, save, ready, saveError };
}
