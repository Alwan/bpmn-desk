import './components/bpmn-editor.js';
import './components/menu-bar.js';

const editorElement = document.getElementById('bpmn-editor');
const menubarElement = document.getElementById('menubar');

let currentFilePath = null;
let currentFileHandle = null;

const filePickerTypes = [
  {
    description: 'BPMN Files',
    accept: {
      'application/xml': ['.bpmn', '.bpmn2', '.xml'],
      'text/xml': ['.bpmn', '.bpmn2', '.xml'],
    },
  },
];

menubarElement?.addEventListener('open-file', async (event) => {
  try {
    const file = event.detail?.file;
    if (file) {
      const content = await file.text();
      await editorElement.setContent(content);
      currentFileHandle = null;
      currentFilePath = file.name;

    }
  } catch (error) {
    console.error('Failed to open file:', error);
  }
});

menubarElement?.addEventListener('save-file', async () => {
  try {
    if ('showSaveFilePicker' in window) {
      const targetHandle = currentFileHandle ?? await window.showSaveFilePicker({
        suggestedName: currentFilePath ?? 'diagram.bpmn',
        types: filePickerTypes,
        excludeAcceptAllOption: false,
      });

      const writable = await targetHandle.createWritable();
      const content = await editorElement.getContent();
      await writable.write(content);
      await writable.close();

      currentFileHandle = targetHandle;
      currentFilePath = targetHandle.name ?? currentFilePath ?? 'diagram.bpmn';
      return;
    }

    const targetPath = currentFilePath || await window.krema.invoke('saveFile', {
      title: 'Save BPMN File',
      filters: [{name: 'BPMN Files', extensions: ['bpmn', 'bpmn2', 'xml']}],
      defaultPath: currentFilePath ?? undefined,
    });

    if (targetPath) {
      await editorElement.saveFile(targetPath);
      currentFileHandle = null;
      currentFilePath = targetPath;
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      return;
    }
    console.error('Failed to save file:', error);
  }
});

menubarElement?.addEventListener('quit-app', () => {
  window.krema.invoke('quit');
});

menubarElement?.addEventListener('show-about', () => {
  alert('Bpmn Desk v0.1.0\\nA BPMN editor desktop application.');
});
