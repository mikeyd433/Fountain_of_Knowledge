const { contextBridge, ipcRenderer } = require('electron');

// Safe, minimal bridge between the renderer (React app) and the main process.
contextBridge.exposeInMainWorld('fokAPI', {
  isDesktop: true,
  listContent: () => ipcRenderer.invoke('content:list'),
  importFiles: (files) => ipcRenderer.invoke('content:import', files),
  revealContentFolder: () => ipcRenderer.invoke('content:reveal'),
});
