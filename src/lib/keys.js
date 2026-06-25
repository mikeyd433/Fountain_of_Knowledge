// Keycap detection: decide whether an inline-code string is a key combo,
// and split it into its constituent keys.

const MODIFIERS = new Set(
  [
    'ctrl', 'control', 'cmd', 'command', '⌘', 'alt', 'option', '⌥', 'opt',
    'shift', '⇧', 'win', 'super', 'meta', 'fn', 'hyper',
  ].map((s) => s.toLowerCase())
);

// Named non-character keys that are valid on their own.
const NAMED_KEYS = new Set(
  [
    'esc', 'escape', 'tab', 'enter', 'return', 'space', 'spacebar', 'backspace',
    'delete', 'del', 'home', 'end', 'pageup', 'pagedown', 'pgup', 'pgdn',
    'insert', 'ins', 'up', 'down', 'left', 'right', '↑', '↓', '←', '→',
    'capslock', 'printscreen', 'scrolllock', 'pause', 'numlock',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
  ].map((s) => s.toLowerCase())
);

// Split on '+' while preserving a literal trailing/standalone '+' as a token.
export function splitKeys(text) {
  const raw = String(text).trim();
  if (raw === '+') return ['+'];
  // Replace "++" (meaning a literal plus key) so it survives the split.
  const tokens = [];
  const parts = raw.split('+');
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p === '') {
      // Empty piece means an adjacent '+' was a literal key.
      if (tokens.length) tokens[tokens.length - 1] = tokens[tokens.length - 1] + '+';
      else tokens.push('+');
    } else {
      tokens.push(p.trim());
    }
  }
  return tokens.filter((t) => t !== '');
}

function isKnownToken(tok) {
  const t = tok.toLowerCase();
  if (MODIFIERS.has(t) || NAMED_KEYS.has(t)) return true;
  // Single visible character (letter, digit, punctuation, symbol).
  if (tok.length === 1) return true;
  // Mouse / scroll references occasionally used in cheat sheets.
  if (['lmb', 'rmb', 'mmb', 'click', 'scroll', 'drag'].includes(t)) return true;
  return false;
}

// Body inline code is a keycap combo only when it joins 2+ known tokens with '+'.
export function isKeyCombo(text) {
  const s = String(text).trim();
  if (!s.includes('+')) return false;
  const tokens = splitKeys(s);
  if (tokens.length < 2) return false;
  return tokens.every(isKnownToken);
}

// Pretty-print a token for display on a keycap.
const DISPLAY = {
  ctrl: 'Ctrl', control: 'Ctrl', cmd: '⌘', command: '⌘', alt: 'Alt',
  option: '⌥', opt: '⌥', shift: 'Shift', win: 'Win', super: 'Super',
  meta: 'Meta', fn: 'Fn', esc: 'Esc', escape: 'Esc', enter: 'Enter',
  return: 'Return', space: 'Space', spacebar: 'Space', tab: 'Tab',
  backspace: 'Backspace', delete: 'Del', del: 'Del', up: '↑', down: '↓',
  left: '←', right: '→', pageup: 'PgUp', pagedown: 'PgDn', pgup: 'PgUp',
  pgdn: 'PgDn', lmb: 'LMB', rmb: 'RMB', mmb: 'MMB',
};

export function displayKey(tok) {
  const t = tok.toLowerCase();
  if (DISPLAY[t]) return DISPLAY[t];
  if (tok.length === 1) return tok.toUpperCase();
  return tok;
}
