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
  $$('.hero-shortcuts button').forEach(b => b.addEventListener('click', () => { renderFinder(b.dataset.solution); $('#solutions').scrollIntoView({behavior:'smooth'}); }));

  const form = $('#scopeForm');
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
    $('#brief').scrollIntoView({behavior:'smooth'});
    toast('Suggested service added to the project brief.');
  };
  $('#finderCta').addEventListener('click', () => applySolution(currentSolution));
  $$('.service-request').forEach(b => b.addEventListener('click', () => { chooseOption('service', b.dataset.service); $('#brief').scrollIntoView({behavior:'smooth'}); toast('Service added to the project brief.'); }));

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
  };
  $$('.deliverable-tabs button').forEach(b => b.addEventListener('click', () => renderDeliverable(b.dataset.output)));
  const modal = $('#deliverableModal');
  const openModal = () => { const d = deliverables[currentDeliverable]; $('#modalTitle').textContent = d.title; const img = $('img', modal); img.src = d.image; img.alt = d.alt; modal.showModal(); };
  $('#deliverableOpen').addEventListener('click', openModal);
  $('#deliverableOpenText').addEventListener('click', openModal);
  $('#modalClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

  const preview = $('#briefPreview');
  const waButton = $('#briefWhatsApp');
  const buildBrief = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    return `HAMBARE GEOSURVEYS - PROJECT BRIEF\nFor: Registered Surveyor Hamid Adebare\n\nName: ${data.name || '-'}\nPhone / WhatsApp: ${data.phone || '-'}\nService: ${data.service || '-'}\nLocation: ${data.location || '-'}\nProject stage: ${data.stage || '-'}\nApproximate size: ${data.size || '-'}\nRequired output: ${data.output || '-'}\nAvailable records: ${data.records || '-'}\nPreferred timing: ${data.timing || '-'}\nSite access: ${data.access || '-'}\n\nProject details:\n${data.details || '-'}\n\nPlease review this information and advise on scope, timing and quotation.`;
  };
  const updatePreview = () => {
    const any = [...new FormData(form).values()].some(v => String(v).trim());
    waButton.classList.add('disabled');
    waButton.setAttribute('aria-disabled','true');
    waButton.href='#';
    if (!any) { preview.textContent = 'Complete the form to prepare a concise survey enquiry.'; return; }
    const brief = buildBrief(); preview.textContent = brief;
  };
  form.addEventListener('input', updatePreview);
  form.addEventListener('reset', () => setTimeout(updatePreview, 0));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    $$('[required]', form).forEach(el => { const bad = !el.value.trim(); el.setAttribute('aria-invalid', String(bad)); if (bad) valid = false; });
    if (!valid) { toast('Complete the required fields.'); form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const brief = buildBrief(); preview.textContent = brief; waButton.href = waUrl(brief); waButton.classList.remove('disabled'); waButton.removeAttribute('aria-disabled'); toast('Project brief is ready.');
  });
  $('#copyBrief').addEventListener('click', async () => {
    const text = preview.textContent.trim();
    if (!text || text.startsWith('Complete the form')) { toast('Complete the form first.'); return; }
    try { await navigator.clipboard.writeText(text); toast('Project brief copied.'); }
    catch { toast('Copy was blocked. Select the brief manually.'); }
  });

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
