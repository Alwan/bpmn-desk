const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");

let mainWindow;
let currentFile = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "bpmn-desk",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

  mainWindow.on("close", (e) => {
    if (mainWindow.isDirty) {
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: "warning",
        buttons: ["Save", "Discard", "Cancel"],
        title: "Unsaved changes",
        message: "The diagram has unsaved changes. Save before closing?",
      });
      if (choice === 0) {
        e.preventDefault();
        mainWindow.webContents.send("menu-save");
      } else if (choice === 2) {
        e.preventDefault();
      }
    }
  });

  buildMenu();
}

function buildMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        { label: "New", accelerator: "CmdOrCtrl+N", click: () => mainWindow.webContents.send("menu-new") },
        { label: "Open…", accelerator: "CmdOrCtrl+O", click: () => mainWindow.webContents.send("menu-open") },
        { label: "Save", accelerator: "CmdOrCtrl+S", click: () => mainWindow.webContents.send("menu-save") },
        { label: "Save As…", accelerator: "CmdOrCtrl+Shift+S", click: () => mainWindow.webContents.send("menu-save-as") },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [{ role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" }],
    },
    {
      label: "View",
      submenu: [{ role: "reload" }, { role: "toggleDevTools" }, { type: "separator" }, { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" }, { type: "separator" }, { role: "togglefullscreen" }],
    },
  ]);
  Menu.setApplicationMenu(menu);
}

// --- IPC ---

ipcMain.handle("dialog-open", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: "Open BPMN file",
    filters: [
      { name: "BPMN diagrams", extensions: ["bpmn", "bpmn2", "xml"] },
      { name: "All files", extensions: ["*"] },
    ],
    properties: ["openFile"],
  });
  if (canceled || !filePaths[0]) return null;
  const content = await fs.readFile(filePaths[0], "utf8");
  currentFile = filePaths[0];
  return { path: currentFile, content };
});

ipcMain.handle("dialog-save", async (_e, { content, saveAs }) => {
  let target = currentFile;
  if (saveAs || !target) {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Save BPMN file",
      defaultPath: target || "model.bpmn",
      filters: [{ name: "BPMN diagrams", extensions: ["bpmn"] }],
    });
    if (canceled || !filePath) return null;
    target = filePath;
  }
  await fs.writeFile(target, content, "utf8");
  currentFile = target;
  return { path: target };
});

ipcMain.handle("set-dirty", (_e, dirty) => {
  mainWindow.isDirty = dirty;
  mainWindow.setTitle(`${dirty ? "● " : ""}bpmn-desk${currentFile ? ` — ${path.basename(currentFile)}` : ""}`);
});

ipcMain.handle("get-current-file", () => currentFile);

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
