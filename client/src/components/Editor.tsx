interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

function Editor({ content, onChange }: EditorProps) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      rows={12}
      style={{
        width: "100%",
        marginTop: "1.5rem",
        padding: "1rem",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        resize: "vertical",
      }}
    />
  );
}

export default Editor;
