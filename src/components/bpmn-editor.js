import {LitElement, css, html} from 'lit';

export class BpmnEditorComponent extends LitElement {
  static properties = {
    readOnly: {type: Boolean, reflect: true},
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    #editor-container {
      width: 100%;
      height: 100%;
    }
  `;

  #editorInstance = null;

  constructor() {
    super();
    this.readOnly = false;
  }

  render() {
    return html`<div id="editor-container"></div>`;
  }

  async firstUpdated() {
    await this.initialize();
  }

  async initialize(initialContent) {
    const container = this.renderRoot?.getElementById('editor-container');
    if (!container || !window.BpmnEditor) {
      return;
    }

    const content = initialContent ?? (await this.getInitialContent()).content;
    this.#editorInstance = window.BpmnEditor.open({
      container,
      initialContent: Promise.resolve(content ?? ''),
      readOnly: this.readOnly,
    });
  }

  async getInitialContent() {
    try {
      return await window.krema.invoke('createTempFile');
    } catch (error) {
      console.error('Failed to create initial BPMN content:', error);
      return '';
    }
  }

  async loadContent(content) {
    await this.updateComplete;
    await this.initialize(content);
    return this.#editorInstance;
  }

  async openFile(path) {
    const fileContent = await window.krema.invoke('readFile', {path});
    return this.loadContent(fileContent);
  }

  async saveFile(path) {
    const content = await this.#editorInstance.getContent();
    await window.krema.invoke('saveFile', {path, content});
  }
}

customElements.define('bpmn-editor', BpmnEditorComponent);
