import { splitKeys, displayKey } from '../lib/keys.js';

// Render a key-combo string as a row of physical-looking keycaps.
export default function Keycap({ value }) {
  const keys = splitKeys(value);
  return (
    <span className="keycombo">
      {keys.map((k, i) => (
        <span key={i} className="keycap-group">
          <kbd className="keycap">{displayKey(k)}</kbd>
          {i < keys.length - 1 && <span className="keycap-plus">+</span>}
        </span>
      ))}
    </span>
  );
}
