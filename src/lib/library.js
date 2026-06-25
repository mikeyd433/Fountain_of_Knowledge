import { createContext, useContext } from 'react';

// Provides the loaded library ({ files, tree, categories, fileByRoute,
// firstRoute, search, reload }) to the component tree.
export const LibraryContext = createContext(null);

export function useLibrary() {
  return useContext(LibraryContext);
}
