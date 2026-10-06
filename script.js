/* Baltigo Ads v3. All commercial links go straight to @QGSuporteBot.
   No forms, lead collection, tracking, persistence or external JavaScript. */
'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = $('.menu-button');
  const mobileNav = $('#mobile-nav');
  function setMenu(open) {
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuButton.querySelector('use').setAttribute('href', open ? '#close' : '#menu');
  }
  menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', event => {
    if (event.target instanceof Element && !event.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });
  const filters = $$('[data-filter]');
  const cards = $$('[data-universe]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    cards.forEach(card => {
      card.hidden = button.dataset.filter !== 'todos' && card.dataset.universe !== button.dataset.filter;
      if (!card.hidden) count += 1;
    });
    $('#filter-status').textContent = `${count} ${count === 1 ? 'universo exibido' : 'universos exibidos'}.`;
  }));
  const content = {
    canal: { title: ['Sua próxima', 'descoberta.'], kicker: 'NOVIDADES QUE MERECEM SUA ATENÇÃO', headline: 'Conheça a sua próxima descoberta.', text: 'Um espaço para apresentar sua marca, contar o que ela oferece e convidar a comunidade a conhecer mais.', tag: 'Seu próximo ponto de conexão.' },
    rede: { title: ['Sua marca.', 'Mais conexões.'], kicker: 'UMA MENSAGEM. DIFERENTES COMUNIDADES.', headline: 'Uma novidade para encontrar novos caminhos.', text: 'Imagine esta mensagem em diferentes espaços selecionados para a sua campanha. Os canais são definidos na proposta.', tag: 'Uma mensagem em mais de um canal.' },
    recorrente: { title: ['Sua história', 'continua.'], kicker: 'MAIS DE UM MOMENTO PARA SUA MARCA', headline: 'O próximo capítulo da sua marca.', text: 'Uma sequência de divulgações pode apresentar diferentes novidades ao longo do período combinado.', tag: 'Novos momentos. Novas mensagens.' }
  };
  const tabs = $$('.format-button');
  function setFormat(mode, focus = false) {
    const selectedContent = content[mode];
    if (!selectedContent) return;
    tabs.forEach(tab => {
      const active = tab.dataset.mode === mode;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
      if (active && focus) tab.focus();
    });
    $('#demo-stage').dataset.mode = mode;
    $('#creative-title').replaceChildren(document.createTextNode(selectedContent.title[0]), document.createElement('br'), document.createTextNode(selectedContent.title[1]));
    $('#creative-mini').textContent = selectedContent.kicker;
    $('#ad-headline').textContent = selectedContent.headline;
    $('#ad-description').textContent = selectedContent.text;
    $('#stage-tag-text').textContent = selectedContent.tag;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setFormat(tab.dataset.mode));
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % tabs.length;
      else if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); setFormat(tabs[next].dataset.mode, true); }
    });
  });
  function openMethodology() {
    if (location.hash === '#metodologia') $('#metodologia').open = true;
  }
  $$('a[href="#metodologia"]').forEach(link => link.addEventListener('click', () => { $('#metodologia').open = true; }));
  window.addEventListener('hashchange', openMethodology);
  openMethodology();
  // Keep the mobile action away from the hero, the contact block and the footer.
  const bar = $('.mobile-cta');
  const regions = new Map([[$('.hero'), true], [$('#contato'), false], [$('footer'), false]]);
  function updateBar() {
    const visible = window.innerWidth <= 760 && !Array.from(regions.values()).some(Boolean);
    bar.classList.toggle('visible', visible);
    bar.inert = !visible;
    bar.setAttribute('aria-hidden', String(!visible));
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => regions.set(entry.target, entry.isIntersecting));
      updateBar();
    }, { threshold: 0 });
    regions.forEach((_, element) => observer.observe(element));
  }
  window.addEventListener('resize', updateBar, { passive: true });
  updateBar();
  const toggle = $('#animation-toggle');
  let userPaused = false;
  function syncMotion() {
    const paused = userPaused || motion.matches;
    document.body.classList.toggle('paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.disabled = motion.matches;
    toggle.querySelector('span').textContent = motion.matches ? 'Animação reduzida no dispositivo' : paused ? 'Retomar faixa animada' : 'Pausar faixa animada';
    toggle.querySelector('use').setAttribute('href', paused ? '#play' : '#pause');
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
  motion.addEventListener('change', syncMotion);
  syncMotion();
})();
