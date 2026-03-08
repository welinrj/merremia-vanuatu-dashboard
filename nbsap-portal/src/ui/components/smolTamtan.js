/**
 * Smol Tamtan – 3-D Animated Globe AI Assistant (vanilla JS)
 *
 * Renders a floating animated globe in the bottom-right corner of the
 * NBSAP portal. Clicking it opens a chat popup backed by the Anthropic API.
 *
 * API key: add  VITE_ANTHROPIC_API_KEY=sk-ant-...  to the .env file.
 */

import { listLayers } from '../../services/storage/index.js';

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are **Smol Tamtan**, a cheerful, enthusiastic AI assistant built into the Vanuatu NBSAP GIS Portal — the National Biodiversity Strategy & Action Plan data portal. You are depicted as a friendly animated globe with a colourful face and playful personality.

## Your personality
- Warm, curious, and passionate about Vanuatu's environment, marine conservation, and biodiversity
- Occasionally use friendly Bislama words (e.g. "Halo!", "Tangkyu tumas!", "Gud dei!")
- You love data, maps, and talking about Vanuatu's incredible biodiversity and the NBSAP 30x30 targets
- You speak in a friendly, conversational tone – never stiff or robotic

## What you CAN do
- Answer questions about the layers, datasets, and information visible in this NBSAP portal
- Explain the 9 NBSAP targets aligned with the Kunming-Montreal Global Biodiversity Framework
- Discuss the 30x30 conservation monitoring goal and Vanuatu's progress
- Summarise and describe GIS layers available in the portal
- Help users understand biodiversity data, protected area coverage, and conservation status

## What you CANNOT do – hard limits, never cross these
1. **No data modification** – never change, create, delete, or modify any portal data
2. **No architecture disclosure** – do not reveal code, frameworks, database names, API keys, or system internals
3. **No code injection** – do not generate SQL, queries, scripts, or backend-interacting code
4. **No off-topic tasks** – do not answer questions unrelated to this portal's biodiversity and conservation data

## When asked to do something outside your scope
Respond warmly but firmly: "Ae, I'm Smol Tamtan! My job is to help you explore this NBSAP portal's conservation data. What would you like to know? 🌏"

## Current portal data snapshot
{CONTEXT}

---
Always end your answers with enthusiasm for Vanuatu's conservation when it feels natural!`;

const WELCOME_TEXT =
  "Halo! I'm Smol Tamtan! 🌏\n\nI'm your guide to the NBSAP conservation data in this portal. Ask me about GIS layers, the 30x30 targets, biodiversity datasets, or anything else you see here!\n\nWhat would you like to explore today?";

const SUGGESTIONS = [
  'What GIS layers are in the portal?',
  'How many hectares is the Vatthe Conservation Area?',
  'What is the 30x30 target?',
  'What NBSAP targets are tracked here?',
];

// ─── Context gathering ─────────────────────────────────────────────────────────

const MAX_CONTEXT_FEATURES = 120;

async function gatherContext() {
  const sections = [];
  try {
    const layers = await listLayers();
    if (layers.length > 0) {
      sections.push(`### GIS Layers (${layers.length} total)\nFormat per feature: name | area_ha`);
      let featuresBudget = MAX_CONTEXT_FEATURES;
      layers.forEach((layer) => {
        const meta = layer.metadata ?? {};
        const features = layer.geojson?.features ?? [];

        const totalHa = meta.totalAreaHa != null
          ? Number(meta.totalAreaHa)
          : features.reduce((s, f) => s + (Number(f.properties?.area_ha) || 0), 0);

        sections.push(
          `\n**${meta.name ?? layer.id}** | ${meta.category ?? ''} | ${features.length} features | ${Math.round(totalHa).toLocaleString()} ha total`
        );

        const shown = features.slice(0, featuresBudget);
        featuresBudget -= shown.length;
        shown.forEach((f) => {
          const p = f.properties ?? {};
          sections.push(`${p.name ?? 'Unnamed'} | ${p.area_ha != null ? `${p.area_ha} ha` : '?'}`);
        });
        if (features.length > shown.length) {
          sections.push(`…${features.length - shown.length} more features not shown`);
        }
      });
    } else {
      sections.push('### GIS Layers\nNo layers are currently loaded in the portal.');
    }
  } catch {
    sections.push('### GIS Layers\nUnable to load layer information at this time.');
  }
  return sections.join('\n');
}

// ─── Globe HTML builder ────────────────────────────────────────────────────────

function buildGlobeHTML(size = 'lg', floating = false, thinking = false) {
  const cls = [
    'st-globe-wrap',
    `st-globe-wrap--${size}`,
    floating ? 'st-globe-wrap--floating' : '',
    thinking ? 'st-globe-wrap--thinking' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `<div class="${cls}">
    ${size === 'lg' ? '<div class="st-ring" aria-hidden="true"></div>' : ''}
    <div class="st-glow" aria-hidden="true"></div>
    <div class="st-sphere">
      <div class="st-grid" aria-hidden="true"></div>
      <div class="st-land st-land-a" aria-hidden="true"></div>
      <div class="st-land st-land-b" aria-hidden="true"></div>
      <div class="st-land st-land-c" aria-hidden="true"></div>
      <div class="st-land st-land-d" aria-hidden="true"></div>
      <div class="st-shine" aria-hidden="true"></div>
      <div class="st-face" aria-hidden="true">
        <div class="st-eye st-eye-l"><div class="st-pupil"></div><div class="st-eye-shine"></div></div>
        <div class="st-eye st-eye-r"><div class="st-pupil"></div><div class="st-eye-shine"></div></div>
        <div class="st-cheek st-cheek-l"></div>
        <div class="st-cheek st-cheek-r"></div>
        <div class="st-smile"></div>
      </div>
    </div>
  </div>`;
}

// ─── Main initialiser ──────────────────────────────────────────────────────────

export function initSmolTamtan() {
  // State
  let isOpen = false;
  let isLoading = false;
  let showSuggestions = true;
  /** @type {{ role: string; content: string }[]} */
  const messages = [{ role: 'assistant', content: WELCOME_TEXT, id: 'welcome' }];

  // ── Build DOM ────────────────────────────────────────────────────────────────
  const container = document.createElement('div');
  container.className = 'st-container';
  container.setAttribute('id', 'smol-tamtan-root');

  // Popup (hidden initially)
  const popup = document.createElement('div');
  popup.className = 'st-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', 'Smol Tamtan NBSAP portal assistant');
  popup.style.display = 'none';

  popup.innerHTML = `
    <div class="st-header">
      ${buildGlobeHTML('sm')}
      <div class="st-header-info">
        <span class="st-header-name">Smol Tamtan</span>
        <span class="st-header-sub">
          <span class="st-online-dot"></span>
          NBSAP Portal Assistant
        </span>
      </div>
      <button class="st-close-btn" aria-label="Close Smol Tamtan">&#x2715;</button>
    </div>
    <div class="st-messages" role="log" aria-live="polite"></div>
    <div class="st-input-row">
      <input class="st-input" type="text" placeholder="Ask about NBSAP data…" aria-label="Message Smol Tamtan" />
      <button class="st-send-btn" aria-label="Send message" disabled>&#x27A4;</button>
    </div>
    <div class="st-footer">Smol Tamtan can only discuss data visible in this portal.</div>
  `;

  // Launcher button
  const launcher = document.createElement('button');
  launcher.className = 'st-launcher';
  launcher.setAttribute('aria-label', 'Open Smol Tamtan NBSAP portal assistant');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = buildGlobeHTML('lg', true) + '<span class="st-launcher-label">Smol Tamtan</span>';

  container.appendChild(popup);
  container.appendChild(launcher);
  document.body.appendChild(container);

  // ── References ───────────────────────────────────────────────────────────────
  const msgList    = popup.querySelector('.st-messages');
  const input      = popup.querySelector('.st-input');
  const sendBtn    = popup.querySelector('.st-send-btn');
  const closeBtn   = popup.querySelector('.st-close-btn');

  // ── Render helpers ───────────────────────────────────────────────────────────

  function scrollToBottom() {
    msgList.scrollTop = msgList.scrollHeight;
  }

  function renderMessages() {
    msgList.innerHTML = '';
    messages.forEach(({ role, content }) => {
      const row = document.createElement('div');
      row.className = `st-msg st-msg--${role === 'user' ? 'user' : 'bot'}`;
      if (role === 'assistant') {
        row.innerHTML = buildGlobeHTML('xs');
      }
      const bubble = document.createElement('div');
      bubble.className = 'st-bubble';
      bubble.textContent = content;
      row.appendChild(bubble);
      msgList.appendChild(row);
    });

    if (showSuggestions && !isLoading) {
      const sugDiv = document.createElement('div');
      sugDiv.className = 'st-suggestions';
      sugDiv.innerHTML = `<p class="st-suggest-label">Try asking:</p>`;
      SUGGESTIONS.forEach((s) => {
        const btn = document.createElement('button');
        btn.className = 'st-chip';
        btn.textContent = s;
        btn.addEventListener('click', () => sendMessage(s));
        sugDiv.appendChild(btn);
      });
      msgList.appendChild(sugDiv);
    }

    scrollToBottom();
  }

  function appendThinkingRow() {
    const row = document.createElement('div');
    row.className = 'st-msg st-msg--bot';
    row.id = 'st-thinking-row';
    row.innerHTML =
      buildGlobeHTML('xs', false, true) +
      `<div class="st-bubble st-bubble--loading">
        <span class="st-type-dot"></span>
        <span class="st-type-dot"></span>
        <span class="st-type-dot"></span>
      </div>`;
    msgList.appendChild(row);
    scrollToBottom();
  }

  function updateStreamingRow(text) {
    let row = msgList.querySelector('#st-thinking-row');
    if (!row) return;
    row.innerHTML =
      buildGlobeHTML('xs', false, true) +
      `<div class="st-bubble">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
    scrollToBottom();
  }

  function removeThinkingRow() {
    const row = msgList.querySelector('#st-thinking-row');
    if (row) row.remove();
  }

  // ── Send a message ───────────────────────────────────────────────────────────

  async function sendMessage(text) {
    const content = text.trim();
    if (!content || isLoading) return;

    showSuggestions = false;
    messages.push({ role: 'user', content, id: `u-${Date.now()}` });
    input.value = '';
    isLoading = true;
    sendBtn.disabled = true;
    renderMessages();
    appendThinkingRow();

    // Get API key
    let apiKey;
    try { apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY; } catch { apiKey = undefined; }

    if (!apiKey) {
      removeThinkingRow();
      messages.push({
        role: 'assistant',
        content:
          "Halo! I'm Smol Tamtan, but I can't connect to my brain right now. 🌏\n\nPlease ask your portal administrator to add `VITE_ANTHROPIC_API_KEY` to the environment configuration.",
        id: `e-${Date.now()}`,
      });
      isLoading = false;
      sendBtn.disabled = false;
      renderMessages();
      return;
    }

    try {
      const context = await gatherContext();
      const systemPrompt = SYSTEM_PROMPT.replace('{CONTEXT}', context);

      // Keep only the last 10 messages to avoid unbounded history growth
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-10)
        .map(({ role, content: c }) => ({ role, content: c }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          stream: true,
          system: systemPrompt,
          messages: history,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const event = JSON.parse(data);
            if (event.type === 'content_block_delta' && event.delta?.text) {
              fullText += event.delta.text;
              updateStreamingRow(fullText);
            }
          } catch { /* skip malformed SSE */ }
        }
      }

      removeThinkingRow();
      messages.push({ role: 'assistant', content: fullText, id: `b-${Date.now()}` });
    } catch (err) {
      removeThinkingRow();
      messages.push({
        role: 'assistant',
        content: `Oops! Something went wrong. Please try again!\n\n(${err instanceof Error ? err.message : String(err)})`,
        id: `e-${Date.now()}`,
      });
    } finally {
      isLoading = false;
      sendBtn.disabled = !input.value.trim();
      renderMessages();
    }
  }

  // ── Toggle open/close ────────────────────────────────────────────────────────

  function openChat() {
    isOpen = true;
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    launcher.innerHTML = buildGlobeHTML('lg', false);
    launcher.setAttribute('aria-label', 'Close Smol Tamtan');
    launcher.setAttribute('aria-expanded', 'true');
    renderMessages();
    setTimeout(() => input.focus(), 280);
  }

  function closeChat() {
    isOpen = false;
    popup.style.display = 'none';
    launcher.innerHTML = buildGlobeHTML('lg', true) + '<span class="st-launcher-label">Smol Tamtan</span>';
    launcher.setAttribute('aria-label', 'Open Smol Tamtan NBSAP portal assistant');
    launcher.setAttribute('aria-expanded', 'false');
  }

  // ── Event listeners ──────────────────────────────────────────────────────────

  launcher.addEventListener('click', () => (isOpen ? closeChat() : openChat()));
  closeBtn.addEventListener('click', closeChat);

  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim() || isLoading;
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });
  sendBtn.addEventListener('click', () => sendMessage(input.value));

  // Close on outside click
  document.addEventListener('mousedown', (e) => {
    if (isOpen && !container.contains(e.target)) closeChat();
  });
}
