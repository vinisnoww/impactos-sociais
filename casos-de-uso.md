# Casos de Uso — Fase 1

**Atores:** Visitante, Voluntário, Doador, Apoiador (os três últimos escolhem o tipo no cadastro; não há contas nesta versão).

## UC01 — Conhecer a organização
- **Ator:** Visitante · **Fluxo:** abre `index.html` → lê missão, visão, valores e indicadores (fictícios) → segue para projetos ou cadastro.
- **Pós-condição:** nenhuma alteração de dados.

## UC02 — Buscar projetos
- **Ator:** Visitante
- **Fluxo principal:** abre `projetos.html` → escolhe categoria e/ou digita termo → a lista é atualizada e o total é anunciado a leitores de tela.
- **Alternativo:** nenhum resultado → estado vazio com botão "Limpar filtros".
- **Critérios de aceitação:** filtro por categoria; busca ignora acentos e maiúsculas; 4 projetos visíveis sem filtro.

## UC03 — Ver detalhes de um projeto
- **Fluxo:** clica em "Detalhes do projeto" (elemento `details`) → vê objetivo e localização. Também acessível por âncora (`projetos.html#educacao`).

## UC04 — Cadastrar-se
- **Ator:** Visitante
- **Pré-condição:** nenhuma.
- **Fluxo principal:** preenche os campos → máscaras formatam CPF, telefone e CEP → clica "Validar cadastro" → todos os campos válidos → o sistema informa que os dados foram validados **e que nada foi enviado ou concluído**.
- **Fluxo alternativo A:** campos inválidos ou vazios → resumo de erros recebe o foco, lista links para cada campo, e cada campo mostra sua mensagem.
- **Fluxo alternativo B:** CPF com dígitos verificadores inválidos, telefone sem DDD válido, data futura → mensagem específica.
- **Pós-condição:** nenhum dado persistido.
- **Critérios de aceitação:** 12 erros no envio vazio; mensagem de sucesso só com tudo válido; formulário limpo após validação.

## Casos previstos (Fase 2, não implementados)
Candidatar-se a vaga de voluntariado, registrar intenção de doação, consultar prestação de contas, ler notícias, enviar contato, entrar no sistema, administrar projetos.
