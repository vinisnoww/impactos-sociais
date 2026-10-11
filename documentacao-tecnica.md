# Documentação Técnica — Impacto Social

**Instituição:** _[preencher]_ · **Curso:** _[preencher]_ · **Disciplina:** _[preencher]_ · **Professor:** _[preencher]_ · **Estudante:** _[preencher]_

> Status: **Fase 1** (3 de 10 páginas previstas). Pontos que dependem dos materiais da disciplina estão marcados com **[confirmar]**.

## 1. Introdução
A Impacto Social é uma plataforma web demonstrativa para ONGs apresentarem missão e projetos e receberem cadastros de voluntários, doadores e apoiadores.

## 2. Justificativa
ONGs precisam de presença digital clara e transparente. O projeto aplica HTML5, CSS3, JavaScript, responsividade, acessibilidade e versionamento em um cenário realista.

## 3. Objetivos
**Geral:** desenvolver um site multipágina, responsivo e acessível para uma ONG fictícia.
**Específicos:** (a) estruturar páginas com HTML semântico; (b) criar um sistema de design em CSS; (c) implementar filtros e validação de formulários em JavaScript puro; (d) documentar limites de uma solução estática.

## 4. Público-alvo e personas
- **Marina, 24, estudante** — quer ser voluntária e procura projetos por área.
- **Carlos, 45, empresário** — quer apoiar financeiramente e conferir a transparência.
- **Dona Lúcia, 62** — usa celular e precisa de textos grandes, contraste e formulário simples.

## 5. Requisitos funcionais (implementados na Fase 1)
| ID | Requisito | Onde |
|---|---|---|
| RF01 | Navegar entre Início, Projetos e Cadastro | todas |
| RF02 | Listar projetos com imagem, local, objetivo e progresso | projetos.html |
| RF03 | Filtrar por categoria e pesquisar por texto (sem distinção de acento/caixa) | main.js |
| RF04 | Exibir estado vazio quando não há resultados | projetos.html |
| RF05 | Cadastro com 13 campos, fieldset/legend | cadastro.html |
| RF06 | Máscaras de CPF, telefone e CEP (digitação, exclusão, colagem) | mascaras.js |
| RF07 | Validar CPF (dígitos verificadores), telefone, CEP, e-mail, data | mascaras.js, cadastro.js |
| RF08 | Resumo de erros e mensagens por campo acessíveis | cadastro.js |

**Não implementados (Fase 2):** voluntariado, doações, transparência, notícias, contato, login, painel.

## 6. Requisitos não funcionais
Responsividade mobile-first; WCAG 2.1 AA como meta (sem auditoria formal executada); sem frameworks, sem `eval`; sem armazenamento de dados pessoais; HTML5 semântico em pt-BR.

## 7. Arquitetura
Site estático multipágina. Cada página carrega os mesmos CSS e `main.js`; `mascaras.js` e `cadastro.js` só em `cadastro.html`. `mascaras.js` contém funções puras, reutilizáveis e testáveis no Node. Cabeçalho e rodapé são repetidos em cada HTML (sem template, por ser estático).

## 8. Estrutura de diretórios
Ver `README.md`.

## 9. Tecnologias
HTML5, CSS3 (variáveis, Grid, Flexbox, `prefers-reduced-motion`), JavaScript ES5/ES6 puro, Git/GitHub Pages. Imagens: WebP gerado programaticamente (ilustrações abstratas, **não** são fotografias).

## 10. Modelagem de dados
Não há banco. Dados dos projetos estão no HTML e são **demonstrativos**. Um modelo futuro (**proposta, não implementada**): `Usuario(id, nome, email, cpf, telefone, nascimento, endereco…, tipo, aceite_lgpd_em)`, `Projeto(id, titulo, categoria, local, objetivo, meta, progresso)`, `Inscricao(usuario_id, projeto_id)`.

## 11. Design e responsividade
Paleta verde/azul-escuro/neutros; títulos em serifa, texto em fonte do sistema. Breakpoints: 640px (2 colunas), 900px (menu horizontal e 3–4 colunas), 1200px (telas largas). Menu móvel com `aria-expanded`, fecha com Esc.

## 12. Acessibilidade e SEO
Link "pular conteúdo", foco visível, labels associados, `aria-describedby`/`aria-invalid`, `role="alert"` no resumo de erros, `role="status"` no filtro, erros com ícone e texto (não só cor), imagens com `alt`, `lang="pt-BR"`, `title` e `meta description` por página, `loading="lazy"` abaixo da dobra.

## 13. Segurança e privacidade
Nenhum dado é enviado ou armazenado (verificado: `localStorage` vazio após o envio). O formulário usa `novalidate` para exibir mensagens próprias, mantendo `required`/`type` do HTML5. Em produção seriam necessários: validação no servidor, HTTPS, consentimento LGPD registrado, coleta mínima (CPF só se realmente necessário) e política de privacidade real.

## 14. Estratégia e resultados de testes
Ver `docs/testes.md`.

## 15. Limitações da versão estática
Sem persistência, autenticação, pagamentos ou e-mail. Dados de exemplo fixos. Cabeçalho/rodapé duplicados. Sem consulta de CEP (exigiria API externa).

## 16. Execução e publicação
Ver `README.md`.

## 17. Metodologia ágil
Entregas em fases: **Fase 1** (estrutura, 3 páginas, validação, docs) · **Fase 2** (demais páginas) · **Fase 3** (auditoria WCAG, validação W3C, publicação). Critério de aceitação de cada requisito: teste correspondente em `docs/testes.md`.

## 18. Conclusão
A Fase 1 entrega um núcleo funcional e honesto quanto aos limites. Faltam as páginas restantes e as validações externas.

## 19. Referências técnicas
Documentação MDN (HTML, CSS, JavaScript, ARIA) e WCAG 2.1 (W3C) — consulte-as diretamente; nenhuma consulta específica foi registrada nesta versão. **[confirmar]** referências exigidas pela disciplina.
