/* Impacto Social — mascaras.js
   Funções puras de máscara/validação (testáveis no Node) + ligação aos campos.
   As máscaras funcionam na digitação, na exclusão e na colagem, pois
   reformatam sempre a partir dos dígitos do valor atual. */
(function (global) {
  "use strict";

  function somenteDigitos(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function mascaraCPF(valor) {
    var d = somenteDigitos(valor).slice(0, 11);
    if (d.length > 9) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    if (d.length > 6) return d.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    if (d.length > 3) return d.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    return d;
  }

  function mascaraTelefone(valor) {
    var d = somenteDigitos(valor).slice(0, 11);
    if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
    if (d.length > 6) return d.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
    if (d.length > 2) return d.replace(/(\d{2})(\d{1,5})/, "($1) $2");
    if (d.length > 0) return "(" + d;
    return "";
  }

  function mascaraCEP(valor) {
    var d = somenteDigitos(valor).slice(0, 8);
    if (d.length > 5) return d.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    return d;
  }

  function validarCPF(valor) {
    var d = somenteDigitos(valor);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    for (var t = 9; t < 11; t++) {
      var soma = 0;
      for (var i = 0; i < t; i++) soma += Number(d[i]) * (t + 1 - i);
      var dv = ((soma * 10) % 11) % 10;
      if (dv !== Number(d[t])) return false;
    }
    return true;
  }

  function validarTelefone(valor) {
    var d = somenteDigitos(valor);
    if (d.length !== 10 && d.length !== 11) return false;
    if (Number(d.slice(0, 2)) < 11) return false; // DDD inválido
    if (d.length === 11 && d[2] !== "9") return false; // celular começa com 9
    return true;
  }

  function validarCEP(valor) {
    return /^\d{5}-?\d{3}$/.test(String(valor || "").trim());
  }

  var api = {
    somenteDigitos: somenteDigitos,
    mascaraCPF: mascaraCPF,
    mascaraTelefone: mascaraTelefone,
    mascaraCEP: mascaraCEP,
    validarCPF: validarCPF,
    validarTelefone: validarTelefone,
    validarCEP: validarCEP
  };

  /* Liga a máscara a um campo. O evento "input" dispara na digitação, na
     exclusão e na colagem; como a máscara reformata a partir dos dígitos,
     um texto colado como "123.456.789-09" ou "12345678909" fica igual. */
  function aplicar(campo, funcaoMascara) {
    if (!campo) return;
    campo.addEventListener("input", function () {
      campo.value = funcaoMascara(campo.value);
    });
  }
  api.aplicar = aplicar;

  global.Mascaras = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
