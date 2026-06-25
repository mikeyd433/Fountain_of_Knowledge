// gray-matter relies on a Node-style global `Buffer`. This module must be
// imported before anything that uses gray-matter so the global exists by the
// time those modules are evaluated.
import { Buffer } from 'buffer';

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}
