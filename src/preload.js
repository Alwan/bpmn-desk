const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bpmnDesk", {
  openFileDialog: () => ipcRenderer.invoke("dialog-open"),
  saveFile: (content, saveAs = false) => ipcRenderer.invoke("dialog-save", { content, saveAs }),
  setDirty: (dirty) => ipcRenderer.invoke("set-dirty", dirty),
  getCurrentFile: () => ipcRenderer.invoke("get-current-file"),
  onMenu: (channel, cb) => {
    const allowed = ["menu-new", "menu-open", "menu-save", "menu-save-as"];
    if (allowed.includes(channel)) {
      ipcRenderer.on(channel, (_e, ...args) => cb(...args));
    }
  },
});
