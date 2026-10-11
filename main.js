/* Impacto Social — main.js
   Menu móvel, barras de progresso e filtros/pesquisa de projetos. */
(function () {
  "use strict";

  /* Menu móvel acessível */
  function iniciarMenu() {
    var botao = document.querySelector(".menu-toggle");
    var menu = document.getElementById("menu-principal");
    if (!botao || !menu) return;

    function alternar(abrir) {
      menu.classList.toggle("aberto", abrir);
      botao.setAttribute("aria-expanded", String(abrir));
      botao.textContent = abrir ? "Fechar" : "Menu";
    }
    botao.addEventListener("click", function () {
      alternar(botao.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("aberto")) {
        alternar(false);
        botao.focus();
      }
    });
  }

  /* Barras de progresso: largura vem de data-valor (0–100) */
  function iniciarProgresso() {
    document.querySelectorAll("[data-valor]").forEach(function (barra) {
      var valor = Math.max(0, Math.min(100, Number(barra.dataset.valor) || 0));
      barra.style.width = valor + "%";
    });
  }

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }

  /* Filtro por categoria + pesquisa de texto na página de projetos */
  function iniciarFiltroProjetos() {
    var lista = document.getElementById("lista-projetos");
    if (!lista) return;
    var cards = Array.prototype.slice.call(lista.querySelectorAll("[data-categoria]"));
    var busca = document.getElementById("busca");
    var categoria = document.getElementById("categoria");
    var vazio = document.getElementById("estado-vazio");
    var status = document.getElementById("status-filtro");

    function aplicar() {
      var termo = normalizar(busca.value.trim());
      var cat = categoria.value;
      var visiveis = 0;
      cards.forEach(function (card) {
        var okCat = cat === "todas" || card.dataset.categoria === cat;
        var okTexto = !termo || normalizar(card.textContent).indexOf(termo) !== -1;
        var mostrar = okCat && okTexto;
        card.hidden = !mostrar;
        if (mostrar) visiveis++;
      });
      vazio.hidden = visiveis !== 0;
      status.textContent = visiveis === 1 ? "1 projeto encontrado." : visiveis + " projetos encontrados.";
    }

    busca.addEventListener("input", aplicar);
    categoria.addEventListener("change", aplicar);
    document.getElementById("limpar-filtros").addEventListener("click", function () {
      busca.value = "";
      categoria.value = "todas";
      aplicar();
      busca.focus();
    });
    aplicar();
  }

  /* Imagem ausente: troca por texto alternativo visível sem quebrar o layout */
  function tratarImagensAusentes() {
    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.style.background = "#e6eef2";
        img.style.minHeight = "120px";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    iniciarMenu();
    iniciarProgresso();
    iniciarFiltroProjetos();
    tratarImagensAusentes();
  });
})();
