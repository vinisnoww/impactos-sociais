/* Impacto Social — cadastro.js
   Validação complementar do formulário de cadastro, com mensagens acessíveis.
   IMPORTANTE: esta versão é estática. Nenhum dado é enviado ou armazenado. */
(function () {
  "use strict";

  var M = window.Mascaras;
  var form = document.getElementById("form-cadastro");
  if (!form || !M) return;

  M.aplicar(form.elements.cpf, M.mascaraCPF);
  M.aplicar(form.elements.telefone, M.mascaraTelefone);
  M.aplicar(form.elements.cep, M.mascaraCEP);

  var resumo = document.getElementById("resumo-erros");
  var resultado = document.getElementById("resultado");

  /* Regras: retornam texto de erro ou "" quando válido */
  var regras = {
    nome: function (v) {
      v = v.trim();
      if (!v) return "Informe o nome completo.";
      if (v.split(/\s+/).length < 2) return "Informe nome e sobrenome.";
      return "";
    },
    email: function (v, campo) {
      if (!v.trim()) return "Informe o e-mail.";
      return campo.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? "Informe um e-mail válido, como nome@exemplo.com." : "";
    },
    cpf: function (v) {
      if (!v.trim()) return "Informe o CPF.";
      return M.validarCPF(v) ? "" : "CPF inválido. Confira os 11 dígitos.";
    },
    telefone: function (v) {
      if (!v.trim()) return "Informe o telefone.";
      return M.validarTelefone(v) ? "" : "Telefone inválido. Use DDD + número, ex.: (11) 91234-5678.";
    },
    nascimento: function (v) {
      if (!v) return "Informe a data de nascimento.";
      var data = new Date(v + "T00:00:00");
      if (isNaN(data.getTime())) return "Data inválida.";
      if (data > new Date()) return "A data de nascimento não pode estar no futuro.";
      if (data < new Date("1900-01-01T00:00:00")) return "Data de nascimento inválida.";
      return "";
    },
    endereco: function (v) { return v.trim() ? "" : "Informe o endereço."; },
    numero: function (v) { return v.trim() ? "" : "Informe o número (ou S/N)."; },
    cep: function (v) {
      if (!v.trim()) return "Informe o CEP.";
      return M.validarCEP(v) ? "" : "CEP inválido. Use o formato 00000-000.";
    },
    cidade: function (v) { return v.trim() ? "" : "Informe a cidade."; },
    estado: function (v) { return v ? "" : "Selecione o estado."; },
    privacidade: function (v, campo) {
      return campo.checked ? "" : "É necessário aceitar a política de privacidade.";
    }
  };

  function campoDe(nome) { return form.elements[nome]; }
  function areaErro(nome) { return document.getElementById("erro-" + nome); }

  function mostrarErro(nome, mensagem) {
    var campo = campoDe(nome);
    var area = areaErro(nome);
    var bloco = campo.closest(".campo");
    area.textContent = mensagem;
    area.hidden = !mensagem;
    bloco.classList.toggle("campo--invalido", Boolean(mensagem));
    if (mensagem) campo.setAttribute("aria-invalid", "true");
    else campo.removeAttribute("aria-invalid");
  }

  function validarCampo(nome) {
    var campo = campoDe(nome);
    var valor = campo.type === "checkbox" ? String(campo.checked) : campo.value;
    var erro = regras[nome](valor, campo);
    mostrarErro(nome, erro);
    return erro;
  }

  function validarTipo() {
    var marcado = form.querySelector('input[name="tipo"]:checked');
    var erro = marcado ? "" : "Escolha um tipo de usuário.";
    var area = document.getElementById("erro-tipo");
    area.textContent = erro;
    area.hidden = !erro;
    return erro;
  }

  Object.keys(regras).forEach(function (nome) {
    var campo = campoDe(nome);
    campo.addEventListener("blur", function () { validarCampo(nome); });
    campo.addEventListener("input", function () {
      if (campo.closest(".campo").classList.contains("campo--invalido")) validarCampo(nome);
    });
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    resultado.hidden = true;
    var erros = [];

    Object.keys(regras).forEach(function (nome) {
      var erro = validarCampo(nome);
      if (erro) erros.push({ nome: nome, mensagem: erro });
    });
    var erroTipo = validarTipo();
    if (erroTipo) erros.push({ nome: "tipo", mensagem: erroTipo });

    if (erros.length) {
      resumo.innerHTML = "";
      var titulo = document.createElement("p");
      titulo.innerHTML = "<strong>Corrija " + erros.length + (erros.length === 1 ? " campo" : " campos") + " para continuar:</strong>";
      resumo.appendChild(titulo);
      var ul = document.createElement("ul");
      erros.forEach(function (e) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + (e.nome === "tipo" ? "tipo-voluntario" : e.nome);
        a.textContent = e.mensagem;
        li.appendChild(a);
        ul.appendChild(li);
      });
      resumo.appendChild(ul);
      resumo.hidden = false;
      resumo.focus();
      return;
    }

    resumo.hidden = true;
    /* Não há backend: o cadastro NÃO é enviado nem salvo. Mostramos apenas
       que a validação passou, sem afirmar que o cadastro foi concluído. */
    resultado.hidden = false;
    resultado.focus();
    form.reset();
  });

  form.addEventListener("reset", function () {
    Object.keys(regras).forEach(function (nome) { mostrarErro(nome, ""); });
    var area = document.getElementById("erro-tipo");
    area.textContent = "";
    area.hidden = true;
    resumo.hidden = true;
  });
})();
