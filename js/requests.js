/* Glint Request Media: frontend-only preview. No actual Seerr, media search or downloads. */
state.requestQuery='';
state.requestType='All';
state.mediaRequests=getStore('requests',[]);
if(!Array.isArray(state.mediaRequests))state.mediaRequests=[];
state.mediaRequests=state.mediaRequests.filter(x=>x&&D.movies.some(m=>m.id===x.id)).slice(0,50);

function requestMatches(){
  const q=state.requestQuery.trim().toLowerCase();
  return D.movies.filter(m=>(state.requestType==='All'||m.type===state.requestType)&&(!q||(m.title+' '+m.year+' '+m.genre).toLowerCase().includes(q)));
}
function requestCard(m){
  const queued=state.mediaRequests.some(r=>r.id===m.id);
  return `<article class="req-card">
    <div class="req-poster" ${artStyle(m.art)}>${artwork(m.art,'','')}${m.poster?`<img src="${esc(m.poster)}" alt="" loading="lazy" decoding="async" onerror="this.hidden=true">`:''}</div>
    <div class="req-card-body">
      <span class="req-type">${esc(m.type)} · ${esc(m.year)}</span>
      <h3>${esc(m.title)}</h3>
      <p>${esc(m.genre)} · Catalog preview</p>
      <button class="btn ${queued?'outline':'primary'}" data-action="requestAdd" data-id="${esc(m.id)}" ${queued?'disabled':''}>
        ${icon(queued?'check':'plus')} ${queued?'Saved in preview':'Preview request'}
      </button>
    </div>
  </article>`;
}
function requestCatalogResults(){
  const matches=requestMatches();
  return matches.length?`<div class="req-catalog-grid">${matches.map(requestCard).join('')}</div>`:
    `<div class="req-empty">${icon('search')}<h3>Not in the sample catalog</h3>
      <p>Full movie and series discovery will use Seerr once the private backend is connected. This preview only searches the sample titles.</p>
      <button class="btn outline" data-action="requestClearSearch">Clear search</button>
    </div>`;
}
function requestQueue(){
  if(!state.mediaRequests.length)return `<div class="req-empty req-queue-empty">${icon('list')}<h3>No preview requests yet</h3>
    <p>Choose a title from the sample catalog to see how your request list will look.</p></div>`;
  return `<div class="req-list">${state.mediaRequests.slice().reverse().map(r=>{
    const m=D.movies.find(x=>x.id===r.id);
    if(!m)return '';
    return `<article class="req-list-row">
      <div class="req-list-title"><strong>${esc(m.title)}</strong><span>${esc(m.type)} · Local preview only</span></div>
      <div class="req-list-meta"><span class="pill neutral">Not submitted</span><small>ETA unavailable</small></div>
      <button class="req-remove" data-action="requestRemove" data-id="${esc(m.id)}" aria-label="Remove ${esc(m.title)} from local preview">${icon('close')}</button>
    </article>`;
  }).join('')}</div>`;
}
function requests(){
  return `<div class="req-page">
    ${pageHeader('Request media','A little wish list for your next movie night.',`<button class="btn outline" data-route="watch">${icon('play')} Go to Watch</button>`) }
    <section class="req-intro">
      <span class="req-eyebrow">Coming to Glint</span>
      <h2>Want to watch something new?</h2>
      <p>Search for a film or series, submit a request, and follow its journey into the library. When connected, Seerr will coordinate requests with Radarr, Sonarr and Plex.</p>
      <div class="req-warning">${icon('info')} <span><strong>Preview only.</strong> Nothing on this page sends a real request, starts a download, or estimates actual availability. Selections are stored in this browser only.</span></div>
    </section>
    <section class="section" aria-labelledby="req-discover-title">
      <div class="section-heading"><div><h2 id="req-discover-title">Browse sample titles</h2><p class="section-sub">Movie and TV discovery will be powered by Seerr in the connected version.</p></div><span class="req-counter" id="reqCount">${requestMatches().length} titles</span></div>
      <div class="req-tools">
        <label class="req-search">${icon('search')}<input type="search" id="requestSearch" placeholder="Search movies or series" aria-label="Search sample titles" maxlength="100" value="${esc(state.requestQuery)}"></label>
        <div class="req-filters" role="group" aria-label="Content type filter">
        ${['All','Movie','Series'].map(t=>`<button class="filter-chip ${state.requestType===t?'active':''}" data-action="requestType" data-id="${t}" aria-pressed="${state.requestType===t}">${t==='All'?'Everything':t==='Movie'?'Movies':'Series'}</button>`).join('')}</div>
      </div>
      <div id="reqResults" aria-live="polite">${requestCatalogResults()}</div>
    </section>
    <section class="section" aria-labelledby="req-your-title">
      <div class="section-heading"><div><h2 id="req-your-title">Your request preview</h2><p class="section-sub">Locally saved selections, not a shared queue.</p></div><span class="req-counter">${state.mediaRequests.length} saved</span></div>
      ${requestQueue()}
    </section>
    <section class="section req-flow-section" aria-labelledby="req-flow-title">
      <div class="section-heading"><div><h2 id="req-flow-title">How live requests will work</h2><p class="section-sub">The eventual service will show real, verified statuses.</p></div></div>
      <div class="req-flow">${['Requested','Approved','Searching','Downloading','Importing','In Plex'].map((name,i)=>`<div class="req-step"><span>${i+1}</span><strong>${name}</strong></div>`).join('')}</div>
      <p class="req-flow-explain">A download ETA only appears when an actual transfer is active and reports a usable estimate. Before that, the page will show an approval state, a known release date, or “Waiting for availability.” Download estimates can change and may not include importing or Plex scanning.</p>
    </section>
    ${demo('Request Media is a local UI preview. No Seerr account, public request queue, Plex inventory, torrent search or ETA service is connected.')}
  </div>`;
}
featureActions.requestAdd=id=>{
  if(!D.movies.some(m=>m.id===id))return;
  if(state.mediaRequests.some(r=>r.id===id))return;
  state.mediaRequests.push({id:id,createdAt:new Date().toISOString()});
  setStore('requests',state.mediaRequests);
  render();
  toast('Saved only in this browser. No request was sent to Seerr.','Preview request saved');
};
featureActions.requestRemove=id=>{
  state.mediaRequests=state.mediaRequests.filter(r=>r.id!==id);
  setStore('requests',state.mediaRequests);
  render();
  toast('Removed from local preview.','Request preview');
};
featureActions.requestType=id=>{
  if(!['All','Movie','Series'].includes(id))return;
  state.requestType=id;render();
};
featureActions.requestClearSearch=()=>{
  state.requestQuery='';render();document.getElementById('requestSearch')?.focus();
};
featureHooks.input.push(e=>{
  if(e.target.id!=='requestSearch')return;
  state.requestQuery=e.target.value;
  const panel=document.getElementById('reqResults');
  if(panel)panel.innerHTML=requestCatalogResults();
  const count=document.getElementById('reqCount');
  if(count)count.textContent=requestMatches().length+' titles';
});
