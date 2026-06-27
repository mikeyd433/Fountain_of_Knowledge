// Render a ```glossary fenced block as a Term / Definition table. The same
// entries are also collected library-wide (content.js) so reference tooltips
// like {{term}} and {{label|@key}} can pull their gloss from here.
function parseRows(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^[-|\s]+$/.test(line))
    .map((line) => {
      const idx = line.indexOf('|');
      if (idx === -1) return { term: line, def: '' };
      return { term: line.slice(0, idx).trim(), def: line.slice(idx + 1).trim() };
    });
}

export default function GlossaryTable({ source }) {
  const rows = parseRows(source);
  return (
    <table className="glossary-table">
      <thead>
        <tr>
          <th>Term</th>
          <th>Definition</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="glossary-term">{r.term}</td>
            <td className="glossary-def">{r.def}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
