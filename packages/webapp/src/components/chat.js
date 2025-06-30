import { LitElement, html } from 'lit';
// import { loadMessages, saveMessages, clearMessages } from '../utils/chatStore.js';
import './chat.css'; // Import the CSS file

// add isRetrieving and ragEnabled properties to the class & initialize them in the constructor
export class ChatInterface extends LitElement {
  static get properties() {
    return {
      messages: { type: Array },
      inputMessage: { type: String },
      isLoading: { type: Boolean },
      isRetrieving: { type: Boolean },
      ragEnabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.messages = [];
    this.inputMessage = '';
    this.isLoading = false;
    this.isRetrieving = false;
    this.ragEnabled = true; // Enable by default
  }
  // --------------------------------------------------------------------

  // replace the render method with the following code
  render() {
    return html`
    <div class="chat-container">
      <div class="chat-header">
        <button class="clear-cache-btn" @click=${this._clearCache}> 🧹Clear Chat</button>
        <label class="rag-toggle">
          <input type="checkbox" ?checked=${this.ragEnabled} @change=${this._toggleRag}>
          Use Employee Handbook
        </label>
      </div>
      <div class="chat-messages">
        ${this.messages.map(message => html`
          <div class="message ${message.role === 'user' ? 'user-message' : 'ai-message'}">
            <div class="message-content">
              <span class="message-sender">${message.role === 'user' ? 'You' : 'AI'}</span>
              <p>${message.content}</p>
              ${this.ragEnabled && message.sources && message.sources.length > 0 ? html`
                <details class="sources">
                  <summary>📚 Sources</summary>
                  <div class="sources-content">
                    ${message.sources.map(source => html`<p>${source}</p>`)}
                  </div>
                </details>
              ` : ''}
            </div>
          </div>
        `)}
        ${this.isRetrieving ? html`
          <div class="message system-message">
            <p>📚 Searching employee handbook...</p>
          </div>
        ` : ''}
        ${this.isLoading && !this.isRetrieving ? html`
          <div class="message ai-message">
            <div class="message-content">
              <span class="message-sender">AI</span>
              <p>Thinking...</p>
            </div>
          </div>
        ` : ''}
      </div>
      <div class="chat-input">
        <input 
          type="text" 
          placeholder="Ask about company policies, benefits, etc..." 
          .value=${this.inputMessage}
          @input=${this._handleInput}
          @keyup=${this._handleKeyUp}
        />
        <button @click=${this._sendMessage} ?disabled=${this.isLoading || !this.inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  `;
  }
  // ---------------------------------------------------------------------------

  // add method to handle the toggle change
  _toggleRag(e) {
    this.ragEnabled = e.target.checked;
  }
  // ---------------------------------------------------------------------------

  // after the _sendMessage method, update the API call to include the ragEnabled property
  async _apiCall(message) {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        useRAG: this.ragEnabled
      }),
    });
    const data = await res.json();
    return data;
  }
}


customElements.define('chat-interface', ChatInterface);