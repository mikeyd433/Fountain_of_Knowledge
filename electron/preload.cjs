const { contextBridge, ipcRenderer } = require('electron');

// Safe, minimal bridge between the renderer (React app) and the main process.
contextBridge.exposeInMainWorld('fokAPI', {
  isDesktop: true,
  listContent: () => ipcRenderer.invoke('content:list'),
  importFiles: (files) => ipcRenderer.invoke('content:import', files),
  syncLibrary: (body) => ipcRenderer.invoke('content:sync', body),
  deleteFiles: (paths) => ipcRenderer.invoke('content:delete', paths),
  exportFile: (name, content) => ipcRenderer.invoke('content:export', { name, content }),
  revealContentFolder: () => ipcRenderer.invoke('content:reveal'),
});
