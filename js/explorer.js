(() => {
  const STORAGE_KEY = 'parallax-saved-places-v1';

  const attractions = [
    {
      id: 'avatar',
      name: 'Avatar Hallelujah Mountain',
      type: 'Signature viewpoint',
      description: 'One of Zhangjiajie’s most recognisable sandstone-pillar landscapes and a natural first stop for the cinematic experience.',
      tags: ['nature', 'photography'],
    },
    {
      id: 'tianzi',
      name: 'Tianzi Mountain',
      type: 'Panoramic ridge',
      description: 'Known for wide mountain views, dramatic peaks and changing mist — ideal when the goal is scenery and photography.',
      tags: ['nature', 'photography', 'relaxed'],
    },
    {
      id: 'bailong',
      name: 'Bailong Elevator',
      type: 'Vertical landmark',
      description: 'A memorable way to move between elevations and pair the landscape with a distinctly engineered experience.',
      tags: ['adventure', 'photography'],
    },
    {
      id: 'bridge',
      name: 'Zhangjiajie Glass Bridge',
      type: 'Adventure stop',
      description: 'A high-impact stop for travellers who want a more adrenaline-heavy contrast to the quieter mountain viewpoints.',
      tags: ['adventure'],
    },
    {
      id: 'golden-whip',
      name: 'Golden Whip Stream',
      type: 'Valley walk',
      description: 'A slower, ground-level route through the landscape that balances the elevated viewpoints with a calmer walking experience.',
      tags: ['nature', 'relaxed'],
    },
  ];

  const itineraries = {
    nature: ['Golden Whip Stream', 'Avatar Hallelujah Mountain', 'Tianzi Mountain'],
    photography: ['Tianzi Mountain', 'Avatar Hallelujah Mountain', 'Golden Whip Stream'],
    adventure: ['Zhangjiajie Glass Bridge', 'Bailong Elevator', 'Avatar Hallelujah Mountain'],
    relaxed: ['Golden Whip Stream', 'Tianzi Mountain', 'Avatar Hallelujah Mountain'],
  };

  function loadSaved() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  let saved = loadSaved();
  let selectedDays = 2;
  let selectedStyle = 'nature';

  const trigger = document.createElement('button');
  trigger.className = 'explore-trigger hide';
  trigger.type = 'button';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.innerHTML = '<span>Explore Zhangjiajie</span><span class="explore-trigger__icon" aria-hidden="true">↗</span>';

  const hotspotToggle = document.createElement('button');
  hotspotToggle.type = 'button';
  hotspotToggle.className = 'hotspot-toggle hide';
  hotspotToggle.textContent = 'Show places';
  hotspotToggle.setAttribute('aria-pressed', 'false');

  const hotspots = document.createElement('div');
  hotspots.className = 'scene-hotspots';
  hotspots.setAttribute('aria-label', 'Scene points of interest');
  hotspots.innerHTML = `
    <button class="hotspot hotspot--tianzi" data-place="tianzi" type="button"><span class="hotspot__dot"></span><span class="hotspot__label">Tianzi Mountain</span></button>
    <button class="hotspot hotspot--avatar" data-place="avatar" type="button"><span class="hotspot__dot"></span><span class="hotspot__label">Avatar Mountain</span></button>
    <button class="hotspot hotspot--bailong" data-place="bailong" type="button"><span class="hotspot__dot"></span><span class="hotspot__label">Bailong Elevator</span></button>
    <button class="hotspot hotspot--bridge" data-place="bridge" type="button"><span class="hotspot__dot"></span><span class="hotspot__label">Glass Bridge</span></button>
  `;

  const scrim = document.createElement('div');
  scrim.className = 'explorer-scrim';

  const explorer = document.createElement('aside');
  explorer.className = 'destination-explorer';
  explorer.setAttribute('role', 'dialog');
  explorer.setAttribute('aria-modal', 'true');
  explorer.setAttribute('aria-labelledby', 'explorer-title');
  explorer.setAttribute('aria-hidden', 'true');
  explorer.innerHTML = `
    <div class="explorer-header">
      <div class="explorer-header__top">
        <div>
          <div class="explorer-eyebrow">Interactive destination guide</div>
          <h2 class="explorer-title" id="explorer-title">Explore Zhangjiajie</h2>
        </div>
        <button class="explorer-close" type="button" aria-label="Close explorer">×</button>
      </div>
      <div class="explorer-tabs" role="tablist" aria-label="Explorer sections">
        <button class="explorer-tab" type="button" role="tab" data-tab="explore" aria-selected="true">Explore</button>
        <button class="explorer-tab" type="button" role="tab" data-tab="plan" aria-selected="false">Plan</button>
        <button class="explorer-tab" type="button" role="tab" data-tab="saved" aria-selected="false">Saved <span class="saved-count"></span></button>
      </div>
    </div>
    <div class="explorer-content">
      <section class="explorer-panel" data-panel="explore">
        <div class="explorer-search">
          <input type="search" aria-label="Search places" placeholder="Search viewpoints, walks, landmarks…" />
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        </div>
        <p class="explorer-intro">Move beyond the hero scene: discover a few signature places, save the ones you like and use them to shape a lightweight itinerary.</p>
        <div class="attraction-list"></div>
      </section>
      <section class="explorer-panel" data-panel="plan" hidden>
        <div class="plan-block">
          <span class="plan-label">Trip length</span>
          <div class="segmented" aria-label="Trip length">
            <button type="button" data-days="1">1 day</button>
            <button type="button" data-days="2" class="is-active">2 days</button>
            <button type="button" data-days="3">3 days</button>
          </div>
        </div>
        <div class="plan-block">
          <span class="plan-label">Travel style</span>
          <div class="style-options" aria-label="Travel style">
            <button type="button" data-style="nature" class="is-active">Nature</button>
            <button type="button" data-style="photography">Photography</button>
            <button type="button" data-style="adventure">Adventure</button>
            <button type="button" data-style="relaxed">Relaxed</button>
          </div>
          <button class="generate-plan" type="button">Build my route</button>
        </div>
        <div class="plan-block itinerary-result" aria-live="polite">
          <span class="plan-label">Suggested route</span>
          <div class="itinerary-output"></div>
        </div>
      </section>
      <section class="explorer-panel" data-panel="saved" hidden>
        <p class="explorer-intro">Saved places stay on this device, so this little planning layer works without an account or backend.</p>
        <div class="saved-list"></div>
      </section>
    </div>
  `;

  document.body.append(scrim, explorer, hotspots, hotspotToggle, trigger);

  const closeButton = explorer.querySelector('.explorer-close');
  const searchInput = explorer.querySelector('.explorer-search input');
  const attractionList = explorer.querySelector('.attraction-list');
  const savedList = explorer.querySelector('.saved-list');
  const savedCount = explorer.querySelector('.saved-count');
  const tabs = [...explorer.querySelectorAll('.explorer-tab')];
  const panels = [...explorer.querySelectorAll('.explorer-panel')];
  const itineraryOutput = explorer.querySelector('.itinerary-output');
  let lastFocused = null;

  function persistSaved() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved]));
  }

  function attractionCard(place) {
    const isSaved = saved.has(place.id);
    return `
      <article class="attraction-card" data-place-card="${place.id}">
        <div>
          <div class="attraction-card__meta">${place.type}</div>
          <h3>${place.name}</h3>
        </div>
        <button class="save-place${isSaved ? ' is-saved' : ''}" type="button" data-save="${place.id}" aria-label="${isSaved ? 'Remove' : 'Save'} ${place.name}" aria-pressed="${isSaved}">
          <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark" aria-hidden="true"></i>
        </button>
        <p>${place.description}</p>
      </article>`;
  }

  function renderAttractions(query = '') {
    const normalized = query.trim().toLowerCase();
    const matches = attractions.filter((place) =>
      `${place.name} ${place.type} ${place.description}`.toLowerCase().includes(normalized)
    );
    attractionList.innerHTML = matches.length
      ? matches.map(attractionCard).join('')
      : '<div class="no-results">No matching places yet. Try “mountain”, “walk” or “adventure”.</div>';
  }

  function renderSaved() {
    const matches = attractions.filter((place) => saved.has(place.id));
    savedCount.textContent = saved.size ? `(${saved.size})` : '';
    savedList.innerHTML = matches.length
      ? matches.map(attractionCard).join('')
      : '<div class="saved-empty">Nothing saved yet. Bookmark a place from Explore and it will appear here.</div>';
  }

  function setTab(name) {
    tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.tab === name)));
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name;
    });
    if (name === 'saved') renderSaved();
    if (name === 'explore') requestAnimationFrame(() => searchInput.focus());
  }

  function openExplorer(tab = 'explore') {
    lastFocused = document.activeElement;
    document.body.classList.add('explorer-open');
    explorer.setAttribute('aria-hidden', 'false');
    setTab(tab);
    if (tab !== 'explore') requestAnimationFrame(() => closeButton.focus());
  }

  function closeExplorer() {
    document.body.classList.remove('explorer-open');
    explorer.setAttribute('aria-hidden', 'true');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function toggleSave(id) {
    if (saved.has(id)) saved.delete(id);
    else saved.add(id);
    persistSaved();
    renderAttractions(searchInput.value);
    renderSaved();
  }

  function buildItinerary() {
    const preferredSaved = attractions.filter((place) => saved.has(place.id)).map((place) => place.name);
    const styleRoute = itineraries[selectedStyle];
    const route = [...new Set([...preferredSaved, ...styleRoute])];
    const slotsPerDay = selectedDays === 1 ? 3 : 2;

    const days = Array.from({ length: selectedDays }, (_, index) => {
      const start = index * slotsPerDay;
      const stops = route.slice(start, start + slotsPerDay);
      if (!stops.length) stops.push(route[index % route.length]);
      return stops;
    });

    itineraryOutput.innerHTML = days
      .map((stops, index) => `
        <div class="itinerary-day">
          <strong>Day ${index + 1}</strong>
          <span>${stops.join(' → ')}</span>
        </div>`)
      .join('');
  }

  trigger.addEventListener('click', () => openExplorer('explore'));
  scrim.addEventListener('click', closeExplorer);
  closeButton.addEventListener('click', closeExplorer);

  tabs.forEach((tab) => tab.addEventListener('click', () => setTab(tab.dataset.tab)));
  searchInput.addEventListener('input', () => renderAttractions(searchInput.value));

  explorer.addEventListener('click', (event) => {
    const saveButton = event.target.closest('[data-save]');
    if (saveButton) toggleSave(saveButton.dataset.save);

    const dayButton = event.target.closest('[data-days]');
    if (dayButton) {
      selectedDays = Number(dayButton.dataset.days);
      explorer.querySelectorAll('[data-days]').forEach((button) => button.classList.toggle('is-active', button === dayButton));
    }

    const styleButton = event.target.closest('[data-style]');
    if (styleButton) {
      selectedStyle = styleButton.dataset.style;
      explorer.querySelectorAll('[data-style]').forEach((button) => button.classList.toggle('is-active', button === styleButton));
    }

    if (event.target.closest('.generate-plan')) buildItinerary();
  });

  hotspotToggle.addEventListener('click', () => {
    const visible = document.body.classList.toggle('hotspots-visible');
    hotspotToggle.textContent = visible ? 'Hide places' : 'Show places';
    hotspotToggle.setAttribute('aria-pressed', String(visible));
  });

  hotspots.addEventListener('click', (event) => {
    const hotspot = event.target.closest('[data-place]');
    if (!hotspot) return;
    const place = attractions.find((item) => item.id === hotspot.dataset.place);
    if (!place) return;
    openExplorer('explore');
    searchInput.value = place.name;
    renderAttractions(place.name);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('explorer-open')) closeExplorer();
  });

  const existingSearch = document.querySelector('.search');
  if (existingSearch) {
    existingSearch.setAttribute('role', 'button');
    existingSearch.setAttribute('tabindex', '0');
    existingSearch.setAttribute('aria-label', 'Search places');
    existingSearch.addEventListener('click', () => openExplorer('explore'));
    existingSearch.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') openExplorer('explore');
    });
  }

  const existingMenu = document.querySelector('.hamburger');
  if (existingMenu) {
    existingMenu.setAttribute('role', 'button');
    existingMenu.setAttribute('tabindex', '0');
    existingMenu.setAttribute('aria-label', 'Open trip planner');
    existingMenu.addEventListener('click', () => openExplorer('plan'));
    existingMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') openExplorer('plan');
    });
  }

  renderAttractions();
  renderSaved();
  buildItinerary();
})();
