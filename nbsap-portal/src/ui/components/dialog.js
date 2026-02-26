/**
 * Custom modal dialogs to replace native alert/confirm/prompt.
 * Avoids the browser showing the domain ("welinrj.github.io says").
 */

const BACKDROP_STYLE = `
  position:fixed;inset:0;z-index:99999;
  display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);
  animation:nbsapDialogFadeIn 0.15s ease-out;
`;
const DIALOG_STYLE = `
  background:#fff;border-radius:12px;padding:24px;
  min-width:320px;max-width:460px;width:90%;
  box-shadow:0 20px 60px rgba(0,0,0,0.25);
  font-family:var(--font, system-ui, sans-serif);
  animation:nbsapDialogSlideIn 0.2s ease-out;
`;
const TITLE_STYLE = `
  margin:0 0 8px;font-size:16px;font-weight:700;
  color:var(--text, #1A202C);
`;
const MSG_STYLE = `
  margin:0 0 20px;font-size:14px;line-height:1.5;
  color:var(--text-secondary, #616E7C);white-space:pre-line;
`;
const BTN_BASE = `
  padding:10px 20px;border-radius:8px;font-size:14px;
  font-weight:600;cursor:pointer;border:none;
  transition:all 0.15s;
`;
const BTN_PRIMARY = `${BTN_BASE}
  background:var(--primary, #006B3F);color:#fff;
`;
const BTN_SECONDARY = `${BTN_BASE}
  background:var(--gray-100, #F1F3F5);color:var(--text, #1A202C);
`;
const BTN_DANGER = `${BTN_BASE}
  background:var(--danger, #D32F2F);color:#fff;
`;
const INPUT_STYLE = `
  width:100%;padding:10px 12px;border:2px solid var(--border, #E4E7EB);
  border-radius:8px;font-size:14px;margin-bottom:20px;
  font-family:inherit;box-sizing:border-box;
  outline:none;transition:border-color 0.15s;
`;

// Inject keyframes once
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes nbsapDialogFadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes nbsapDialogSlideIn { from { transform:translateY(-10px);opacity:0 } to { transform:translateY(0);opacity:1 } }
  `;
  document.head.appendChild(style);
}

function createBackdrop() {
  injectStyles();
  const el = document.createElement('div');
  el.style.cssText = BACKDROP_STYLE;
  return el;
}

/**
 * Show an alert dialog (replaces window.alert).
 * @param {string} message
 * @param {object} [opts]
 * @param {string} [opts.title='Notice']
 * @returns {Promise<void>}
 */
export function showAlert(message, opts = {}) {
  const title = opts.title || 'Notice';
  return new Promise(resolve => {
    const backdrop = createBackdrop();
    backdrop.innerHTML = `
      <div style="${DIALOG_STYLE}">
        <h3 style="${TITLE_STYLE}">${title}</h3>
        <p style="${MSG_STYLE}">${escapeHtml(message)}</p>
        <div style="display:flex;justify-content:flex-end">
          <button data-action="ok" style="${BTN_PRIMARY}">OK</button>
        </div>
      </div>
    `;
    backdrop.querySelector('[data-action="ok"]').addEventListener('click', () => {
      backdrop.remove();
      resolve();
    });
    document.body.appendChild(backdrop);
    backdrop.querySelector('[data-action="ok"]').focus();
  });
}

/**
 * Show a confirm dialog (replaces window.confirm).
 * @param {string} message
 * @param {object} [opts]
 * @param {string} [opts.title='Confirm']
 * @param {string} [opts.okLabel='OK']
 * @param {string} [opts.cancelLabel='Cancel']
 * @param {boolean} [opts.danger=false]
 * @returns {Promise<boolean>}
 */
export function showConfirm(message, opts = {}) {
  const title = opts.title || 'Confirm';
  const okLabel = opts.okLabel || 'OK';
  const cancelLabel = opts.cancelLabel || 'Cancel';
  const okStyle = opts.danger ? BTN_DANGER : BTN_PRIMARY;

  return new Promise(resolve => {
    const backdrop = createBackdrop();
    backdrop.innerHTML = `
      <div style="${DIALOG_STYLE}">
        <h3 style="${TITLE_STYLE}">${title}</h3>
        <p style="${MSG_STYLE}">${escapeHtml(message)}</p>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button data-action="cancel" style="${BTN_SECONDARY}">${cancelLabel}</button>
          <button data-action="ok" style="${okStyle}">${okLabel}</button>
        </div>
      </div>
    `;
    backdrop.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      backdrop.remove();
      resolve(false);
    });
    backdrop.querySelector('[data-action="ok"]').addEventListener('click', () => {
      backdrop.remove();
      resolve(true);
    });
    document.body.appendChild(backdrop);
    backdrop.querySelector('[data-action="ok"]').focus();
  });
}

/**
 * Show a prompt dialog (replaces window.prompt).
 * @param {string} message
 * @param {string} [defaultValue='']
 * @param {object} [opts]
 * @param {string} [opts.title='Input']
 * @returns {Promise<string|null>} - null if cancelled
 */
export function showPrompt(message, defaultValue = '', opts = {}) {
  const title = opts.title || 'Input';

  return new Promise(resolve => {
    const backdrop = createBackdrop();
    backdrop.innerHTML = `
      <div style="${DIALOG_STYLE}">
        <h3 style="${TITLE_STYLE}">${title}</h3>
        <p style="${MSG_STYLE}">${escapeHtml(message)}</p>
        <input type="text" data-input style="${INPUT_STYLE}" value="${escapeAttr(defaultValue)}">
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button data-action="cancel" style="${BTN_SECONDARY}">Cancel</button>
          <button data-action="ok" style="${BTN_PRIMARY}">OK</button>
        </div>
      </div>
    `;
    const input = backdrop.querySelector('[data-input]');
    input.addEventListener('focus', () => { input.style.borderColor = 'var(--primary, #006B3F)'; });
    input.addEventListener('blur', () => { input.style.borderColor = 'var(--border, #E4E7EB)'; });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { backdrop.querySelector('[data-action="ok"]').click(); }
      if (e.key === 'Escape') { backdrop.querySelector('[data-action="cancel"]').click(); }
    });
    backdrop.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      backdrop.remove();
      resolve(null);
    });
    backdrop.querySelector('[data-action="ok"]').addEventListener('click', () => {
      backdrop.remove();
      resolve(input.value);
    });
    document.body.appendChild(backdrop);
    input.focus();
    input.select();
  });
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
