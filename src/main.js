import './components/bpmn-editor.js';
import './components/menu-bar.js';

const editorElement = document.getElementById('bpmn-editor');
const menubarElement = document.getElementById('menubar');

menubarElement?.addEventListener('open-file', async () => {
  try {
    const filePath = await window.krema.invoke('dialog:openFile', {
      title: 'Open BPMN File',
      filters: [{name: 'BPMN Files', extensions: ['bpmn', 'bpmn2', 'xml']}],
    });

    if (filePath) {
      await editorElement.openFile(filePath);
    }
  } catch (error) {
    console.error('Failed to open file:', error);
  }
});

menubarElement?.addEventListener('quit-app', () => {
  window.krema.invoke('quit');
});

menubarElement?.addEventListener('show-about', () => {
  alert('Bpmn Desk v0.1.0\\nA BPMN editor desktop application.');
});
