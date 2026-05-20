(function () {
  if (!window.CONFIG) {
    console.error("CONFIG não encontrado. Carregue config.js antes.");
    return;
  }

  const CONFIG = window.CONFIG;

  // -----------------------------
  // 1) Texto/atributos (data-config)
  // -----------------------------
  if (CONFIG.titulo) document.title = String(CONFIG.titulo);

  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.getAttribute("data-config");
    const value = CONFIG[key];
    if (value === undefined || value === null) return;

    const attr = el.getAttribute("data-config-attr");
    if (attr) el.setAttribute(attr, String(value));
    else el.textContent = String(value);
  });

  // -----------------------------
  // 2) Links prontos
  // -----------------------------
  const wppLink = buildWhatsAppLink(CONFIG.telefone, CONFIG.mensagemWhatsApp);
  setHref('[data-link="whatsapp"]', wppLink);
  setHref('[data-link="mapa"]', CONFIG.linkMapa);

  // -----------------------------
  // 3) Render do menu via CONFIG.botoes
  // -----------------------------
  renderMenuButtons();
  applyMenuButtonsVerticalPosition();
  wireModalButtons();

  // -----------------------------
  // 3.5) Estilo do botão de fechar (X) via CONFIG.closeButton
  // -----------------------------
  applyCloseButtonTheme();

  // -----------------------------
  // 3.6) Modais extras pré-configurados
  // -----------------------------
  setupExtraModals();

  // -----------------------------
  // 4) PIX configurável
  // -----------------------------
  setupPix();

  // ============ Helpers ============

  function setHref(selector, href) {
    if (!href) return;
    document.querySelectorAll(selector).forEach((a) => a.setAttribute("href", href));
  }

  function buildWhatsAppLink(phone, message) {
    if (!phone) return "#";
    const normalized = normalizePhoneToE164BR(phone);
    const encoded = encodeURIComponent(message || "");
    return `https://wa.me/${normalized}?text=${encoded}`;
  }

  function normalizePhoneToE164BR(phoneRaw) {
    const digits = String(phoneRaw).replace(/\D/g, "");
    if (digits.startsWith("55") && digits.length >= 12) return digits;
    return "55" + digits;
  }

  function renderMenuButtons() {
    const list = document.getElementById("menuButtons");
    if (!list) return;

    const botoes = Array.isArray(CONFIG.botoes) ? CONFIG.botoes : [];
    list.innerHTML = "";

    botoes.forEach((btn) => {
      if (btn && btn.enabled === false) return;

      const li = document.createElement("li");
      const a = document.createElement("a");

      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");

      if (btn.tipo === "whatsapp") {
        a.href = buildWhatsAppLink(CONFIG.telefone, CONFIG.mensagemWhatsApp);
      } else if (btn.tipo === "mapa") {
        a.href = String(CONFIG.linkMapa || "#");
      } else if (btn.tipo === "modal") {
        a.href = "#";
        a.classList.add("anime");
        if (btn.modal) a.setAttribute("data-target", String(btn.modal));
        a.removeAttribute("target");
        a.removeAttribute("rel");
      } else if (btn.href) {
        a.href = String(btn.href);
      } else {
        a.href = "#";
      }

      if (btn.icon) {
        const img = document.createElement("img");
        img.src = String(btn.icon);
        img.className = "icons";
        a.appendChild(img);
      }

      const p = document.createElement("p");
      p.className = "frase font-2-m";
      const linhas = Array.isArray(btn.linhas) ? btn.linhas : [];
      p.innerHTML = linhas.map(escapeHtml).join("<br>");
      a.appendChild(p);

      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function applyMenuButtonsVerticalPosition() {
    const list = document.getElementById("menuButtons");
    if (!list) return;
    const v = CONFIG.menuButtonsBottom;
    if (v === undefined || v === null || v === "") return;
    const value = (typeof v === "number") ? `${v}px` : String(v);
    list.style.bottom = value;
  }

  function wireModalButtons() {
    document.querySelectorAll("a.anime[data-target]").forEach((a) => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        const target = a.getAttribute("data-target");
        const modal = document.getElementById(`modal-${target}`);
        if (modal) modal.style.display = "block";
      });
    });
  }

  function setupPix() {
    const area = document.getElementById("pixArea");
    const btn = document.getElementById("pixButton");
    const msg = document.getElementById("pixMessage");

    const pixCfg = CONFIG.pix || {};
    const enabled = pixCfg.enabled !== false;

    if (area) area.style.display = enabled ? "block" : "none";
    if (!enabled) return;

    if (btn && pixCfg.icon) {
      const img = btn.querySelector("img");
      if (img) img.src = String(pixCfg.icon);
    }

    if (msg) msg.textContent = String(pixCfg.toast || "✅ PIX copiado");

    if (!btn) return;
    btn.addEventListener("click", () => {
      const chave = String(CONFIG.chavePix || "");
      if (!chave) return;

      navigator.clipboard
        .writeText(chave)
        .then(() => {
          const img = btn.querySelector("img");
          if (img) {
            img.style.transform = "scale(1.3)";
            setTimeout(() => (img.style.transform = "scale(1)"), 300);
          }
          if (msg) {
            msg.classList.add("show");
            setTimeout(() => msg.classList.remove("show"), 2000);
          }
        })
        .catch((e) => console.warn("Não consegui copiar o PIX:", e));
    });
  }

  function applyCloseButtonTheme() {
    const theme = CONFIG.closeButton || {};
    const root = document.documentElement;
    if (theme.bg)          root.style.setProperty("--close-bg",           String(theme.bg));
    if (theme.border)      root.style.setProperty("--close-border",       String(theme.border));
    if (theme.color)       root.style.setProperty("--close-color",        String(theme.color));
    if (theme.shadow)      root.style.setProperty("--close-shadow",       String(theme.shadow));
    if (theme.hoverBg)     root.style.setProperty("--close-hover-bg",     String(theme.hoverBg));
    if (theme.hoverColor)  root.style.setProperty("--close-hover-color",  String(theme.hoverColor));
    if (theme.hoverShadow) root.style.setProperty("--close-hover-shadow", String(theme.hoverShadow));
  }

  function setupExtraModals() {
    const extras = (CONFIG.modaisExtras && Array.isArray(CONFIG.modaisExtras))
      ? CONFIG.modaisExtras : [];

    extras.forEach((m) => {
      if (!m || !m.id) return;
      if (m.enabled === false) return;

      const modal = document.getElementById(`modal-${m.id}`);
      if (!modal) return;

      if (m.backgroundImage) {
        modal.style.backgroundImage    = `url('${String(m.backgroundImage)}')`;
        modal.style.backgroundRepeat   = "no-repeat";
        modal.style.backgroundPosition = "center center";
        modal.style.backgroundSize     = "cover";
        modal.style.backgroundAttachment = "fixed";
      }
      if (m.backgroundColor) {
        modal.style.backgroundColor = String(m.backgroundColor);
      }
      if (m.html) {
        let content = modal.querySelector(".modal-content");
        if (!content) {
          content = document.createElement("div");
          content.className = "modal-content";
          modal.appendChild(content);
        }
        content.innerHTML = String(m.html);
      }
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g,  "&#039;");
  }

  // -----------------------------
  // Contagem regressiva (topo)
  // -----------------------------
  initCountdown();

  function initCountdown() {
    const cdCfg = CONFIG.countdown;
    const bar = document.getElementById("countdownBar");
    if (!bar) return;

    if (!cdCfg || cdCfg.enabled === false) {
      bar.style.display = "none";
      return;
    }

    const st = cdCfg.style || {};
    if (st.height     !== undefined) document.documentElement.style.setProperty("--countdown-height",   st.height + "px");
    if (st.background)               document.documentElement.style.setProperty("--countdown-bg",       st.background);
    if (st.textColor)                document.documentElement.style.setProperty("--countdown-text",     st.textColor);
    if (st.fontFamily)               document.documentElement.style.setProperty("--countdown-font",     st.fontFamily);
    if (st.numberSize !== undefined) document.documentElement.style.setProperty("--countdown-num-size", st.numberSize + "px");
    if (st.labelSize  !== undefined) document.documentElement.style.setProperty("--countdown-lab-size", st.labelSize + "px");
    if (st.gap        !== undefined) document.documentElement.style.setProperty("--countdown-gap",      st.gap + "px");

    const pad = (cdCfg.topPadding !== undefined) ? cdCfg.topPadding : 0;
    document.documentElement.style.setProperty("--countdown-pad-top", (typeof pad === "number" ? pad + "px" : String(pad)));

    const dtStr = cdCfg.datetime;
    if (!dtStr) { bar.style.display = "none"; return; }
    const target = new Date(dtStr);

    const els = {
      days:    bar.querySelector('[data-cd="days"]'),
      hours:   bar.querySelector('[data-cd="hours"]'),
      minutes: bar.querySelector('[data-cd="minutes"]'),
      seconds: bar.querySelector('[data-cd="seconds"]'),
    };

    const pad2 = (n) => String(n).padStart(2, "0");

    function tick() {
      const now = new Date();
      let diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        if (cdCfg.showWhenPassed) diff = Math.abs(diff);
        else { bar.style.display = "none"; clearInterval(timer); return; }
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days    = Math.floor(totalSeconds / 86400);
      const hours   = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (els.days)    els.days.textContent    = String(days);
      if (els.hours)   els.hours.textContent   = pad2(hours);
      if (els.minutes) els.minutes.textContent = pad2(minutes);
      if (els.seconds) els.seconds.textContent = pad2(seconds);

      bar.style.display = "flex";
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

})();
