# Testes — Fase 1

Data da execução: 09/10/2026. Ambiente: Node 22, Chromium (Playwright) em servidor HTTP local. Scripts em `tests/`.

## Executados

### Unitários — `node tests/unit.js` → **27 aprovados, 0 falhas**
Máscaras (CPF completo/parcial/colado/excesso/letras/vazio; telefone de 10 e 11 dígitos e parciais; CEP) e validadores (CPF válido, dígito verificador errado, sequência repetida, curto; telefone celular/fixo/sem 9/DDD inválido/curto; CEP com e sem hífen e inválido).

### Navegador — `node tests/e2e.js` → **43 aprovados, 0 falhas**
- Todas as imagens das 3 páginas carregam; todos os links internos e âncoras apontam para destinos existentes.
- Projetos: filtro por categoria, busca (maiúsculas), busca sem acento, estado vazio, limpar filtros, barra de progresso aplicada.
- Cadastro: máscaras ao digitar, apagar e preencher texto já formatado; envio vazio gera 12 erros, foco no resumo e `aria-invalid`; CPF inválido e data futura bloqueiam; envio válido mostra mensagem honesta, limpa o formulário e deixa `localStorage` vazio.
- Responsividade (375 px e 1280 px): menu móvel abre/fecha (inclusive com Esc); sem rolagem horizontal nas 3 páginas; menu horizontal no desktop.
- Teclado: primeiro Tab foca o link "Pular para o conteúdo".
- Nenhum erro de console e nenhuma resposta HTTP ≥ 400.
- Capturas de tela inspecionadas visualmente (desktop da home e mobile do cadastro).

### Problemas encontrados e correções
1. Durante o desenvolvimento, um primeiro manipulador de colagem substituía todo o valor do campo em vez de inserir no cursor; foi **removido**, pois o evento `input` já cobre a colagem.
2. Um teste falhou por expectativa errada minha (a máscara remove o separador ao apagar, então três Backspaces resultam em `529.982.24`); o código estava correto e o teste foi corrigido.
3. Havia uma classe CSS digitada errada (`btn-primario`) no botão do hero; corrigida.

## NÃO executados (pendentes)
- Validação HTML no W3C Nu Html Checker e CSS no validador do W3C (sem acesso aos serviços neste ambiente).
- Auditoria WCAG 2.1 AA completa (leitor de tela, contraste medido por ferramenta, zoom 200%).
- Testes em Firefox, Safari e dispositivos reais; medição de tempo de carregamento.
- Teste de colagem real da área de transferência (coberto apenas por preenchimento programático de texto já formatado).

**Conclusão:** os recursos da Fase 1 passaram nos testes automatizados listados; **conformidade total com WCAG, W3C e outros navegadores não foi comprovada**.
