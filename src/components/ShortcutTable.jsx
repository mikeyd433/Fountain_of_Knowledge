import Keycap from './Keycap.jsx';

// Parse the body of a ```shortcuts fenced block into rows of "Action | Keys".
function parseRows(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^[-|\s]+$/.test(line))
    .map((line) => {
      const idx = line.indexOf('|');
      if (idx === -1) return { action: line, keys: '' };
      return {
        action: line.slice(0, idx).trim(),
        keys: line.slice(idx + 1).trim(),
      };
    });
}

export default function ShortcutTable({ source }) {
  const rows = parseRows(source);
  return (
    <table className="shortcut-table">
      <thead>
        <tr>
          <th>Action</th>
          <th>Keys</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="shortcut-action">{r.action}</td>
            <td className="shortcut-keys">
              {r.keys ? <Keycap value={r.keys} /> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
