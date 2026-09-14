import * as ApacheKieBpmnEditor from "@kie-tools/bpmn-editor-standalone/dist";

let editor = null;
let currentPath = "model.bpmn";
let dirty = false;

function setDirty(value) {
  dirty = value;
  if (window.bpmnDesk) window.bpmnDesk.setDirty(value);
}

function mount(initialContent, filePath) {
  currentPath = filePath || "model.bpmn";
  const container = document.getElementById("apache-kie-bpmn-editor-container");
  container.innerHTML = "";

  editor = ApacheKieBpmnEditor.open({
    container,
    initialContent: Promise.resolve(initialContent ?? ""),
    initialFileNormalizedPosixPathRelativeToTheWorkspaceRoot: currentPath,
    readOnly: false,
    onError: (err) => {
      console.error("Failed to open BPMN editor:", err);
      alert(`Failed to open BPMN editor: ${err?.message ?? err}`);
    },
  });

  if (editor.subscribeToContentChanges) {
    editor.subscribeToContentChanges({
      setEditorReady() {},
      setContentChanged() {
        if (!dirty) setDirty(true);
      },
      setEditorUndoStackEmpty() {},
    });
  }
}

async function doSave(saveAs) {
  if (!editor || !window.bpmnDesk) return;
  try {
    const content = await editor.getContent();
    const result = await window.bpmnDesk.saveFile(content ?? "", saveAs);
    if (result) setDirty(false);
  } catch (err) {
    console.error("Save failed:", err);
  }
}

async function doOpen() {
  if (!window.bpmnDesk) return;
  const file = await window.bpmnDesk.openFileDialog();
  if (!file) return;
  const name = file.path.split("/").pop();
  mount(file.content, name || "model.bpmn");
  setDirty(false);
}

function doNew() {
  mount("", "model.bpmn");
  setDirty(false);
}

if (window.bpmnDesk) {
  window.bpmnDesk.onMenu("menu-new", doNew);
  window.bpmnDesk.onMenu("menu-open", doOpen);
  window.bpmnDesk.onMenu("menu-save", () => doSave(false));
  window.bpmnDesk.onMenu("menu-save-as", () => doSave(true));
}

// Start with an empty diagram
mount("", "model.bpmn");
setDirty(false);
