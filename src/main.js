import './components/bpmn-editor.js';

const editorElement = document.getElementById('bpmn-editor');

// Menubar logic
document.querySelectorAll('.menu-item').forEach((item) => {
  const button = item.querySelector('.menu-button');

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = item.classList.contains('open');
    closeAllMenus();
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

document.addEventListener('click', () => {
  closeAllMenus();
});

function closeAllMenus() {
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.classList.remove('open');
  });
}

// File > Open File
document.getElementById('menu-open-file').addEventListener('click', async () => {
  closeAllMenus();
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

// File > Quit
document.getElementById('menu-quit').addEventListener('click', () => {
  closeAllMenus();
  window.krema.invoke('quit');
});

// Help > About
document.getElementById('menu-about').addEventListener('click', () => {
  closeAllMenus();
  alert('Bpmn Desk v0.1.0\\nA BPMN editor desktop application.');
});
