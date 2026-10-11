# Impacto Social

Plataforma web **demonstrativa** para ONGs, desenvolvida como atividade acadêmica com HTML5, CSS3 e JavaScript puro (sem frameworks).

> **Aviso:** todo o conteúdo (projetos, números, depoimentos, contatos) é fictício. Não há servidor: os formulários validam os dados no navegador, mas **nada é enviado, salvo ou processado**.

## Estado atual (Fase 1)

| Item | Situação |
|---|---|
| `index.html` — página inicial | Implementada |
| `projetos.html` — catálogo com filtro e pesquisa | Implementada |
| `cadastro.html` — cadastro com máscaras e validação | Implementada |
| `voluntariado`, `doacoes`, `transparencia`, `noticias`, `contato`, `login`, `painel` | **Não implementadas** (previstas na Fase 2) |

## Estrutura

```
impacto-social/
├── index.html · projetos.html · cadastro.html
├── css/        style.css (sistema de design) · responsive.css (breakpoints)
├── js/         main.js · mascaras.js · cadastro.js
├── assets/     images/ (logo.svg e imagens WebP ilustrativas) · icons/
├── docs/       documentação técnica, casos de uso, testes, manual do usuário
├── tests/      unit.js (máscaras/validadores) · e2e.js (navegador, Playwright)
├── .gitignore
└── README.md
```

Em relação à estrutura proposta, foram acrescentadas `projeto-saude.webp`, `projeto-assistencia.webp` (os quatro projetos precisam de imagem) e a pasta `tests/`.

## Executar localmente

Abra `index.html` no navegador ou, de preferência, sirva a pasta:

```bash
python3 -m http.server 8000   # depois acesse http://localhost:8000
```

## Testes

```bash
node tests/unit.js                     # 27 verificações de máscaras e validadores
npm i playwright && node tests/e2e.js  # 43 verificações no Chromium
```

Resultados detalhados e limitações em [`docs/testes.md`](docs/testes.md).

## Publicar no GitHub Pages

1. `git init && git add . && git commit -m "feat: fase 1 da plataforma Impacto Social"`
2. Crie um repositório público no GitHub e faça `git remote add origin <URL>` e `git push -u origin main`.
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
4. O site ficará em `https://<usuario>.github.io/<repositorio>/`.

> O repositório **ainda não foi criado nem publicado**; os passos acima precisam ser feitos por você.

## Commits sugeridos

1. `chore: estrutura de pastas, .gitignore e README`
2. `feat(css): sistema de design e responsividade`
3. `feat(js): menu, filtros de projetos e barras de progresso`
4. `feat(js): máscaras e validadores de CPF, telefone e CEP`
5. `feat: página inicial`
6. `feat: catálogo de projetos`
7. `feat: formulário de cadastro acessível`
8. `test: testes unitários e de navegador`
9. `docs: documentação técnica, casos de uso, testes e manual`

## Limitações

Sem backend, não há cadastro persistente, autenticação, pagamentos nem envio de e-mail. Uma versão real exigiria API, banco de dados, autenticação/autorização no servidor, provedor de pagamentos e adequação à LGPD (ver `docs/documentacao-tecnica.md`).
