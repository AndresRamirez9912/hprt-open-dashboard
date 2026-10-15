import type { Ref } from "react";

interface PhotoFileInputProps {
  ref: Ref<HTMLInputElement>;
  onFile: (file: File) => void;
}

/** Hidden image picker; open it with ref.current.click(). */
export function PhotoFileInput({ ref, onFile }: PhotoFileInputProps) {
  return (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      className="visually-hidden"
      tabIndex={-1}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = ""; // choosing the same file again still fires onChange
      }}
    />
  );
}
