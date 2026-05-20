// config.js
// Edite apenas este arquivo para atualizar as infos do convite.
window.CONFIG = {
  nome: "Seu Nome",
  titulo: "Festa de 15 Anos",
  idade: "15",

  // ===== CONTAGEM REGRESSIVA =====
  countdown: {
    enabled: true,
    datetime: "2026-09-19T20:00", // ⚠️ MUDE AQUI (YYYY-MM-DDTHH:MM)
    showWhenPassed: false,
    topPadding: 0,
    style: {
      height: 70,
      background: "rgba(196, 196, 196, 0.45)",
      textColor: "#ffffff",
      fontFamily: "inherit",
      numberSize: 20,
      labelSize: 10,
      gap: 10
    }
  },

  // Posição vertical do menu de botões (número vira px, ou use string "5px", "10%")
  menuButtonsBottom: 5,

  // ===== CONTATOS =====
  // ⚠️ Coloque o número com DDD, sem +55 (ex: "11999999999")
  telefone: "",
  mensagemWhatsApp: "Olá! Confirmo minha presença na festa de 15 anos! 🎉",
  linkMapa: "https://www.google.com/maps/search/Chacara+dos+Bancarios",

  // ===== PIX =====
  chavePix: "",
  pix: {
    enabled: false,
    toast: "✅ PIX copiado",
    icon: "img/pix.svg"
  },

  // ===== BOTÃO FECHAR (X) DOS MODAIS =====
  closeButton: {
    bg: "#ffffff52",
    border: "2px solid rgb(255, 255, 255)",
    color: "rgb(255, 255, 255)",
    shadow: "0 0 10px rgba(255, 255, 255, 0.253)",
    hoverBg: "rgba(255, 255, 255, 0.267)",
    hoverColor: "rgb(255, 255, 255)",
    hoverShadow: "0 0 15px rgba(255, 255, 255, 0.205)"
  },

  // ===== BOTÕES DO MENU =====
  // tipos: "whatsapp" | "mapa" | "modal" | (ou coloque href para link direto)
  // enabled: false = oculta o botão
  botoes: [
    // Confirme presença via WhatsApp
    {
      enabled: false,
      tipo: "whatsapp",
      icon: "img/confirmar.svg",
      linhas: ["Confirme", "presença"]
    },
    // Confirme presença via formulário (Forms/site)
    {
      enabled: true,
      icon: "img/confirmar.svg",
      linhas: ["Confirme", "presença"],
      href: "https://wa.me/5511999999999?text=Ol%C3%A1%21+Confirmo+minha+presen%C3%A7a+na+festa+de+15+anos%21+%F0%9F%8E%89"
      // ⚠️ Troque pelo link do seu formulário ou WhatsApp
    },

    // Ver rota
    {
      enabled: true,
      tipo: "mapa",
      icon: "img/local.svg",
      linhas: ["Ver", "rota"]
    },

    // Dress code (abre modal-vestimenta)
    {
      enabled: true,
      tipo: "modal",
      modal: "vestimenta",
      icon: "img/traje.svg",
      linhas: ["Dress", "code"]
    },

    // Lista de presentes (abre modal-presentes ou link externo)
    {
      enabled: false,
      tipo: "modal",
      modal: "presentes",
      icon: "img/presentes.svg",
      linhas: ["Lista de", "presentes"]
    },
    {
      enabled: true,
      icon: "img/presentes.svg",
      linhas: ["Lista de", "presentes"],
      href: "https://google.com"
      // ⚠️ Troque pelo link da lista de presentes
    },

    // Botões extras (desativados por padrão)
    {
      enabled: false,
      tipo: "modal",
      modal: "extra1",
      icon: "img/informativo.svg",
      linhas: ["Modal", "extra 1"]
    },
    {
      enabled: false,
      tipo: "modal",
      modal: "extra2",
      icon: "img/extra.svg",
      linhas: ["Modal", "extra 2"]
    }
  ],

  // ===== MODAIS EXTRAS =====
  modaisExtras: [
    {
      id: "extra1",
      enabled: false,
      backgroundImage: "img/extra1.jpg",
      html: ""
    },
    {
      id: "extra2",
      enabled: false,
      backgroundImage: "img/extra2.jpg",
      html: ""
    }
  ]
};

// ===== FUNÇÕES LEGADAS (compatibilidade com script.js) =====
function playaudio() {
  const audio = document.querySelector("#audio");
  if (audio) audio.play();
}

function removeModal() {
  const modal = document.querySelector(".inicio");
  if (modal) modal.classList.add("oculto");
  const ativo = document.querySelector(".container_envelope");
  if (ativo) ativo.classList.add("ativo");
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.anime').forEach(item => {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      const target = event.target.closest('a').getAttribute('data-target');
      const modal = document.getElementById('modal-' + target);
      if (modal) modal.style.display = 'block';
    });
  });

  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const modal = btn.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });

  window.addEventListener('click', function (event) {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) modal.style.display = 'none';
    });
  });
});
