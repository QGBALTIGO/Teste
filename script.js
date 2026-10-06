/* Baltigo Ads · frontend estático. Nenhum dado é enviado, persistido ou rastreado. */
'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const form = $('#brief-form');
  const result = $('#brief-result');
  const briefText = $('#brief-text');
  const formStatus = $('#form-status');
  let toastTimer;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 4000);
  }
  // Navigation: works with touch, keyboard and no external runtime.
  const menuButton = $('.menu-button');
  const mobileNav = $('#mobile-nav');
  function setMenu(open) {
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('use', menuButton).setAttribute('href', open ? '#close' : '#menu');
  }
  menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
  $$('a', mobileNav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', e => {
    if (e.matches) setMenu(false);
  });

  // Community filters. The cards are real HTML so content survives JS failure.
  const filters = $$('[data-filter]');
  const cards = $$('[data-universe]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    cards.forEach(card => {
      const show = button.dataset.filter === 'todos' || card.dataset.universe === button.dataset.filter;
      card.hidden = !show;
      count += Number(show);
    });
    $('#filter-status').textContent = `${count} ${count === 1 ? 'universo exibido' : 'universos exibidos'}.`;
  }));

  // Format demo is explicitly illustrative: it never displays fabricated metrics.
  const formatContent = Object.freeze({
    canal: {
      label: 'Publicação em canal', title: ['Sua próxima', 'descoberta.'],
      kicker: 'NOVIDADES QUE MERECEM SUA ATENÇÃO',
      headline: 'Conheça a sua próxima descoberta.',
      text: 'Um espaço para apresentar sua marca, contar o que ela oferece e convidar a comunidade a conhecer mais.',
      button: 'Conhecer a marca ↗', tag: 'Seu próximo ponto de conexão.'
    },
    rede: {
      label: 'Campanha em rede', title: ['Sua marca.', 'Mais conexões.'],
      kicker: 'UMA MENSAGEM. DIFERENTES COMUNIDADES.',
      headline: 'Uma novidade para encontrar novos caminhos.',
      text: 'Imagine esta mensagem em diferentes espaços selecionados para a sua campanha. Os canais são definidos na proposta.',
      button: 'Explorar a novidade ↗', tag: 'Uma mensagem em mais de um canal.'
    },
    recorrente: {
      label: 'Presença recorrente', title: ['Sua história', 'continua.'],
      kicker: 'MAIS DE UM MOMENTO PARA SUA MARCA',
      headline: 'O próximo capítulo da sua marca.',
      text: 'Uma sequência de divulgações pode apresentar diferentes novidades ao longo do período combinado.',
      button: 'Acompanhar as novidades ↗', tag: 'Novos momentos. Novas mensagens.'
    }
  });
  const tabs = $$('.format-button');
  let currentMode = 'canal';
  function setFormat(mode, focusTab = false) {
    const content = formatContent[mode];
    if (!content) return;
    currentMode = mode;
    tabs.forEach(tab => {
      const selected = tab.dataset.mode === mode;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      $('#' + tab.getAttribute('aria-controls')).hidden = !selected;
      if (selected && focusTab) tab.focus();
    });
    $('#demo-stage').dataset.mode = mode;
    const heading = $('#creative-title');
    heading.replaceChildren(document.createTextNode(content.title[0]), document.createElement('br'), document.createTextNode(content.title[1]));
    $('#creative-mini').textContent = content.kicker;
    $('#ad-headline').textContent = content.headline;
    $('#ad-description').textContent = content.text;
    $('#ad-button').textContent = content.button;
    $('#stage-tag-text').textContent = content.tag;
    form.elements.format.value = content.label;
    invalidateResult();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setFormat(tab.dataset.mode));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) {
        event.preventDefault();
        setFormat(tabs[target].dataset.mode, true);
      }
    });
  });

  // User text is only written with textContent/value. No interpolation into HTML.
  $('#personalize-form').addEventListener('submit', event => {
    event.preventDefault();
    const brand = $('#demo-brand').value.trim() || 'Sua marca';
    $$('[data-brand-output]').forEach(el => { el.textContent = brand; });
    if (brand !== 'Sua marca') form.elements.company.value = brand;
    invalidateResult();
    $('#personalize-status').textContent = `Prévia atualizada com o nome ${brand}.`;
    toast('Sua marca já está na prévia.');
    if (window.innerWidth <= 760) {
      $('#demo-stage').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
    }
  });

  $$('[data-interest]').forEach(button => button.addEventListener('click', () => {
    form.elements.interest.value = button.dataset.interest;
    invalidateResult();
    formStatus.textContent = `Interesse selecionado: ${button.dataset.interest}.`;
    $('#contato').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    // Move keyboard focus without opening the soft keyboard on a phone.
    $('#contact-title').tabIndex = -1;
    $('#contact-title').focus({ preventScroll: true });
  }));

  // Deep links open the actual methodology, not a collapsed heading.
  function openMethodology() {
    if (window.location.hash === '#metodologia') $('#metodologia').open = true;
  }
  $$('a[href="#metodologia"]').forEach(a => a.addEventListener('click', () => { $('#metodologia').open = true; }));
  window.addEventListener('hashchange', openMethodology);
  openMethodology();

  function invalidateResult() {
    result.hidden = true;
    briefText.value = '';
    formStatus.textContent = '';
  }
  form.addEventListener('input', event => {
    if (event.target === briefText) return;
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    invalidateResult();
  });
  form.addEventListener('change', event => {
    if (event.target !== briefText) invalidateResult();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = form.elements;
    for (const key of ['name', 'company']) {
      fields[key].setCustomValidity(fields[key].value.trim() ? '' : 'Preencha este campo para preparar o resumo.');
    }
    if (!form.reportValidity()) return;
    const message = [
      'Olá, Baltigo! Conheci a página Baltigo Ads e gostaria de conversar sobre uma divulgação.',
      '',
      `Meu nome: ${fields.name.value.trim()}`,
      `Marca/projeto: ${fields.company.value.trim()}`,
      `Objetivo: ${fields.goal.value}`,
      `Formato de interesse: ${fields.format.value || formatContent[currentMode].label}`,
      ...(fields.interest.value ? [`Universo de interesse: ${fields.interest.value}`] : []),
      ...(fields.message.value.trim() ? ['', `Detalhes: ${fields.message.value.trim()}`] : []),
      '',
      'Gostaria de conhecer os canais disponíveis, as condições e o investimento para a minha campanha.'
    ].join('\n');
    briefText.value = message;
    result.hidden = false;
    formStatus.textContent = 'Resumo preparado. Revise, copie e envie no Telegram. Nada foi enviado automaticamente.';
    result.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
    $('#copy-brief').focus({ preventScroll: true });
  });
  $('#copy-brief').addEventListener('click', async () => {
    if (!briefText.value.trim()) return;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(briefText.value);
        copied = true;
      }
    } catch { /* A fallback below also supports locally opened HTML. */ }
    if (!copied) {
      briefText.focus();
      briefText.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
    }
    const message = copied ? 'Resumo copiado. Cole na conversa com @QGSuporte.' : 'Selecione o resumo e copie pelo menu do seu dispositivo.';
    formStatus.textContent = message;
    toast(message);
  });

  // Avoid a sticky sales bar covering the form or competing with the hero action.
  const mobileCta = $('.mobile-cta');
  let heroVisible = true;
  let contactVisible = false;
  function updateMobileCta() {
    mobileCta.classList.toggle('visible', !heroVisible && !contactVisible && window.innerWidth <= 760);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target.classList.contains('hero')) heroVisible = entry.isIntersecting;
        if (entry.target.id === 'contato') contactVisible = entry.isIntersecting;
      }
      updateMobileCta();
    }, { threshold: 0.04 });
    observer.observe($('.hero'));
    observer.observe($('#contato'));
  }
  window.addEventListener('resize', updateMobileCta, { passive: true });

  const animationToggle = $('#animation-toggle');
  animationToggle.addEventListener('click', () => {
    const paused = document.body.classList.toggle('paused');
    animationToggle.setAttribute('aria-pressed', String(paused));
    $('span', animationToggle).textContent = paused ? 'Retomar faixa animada' : 'Pausar faixa animada';
    $('use', animationToggle).setAttribute('href', paused ? '#play' : '#pause');
  });
})();
