interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

function Editor({ content, onChange }: EditorProps) {
  return (
    <section className="editor">
      <h3 style={{ marginBottom: "0.5rem" }}>Workspace Editor</h3>

      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start collaborating here..."
      />
    </section>
  );
}

export default Editor;
