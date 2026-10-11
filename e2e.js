const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp'};
const srv = http.createServer((q,r)=>{ let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]); if(p==='/')p='/index.html';
  const f = path.join(root,p); if(!fs.existsSync(f)){r.statusCode=404;return r.end('nf');}
  r.setHeader('content-type', mime[path.extname(f)]||'application/octet-stream'); r.end(fs.readFileSync(f)); });
let ok=0, fail=0; const t=(n,c)=>{ if(c)ok++; else {fail++; console.log('FALHOU:',n);} };
(async()=>{
  await new Promise(r=>srv.listen(0,r)); const base='http://localhost:'+srv.address().port;
  const exe = process.env.PW_EXE || '/opt/pw-browsers/chromium';
  let browser; try { browser = await chromium.launch(); } catch(e){ browser = await chromium.launch({executablePath: exe}); }
  const ctx = await browser.newContext({viewport:{width:1280,height:800}});
  const page = await ctx.newPage();
  const erros=[], falhas=[];
  page.on('console', m=>{ if(m.type()==='error') erros.push(m.text()); });
  page.on('pageerror', e=>erros.push('pageerror '+e.message));
  page.on('response', r=>{ if(r.status()>=400) falhas.push(r.status()+' '+r.url()); });

  // Páginas, links internos e imagens
  for (const p of ['index.html','projetos.html','cadastro.html']) {
    await page.goto(`${base}/${p}`); await page.waitForLoadState('networkidle');
    const imgs = await page.$$eval('img', is=>is.map(i=>[i.src, i.complete && i.naturalWidth>0]));
    t(`${p}: imagens carregam`, imgs.every(i=>i[1]));
    const links = await page.$$eval('a[href]', as=>as.map(a=>a.getAttribute('href')).filter(h=>!h.startsWith('mailto:')&&!h.startsWith('http')));
    for (const h of new Set(links)) {
      const [file, hash] = h.split('#'); const target = file||p;
      if(!fs.existsSync(path.join(root,target))) { t(`${p}: link ${h} arquivo existe`, false); continue; }
      if(hash){ await page.goto(`${base}/${target}`); t(`${p}: âncora ${h}`, !!(await page.$('#'+hash))); await page.goto(`${base}/${p}`); }
    }
  }

  // Projetos: filtros
  await page.goto(base+'/projetos.html');
  const vis = ()=>page.$$eval('#lista-projetos > article', a=>a.filter(x=>!x.hidden).length);
  t('projetos: 4 visíveis', await vis()===4);
  await page.selectOption('#categoria','saude'); t('filtro categoria saude =1', await vis()===1);
  await page.selectOption('#categoria','todas'); await page.fill('#busca','HORTA'); t('busca "HORTA" =1', await vis()===1);
  await page.fill('#busca','saude'); t('busca sem acento/caixa', await vis()>=1);
  await page.fill('#busca','zzzz'); t('estado vazio visível', await page.isVisible('#estado-vazio') && await vis()===0);
  await page.click('#limpar-filtros'); t('limpar filtros', await vis()===4 && !(await page.isVisible('#estado-vazio')));
  t('barra de progresso aplicada', (await page.$eval('#educacao .progresso__barra', e=>e.style.width))==='65%');

  // Cadastro: máscaras
  await page.goto(base+'/cadastro.html');
  await page.type('#cpf','52998224725'); t('máscara CPF digitando', await page.inputValue('#cpf')==='529.982.247-25');
  await page.fill('#cpf',''); await page.type('#cpf','52998224725'); await page.keyboard.press('Backspace'); await page.keyboard.press('Backspace'); await page.keyboard.press('Backspace');
  t('exclusão CPF (3 backspaces: dígito, separador removido pela máscara, dígito)', await page.inputValue('#cpf')==='529.982.24');
  await page.fill('#cpf','529.982.247-25'); t('CPF colado/preenchido', await page.inputValue('#cpf')==='529.982.247-25');
  await page.type('#telefone','11912345678'); t('máscara telefone', await page.inputValue('#telefone')==='(11) 91234-5678');
  await page.type('#cep','01310100'); t('máscara CEP', await page.inputValue('#cep')==='01310-100');

  // Cadastro: envio vazio
  await page.reload();
  await page.click('button[type=submit]');
  t('resumo de erros visível', await page.isVisible('#resumo-erros'));
  t('resumo recebe foco', await page.evaluate(()=>document.activeElement.id==='resumo-erros'));
  t('12 erros listados', (await page.$$('#resumo-erros li')).length===12);
  t('sucesso oculto com erros', !(await page.isVisible('#resultado')));
  t('aria-invalid no nome', (await page.getAttribute('#nome','aria-invalid'))==='true');
  // CPF inválido
  await page.fill('#nome','Maria Silva'); await page.fill('#email','maria@exemplo.com'); await page.fill('#cpf','111.111.111-11');
  await page.fill('#telefone','(11) 91234-5678'); await page.fill('#nascimento','1990-05-10'); await page.fill('#cep','01310-100');
  await page.fill('#endereco','Rua A'); await page.fill('#numero','10'); await page.fill('#cidade','São Paulo'); await page.selectOption('#estado','SP');
  await page.check('#tipo-doador'); await page.check('#privacidade');
  await page.click('button[type=submit]');
  t('CPF inválido bloqueia', (await page.$$('#resumo-erros li')).length===1 && (await page.textContent('#erro-cpf')).includes('inválido'));
  // Data futura
  await page.fill('#cpf','529.982.247-25'); await page.fill('#nascimento','2999-01-01'); await page.click('button[type=submit]');
  t('data futura bloqueia', (await page.textContent('#erro-nascimento')).includes('futuro'));
  // Válido
  await page.fill('#nascimento','1990-05-10'); await page.click('button[type=submit]');
  t('válido: mensagem honesta', await page.isVisible('#resultado') && (await page.textContent('#resultado')).includes('nenhum cadastro foi concluído'));
  t('válido: sem resumo de erros', !(await page.isVisible('#resumo-erros')));
  t('válido: formulário limpo', (await page.inputValue('#nome'))==='');
  t('nada em localStorage', (await page.evaluate(()=>localStorage.length))===0);

  // Menu móvel
  const m = await browser.newContext({viewport:{width:375,height:700}}); const mp = await m.newPage();
  await mp.goto(base+'/index.html');
  t('mobile: menu fechado', !(await mp.isVisible('#menu-principal')));
  await mp.click('.menu-toggle'); t('mobile: menu abre', await mp.isVisible('#menu-principal') && (await mp.getAttribute('.menu-toggle','aria-expanded'))==='true');
  await mp.keyboard.press('Escape'); t('mobile: Esc fecha', !(await mp.isVisible('#menu-principal')));
  t('mobile: sem rolagem horizontal', await mp.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await mp.goto(base+'/cadastro.html'); t('mobile cadastro: sem rolagem horizontal', await mp.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await mp.goto(base+'/projetos.html'); t('mobile projetos: sem rolagem horizontal', await mp.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  // Desktop: menu visível
  await page.goto(base+'/index.html'); t('desktop: menu horizontal visível', await page.isVisible('#menu-principal') && !(await page.isVisible('.menu-toggle')));
  // Foco por teclado: primeiro Tab = link de pular
  await page.keyboard.press('Tab'); t('Tab 1 = pular conteúdo', await page.evaluate(()=>document.activeElement.className.includes('pular-conteudo')));

  t('sem erros de console/página', erros.length===0); if(erros.length) console.log(erros);
  t('sem respostas HTTP >= 400', falhas.length===0); if(falhas.length) console.log(falhas);
  await page.screenshot({path:'tests/desktop.png'});
  await mp.goto(base+'/cadastro.html'); await mp.screenshot({path:'tests/mobile.png'});
  console.log(`e2e: ${ok} ok, ${fail} falhas`);
  await browser.close(); srv.close(); process.exit(fail?1:0);
})();
