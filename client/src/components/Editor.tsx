interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  return (
    <div className="h-full w-full p-4">
      <textarea
        className="h-full w-full resize-none rounded-lg border border-gray-200 p-4 text-base leading-relaxed text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing to collaborate..."
        spellCheck={false}
      />
    </div>
  );
}
