(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const phone = '2348034784082';
  const defaultMessage = 'Hello Hambare Geosurveys. I would like to discuss a survey project with Registered Surveyor Hamid Adebare.';
  const waUrl = (message = defaultMessage) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  $$('.wa-link').forEach(a => { a.href = waUrl(); a.target = '_blank'; a.rel = 'noopener'; });
  $('#year').textContent = new Date().getFullYear();

  const toast = (message) => {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2500);
  };

  const menuButton = $('.menu-toggle');
  const nav = $('#primary-nav');
  const closeMenu = () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('use').setAttribute('href', '#i-menu');
  };
  menuButton?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  });
  $$('#primary-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!nav.classList.contains('open')) return;
    if (!nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 840) closeMenu(); });

  const solutions = {
    land: { title: 'Boundary and cadastral survey', text: 'Confirm parcel identity, corner positions and the survey information needed for a land or boundary decision.', bring: 'Location, available survey plan or title documents, access details', outputs: 'Boundary plan, coordinates and survey records', service: 'Boundary and cadastral survey', stage: 'Land identification or documentation', output: 'Boundary or parcel plan' },
    design: { title: 'Topographic survey', text: 'Capture terrain, levels and visible features for planning, feasibility, architecture or engineering design.', bring: 'Site extent, design brief, required detail and available reference information', outputs: 'Topographic plan, contours, levels and CAD data', service: 'Topographic survey', stage: 'Design', output: 'Topographic plan / CAD data' },
    build: { title: 'Engineering survey', text: 'Transfer design positions and levels to site, maintain control and record completed work.', bring: 'Issued drawings, coordinates, levels, tolerances, programme and access', outputs: 'Setting-out information, control data, checks or as-built records', service: 'Engineering survey', stage: 'Construction', output: 'Setting-out / control information' },
    assets: { title: 'GIS and spatial analysis', text: 'Organise assets, land records or project information into mapped and queryable spatial data.', bring: 'Existing datasets, area of interest, coordinate information and the analysis question', outputs: 'GIS layers, maps, database or spatial analysis', service: 'GIS and spatial analysis', stage: 'Asset management or analysis', output: 'GIS layers / map / analysis' }
  };
  let currentSolution = 'land';
  const renderFinder = key => {
    currentSolution = key;
    const d = solutions[key];
    $$('.finder-tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.finder === key)));
    $('#finderTitle').textContent = d.title;
    $('#finderText').textContent = d.text;
    $('#finderBring').textContent = d.bring;
    $('#finderOutputs').textContent = d.outputs;
  };
  $$('.finder-tabs button').forEach(b => b.addEventListener('click', () => renderFinder(b.dataset.finder)));
  $$('.shortcut-grid button[data-solution]').forEach(b => b.addEventListener('click', () => { renderFinder(b.dataset.solution); $('#solutions').scrollIntoView({behavior:'smooth'}); }));

  const form = $('#scopeForm');
  const requiredFields = $$('[required]', form);
  const formSteps = $$('.form-step', form);
  const formStepTabs = $$('.mobile-form-nav [data-form-step]', form);
  const formStepPrev = $('#formStepPrev');
  const formStepNext = $('#formStepNext');
  const mobileStepLabel = $('#mobileStepLabel');
  let activeFormStep = 0;
  const mobileStepperQuery = window.matchMedia('(max-width:720px)');
  const validateFormStep = index => {
    let valid = true;
    $$('[required]', formSteps[index]).forEach(el => {
      const bad = !String(el.value).trim();
      el.setAttribute('aria-invalid', String(bad));
      if (bad) valid = false;
    });
    if (!valid) formSteps[index].querySelector('[aria-invalid="true"]')?.focus();
    return valid;
  };
  const showFormStep = (index, focus = false) => {
    activeFormStep = Math.max(0, Math.min(index, formSteps.length - 1));
    form.dataset.activeStep = String(activeFormStep);
    formSteps.forEach((step, i) => step.classList.toggle('is-active', i === activeFormStep));
    formStepTabs.forEach((tab, i) => tab.setAttribute('aria-selected', String(i === activeFormStep)));
    if (mobileStepLabel) mobileStepLabel.textContent = `Step ${activeFormStep + 1} of ${formSteps.length}`;
    if (focus && mobileStepperQuery.matches) formSteps[activeFormStep].querySelector('select,input,textarea')?.focus({preventScroll:true});
  };
  const syncMobileStepper = () => {
    form.classList.toggle('mobile-stepper-ready', mobileStepperQuery.matches);
    if (mobileStepperQuery.matches) showFormStep(activeFormStep);
    else formSteps.forEach(step => step.classList.add('is-active'));
  };
  formStepTabs.forEach(tab => tab.addEventListener('click', () => {
    const nextIndex = Number(tab.dataset.formStep);
    if (nextIndex > activeFormStep && !validateFormStep(activeFormStep)) {
      toast('Complete the required fields in this step.');
      return;
    }
    showFormStep(nextIndex, true);
  }));
  formStepPrev?.addEventListener('click', () => showFormStep(activeFormStep - 1, true));
  formStepNext?.addEventListener('click', () => {
    if (!validateFormStep(activeFormStep)) {
      toast('Complete the required fields in this step.');
      return;
    }
    showFormStep(activeFormStep + 1, true);
    form.scrollIntoView({behavior:'smooth', block:'start'});
  });
  mobileStepperQuery.addEventListener?.('change', syncMobileStepper);
  syncMobileStepper();
  const progressText = $('#formProgressText');
  const progressBar = $('#formProgressBar');
  const progressBox = $('.form-progress');
  const updateFormProgress = () => {
    const completed = requiredFields.filter(el => String(el.value).trim()).length;
    const total = requiredFields.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    progressText.textContent = `${completed} of ${total} required fields completed`;
    progressBar.style.width = `${percent}%`;
    progressBox.classList.toggle('complete', completed === total);
  };
  const signalFormChange = () => form.dispatchEvent(new Event('input', {bubbles:true}));
  const chooseOption = (name, text) => {
    const select = form.elements[name];
    const option = [...select.options].find(o => o.textContent.trim() === text);
    if (option) select.value = option.value || option.textContent;
  };
  const applySolution = key => {
    const d = solutions[key];
    chooseOption('service', d.service);
    chooseOption('stage', d.stage);
    chooseOption('output', d.output);
    signalFormChange();
    showFormStep(0);
    $('#brief').scrollIntoView({behavior:'smooth'});
    toast('Suggested service added to the project brief.');
  };
  $('#finderCta').addEventListener('click', () => applySolution(currentSolution));
  $$('.service-request').forEach(b => b.addEventListener('click', () => { chooseOption('service', b.dataset.service); signalFormChange(); showFormStep(0); $('#brief').scrollIntoView({behavior:'smooth'}); toast('Service added to the project brief.'); }));

  const deliverables = {
    boundary: { title:'Boundary plan', description:'A controlled representation of parcel geometry, corner points, bearings, distances and relevant survey information.', list:['Parcel geometry and corner references','Bearings, distances and coordinates','North point, scale and survey notes'], formats:'PDF · print · CAD · coordinate schedule', image:'assets/visuals/boundary-plan.svg', alt:'Illustrative boundary plan' },
    topographic: { title:'Topographic plan', description:'A site model showing terrain, levels, contours and visible features for planning or design.', list:['Contours, spot levels and terrain representation','Buildings, roads, drainage and site features','Coordinate-referenced CAD or spatial data'], formats:'PDF · print · CAD · coordinate file', image:'assets/visuals/topographic-plan.svg', alt:'Illustrative topographic plan' },
    settingout: { title:'Setting-out sheet', description:'A controlled record of design points, coordinates, levels and checks used to position work on site.', list:['Design point identifiers and issue reference','Control coordinates, levels and offsets','Checks and field records'], formats:'PDF · field sheet · CAD · coordinate schedule', image:'assets/visuals/setting-out-sheet.svg', alt:'Illustrative setting-out sheet' },
    gis: { title:'GIS workspace', description:'A structured spatial environment combining geometry, attributes and imagery for mapping and analysis.', list:['Coordinate-referenced layers','Queryable attributes and asset records','Thematic maps and export-ready data'], formats:'GIS package · map · database · web-ready data', image:'assets/visuals/gis-dashboard.svg', alt:'Illustrative GIS workspace' }
  };
  let currentDeliverable = 'boundary';
  const renderDeliverable = key => {
    currentDeliverable = key;
    const d = deliverables[key];
    $$('.deliverable-tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.output === key)));
    const img = $('#deliverableImage'); img.src = d.image; img.alt = d.alt;
    $('#deliverableTitle').textContent = d.title;
    $('#deliverableDescription').textContent = d.description;
    $('#deliverableList').innerHTML = d.list.map(x => `<li>${x}</li>`).join('');
    $('#deliverableFormats').textContent = d.formats;
    const keys = Object.keys(deliverables);
    const counter = $('#deliverableCounter');
    if (counter) counter.textContent = `${keys.indexOf(key) + 1} of ${keys.length}`;
  };
  $$('.deliverable-tabs button').forEach(b => b.addEventListener('click', () => renderDeliverable(b.dataset.output)));
  const deliverableKeys = Object.keys(deliverables);
  $('.deliverable-prev')?.addEventListener('click', () => {
    const i = deliverableKeys.indexOf(currentDeliverable);
    renderDeliverable(deliverableKeys[(i - 1 + deliverableKeys.length) % deliverableKeys.length]);
  });
  $('.deliverable-next')?.addEventListener('click', () => {
    const i = deliverableKeys.indexOf(currentDeliverable);
    renderDeliverable(deliverableKeys[(i + 1) % deliverableKeys.length]);
  });
  const modal = $('#deliverableModal');
  const openModal = () => { const d = deliverables[currentDeliverable]; $('#modalTitle').textContent = d.title; const img = $('img', modal); img.src = d.image; img.alt = d.alt; modal.showModal(); };
  $('#deliverableOpen').addEventListener('click', openModal);
  $('#deliverableOpenText').addEventListener('click', openModal);
  $('#modalClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

  const preview = $('#briefPreview');
  const previewPanel = $('.brief-preview');
  let briefPrepared = false;
  const waButton = $('#briefWhatsApp');
  const buildBrief = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    return `HAMBARE GEOSURVEYS - PROJECT BRIEF\nFor: Registered Surveyor Hamid Adebare\n\nName: ${data.name || '-'}\nPhone / WhatsApp: ${data.phone || '-'}\nService: ${data.service || '-'}\nLocation: ${data.location || '-'}\nProject stage: ${data.stage || '-'}\nApproximate size: ${data.size || '-'}\nRequired output: ${data.output || '-'}\nAvailable records: ${data.records || '-'}\nPreferred timing: ${data.timing || '-'}\nSite access: ${data.access || '-'}\n\nProject details:\n${data.details || '-'}\n\nPlease review this information and advise on scope, timing and quotation.`;
  };
  const updatePreview = () => {
    briefPrepared = false;
    previewPanel?.classList.remove('ready');
    const any = [...new FormData(form).values()].some(v => String(v).trim());
    waButton.classList.add('disabled');
    waButton.setAttribute('aria-disabled','true');
    waButton.href='#';
    if (!any) { preview.textContent = 'Complete the form to prepare a concise survey enquiry.'; return; }
    const brief = buildBrief(); preview.textContent = brief;
  };
  form.addEventListener('input', () => { updatePreview(); updateFormProgress(); });
  form.addEventListener('reset', () => setTimeout(() => { updatePreview(); updateFormProgress(); showFormStep(0); }, 0));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    $$('[required]', form).forEach(el => { const bad = !el.value.trim(); el.setAttribute('aria-invalid', String(bad)); if (bad) valid = false; });
    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      const invalidStep = formSteps.findIndex(step => step.contains(firstInvalid));
      if (invalidStep >= 0) showFormStep(invalidStep);
      toast('Complete the required fields.');
      firstInvalid?.focus();
      return;
    }
    const brief = buildBrief();
    briefPrepared = true;
    preview.textContent = brief;
    previewPanel?.classList.add('ready');
    waButton.href = waUrl(brief);
    waButton.classList.remove('disabled');
    waButton.removeAttribute('aria-disabled');
    toast('Project brief is ready.');
    if (mobileStepperQuery.matches) previewPanel?.scrollIntoView({behavior:'smooth', block:'start'});
  });
  updateFormProgress();

  $('#copyBrief').addEventListener('click', async () => {
    const text = preview.textContent.trim();
    if (!text || text.startsWith('Complete the form')) { toast('Complete the form first.'); return; }
    try { await navigator.clipboard.writeText(text); toast('Project brief copied.'); }
    catch { toast('Copy was blocked. Select the brief manually.'); }
  });

  const mobileActionBar = $('.mobile-action-bar');
  const heroSection = $('.hero');
  const mobileActionQuery = window.matchMedia('(max-width:720px)');
  const syncMobileActionBar = () => {
    if (!mobileActionBar) return;
    if (!mobileActionQuery.matches) {
      mobileActionBar.classList.remove('is-visible');
      return;
    }
    const heroBottom = heroSection?.getBoundingClientRect().bottom ?? 0;
    mobileActionBar.classList.toggle('is-visible', heroBottom < 120);
  };
  window.addEventListener('scroll', syncMobileActionBar, {passive:true});
  window.addEventListener('resize', syncMobileActionBar);
  mobileActionQuery.addEventListener?.('change', syncMobileActionBar);
  syncMobileActionBar();


  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileCarouselQuery = window.matchMedia('(max-width:720px)');
  const initialiseCarousel = track => {
    const items = [...track.children];
    const controls = document.querySelector(`[data-carousel-controls="${track.id}"]`);
    if (!controls || items.length < 2) return;
    const prev = $('.carousel-prev', controls);
    const next = $('.carousel-next', controls);
    const counter = $('.carousel-counter', controls);
    const dots = $('.carousel-dots', controls);
    dots.innerHTML = items.map((_, i) => `<i class="${i === 0 ? 'is-active' : ''}" data-dot="${i}"></i>`).join('');
    let index = 0;
    let timer = null;
    let raf = null;
    const nearestIndex = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0, dist = Infinity;
      items.forEach((item, i) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const d = Math.abs(center - itemCenter);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    };
    const update = forced => {
      index = typeof forced === 'number' ? forced : nearestIndex();
      counter.textContent = `${index + 1} / ${items.length}`;
      $$('.carousel-dots i', controls).forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };
    const go = nextIndex => {
      index = (nextIndex + items.length) % items.length;
      const item = items[index];
      const left = Math.max(0, item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2);
      track.scrollTo({left, behavior: reducedMotion.matches ? 'auto' : 'smooth'});
      update(index);
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const start = () => {
      stop();
      if (!mobileCarouselQuery.matches || reducedMotion.matches || document.hidden) return;
      const delay = Number(track.dataset.autoplay || 6500);
      timer = setInterval(() => go(index + 1), delay);
    };
    prev.addEventListener('click', () => { go(index - 1); start(); });
    next.addEventListener('click', () => { go(index + 1); start(); });
    track.addEventListener('scroll', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update());
    }, {passive:true});
    ['pointerdown','touchstart','focusin'].forEach(type => track.addEventListener(type, stop, {passive:true}));
    ['pointerup','touchend','focusout'].forEach(type => track.addEventListener(type, start, {passive:true}));
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', start);
    mobileCarouselQuery.addEventListener?.('change', () => { update(); start(); });
    reducedMotion.addEventListener?.('change', start);
    new ResizeObserver(() => update()).observe(track);
    update(0);
    start();
  };
  $$('[data-carousel]').forEach(initialiseCarousel);

  const hero = $('.hero');
  const reticle = $('#heroReticle');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  if (hero && reticle && finePointer.matches) {
    hero.addEventListener('pointermove', e => {
      const rect = hero.getBoundingClientRect();
      reticle.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
    });
    hero.addEventListener('pointerleave', () => { reticle.style.opacity = '0'; });
    hero.addEventListener('pointerenter', () => { reticle.style.opacity = ''; });
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealTargets = $$('.service-card,.process-grid article,.image-card,.deliverable-shell,.finder-result,.company-facts>div,.approach-frame');
    revealTargets.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    }), {threshold: .12, rootMargin: '0px 0px -40px'});
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  const sections = $$('main section[id]');
  const navLinks = $$('#primary-nav a');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }), {rootMargin:'-35% 0px -55%', threshold:0});
    sections.forEach(s => observer.observe(s));
  }
})();
