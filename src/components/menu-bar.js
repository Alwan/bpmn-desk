import {LitElement, css, html} from 'lit';

export class MenuBarComponent extends LitElement {
  static properties = {
    openMenu: {state: true},
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      height: 32px;
      background-color: #f0f0f0;
      border-bottom: 1px solid #ccc;
      user-select: none;
    }

    .menu-item {
      position: relative;
    }

    .menu-button {
      background: none;
      border: none;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      height: 32px;
      color: #333;
    }

    .menu-button:hover,
    .menu-button:focus {
      background-color: #e0e0e0;
    }

    .menu-dropdown {
      display: none;
      position: absolute;
      top: 32px;
      left: 0;
      min-width: 160px;
      background-color: #fff;
      border: 1px solid #ccc;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      padding: 4px 0;
    }

    .menu-dropdown button {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      padding: 6px 16px;
      font-size: 13px;
      cursor: pointer;
      color: #333;
    }

    .menu-dropdown button:hover {
      background-color: #e8e8e8;
    }

    .menu-dropdown hr {
      margin: 4px 0;
      border: none;
      border-top: 1px solid #ddd;
    }

    .menu-item.open .menu-dropdown {
      display: block;
    }

    input[type="file"] {
      display: none;
    }
  `;

  #onDocumentClick = (event) => {
    if (!event.composedPath().includes(this)) {
      this.openMenu = '';
    }
  };

  constructor() {
    super();
    this.openMenu = '';
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.#onDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.#onDocumentClick);
    super.disconnectedCallback();
  }

  get fileInput() {
    return this.renderRoot?.querySelector('#file-input');
  }

  render() {
    return html`
      <input
        id="file-input"
        type="file"
        accept=".bpmn,.bpmn2,.xml"
        @change=${this.#onFileInputChange}
      >
      <div class="menu-item ${this.openMenu === 'file' ? 'open' : ''}">
        <button class="menu-button" @click=${(event) => this.toggleMenu(event, 'file')}>File</button>
        <div class="menu-dropdown">
          <button @click=${(event) => this.emitAction(event, 'open-file')}>Open File</button>
          <button @click=${(event) => this.emitAction(event, 'save-file')}>Save</button>
          <hr>
          <button @click=${(event) => this.emitAction(event, 'quit-app')}>Quit</button>
        </div>
      </div>
      <div class="menu-item ${this.openMenu === 'help' ? 'open' : ''}">
        <button class="menu-button" @click=${(event) => this.toggleMenu(event, 'help')}>Help</button>
        <div class="menu-dropdown">
          <button @click=${(event) => this.emitAction(event, 'show-about')}>About</button>
        </div>
      </div>
    `;
  }

  toggleMenu(event, menuName) {
    event.stopPropagation();
    this.openMenu = this.openMenu === menuName ? '' : menuName;
  }

  emitAction(event, actionName) {
    event.stopPropagation();
    this.openMenu = '';
    if (actionName === 'open-file') {
      this.fileInput?.click();
      return;
    }
    this.dispatchEvent(new CustomEvent(actionName, {bubbles: true, composed: true}));



  }

  #onFileInputChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      this.dispatchEvent(new CustomEvent('open-file', {
        bubbles: true,
        composed: true,
        detail: {file},
      }));
    }
    event.target.value = '';
  }
}

customElements.define('app-menubar', MenuBarComponent);
