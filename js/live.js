/* A clock-derived picture and transport simulation. No media is fetched. */
const LIVE_SLOT_MS = 30 * 60 * 1000;
const liveSession = { pausedAt: null, guide: false, timer: null, immersive: false, returnFocus: null };

function currentProgram(channel, at = Date.now()) {
  const date = new Date(at), slot = date.getHours() * 2 + Math.floor(date.getMinutes() / 30);
  const start = new Date(at);
  start.setMinutes(Math.floor(start.getMinutes() / 30) * 30, 0, 0);
  return { title: channel.shows[slot % channel.shows.length], next: channel.shows[(slot + 1) % channel.shows.length], percent: (at - start.getTime()) / LIVE_SLOT_MS * 100, slot, start: start.getTime(), end: start.getTime() + LIVE_SLOT_MS };
}
function liveTime(at) { return new Date(at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function liveChannel() { return D.channels.find(channel => channel.num === state.channel) || D.channels[0]; }
function livePosition(now = Date.now()) {
  if (state.paused && liveSession.pausedAt) {
    liveSession.pausedAt = Math.max(liveSession.pausedAt, now - LIVE_SLOT_MS);
    state.offset = (now - liveSession.pausedAt) / 1000;
    return liveSession.pausedAt;
  }
  return now - Math.min(Math.max(Number(state.offset) || 0, 0), 1800) * 1000;
}
function liveChannelButton(channel, compact = false) {
  const program = currentProgram(channel), selected = channel.num === liveChannel().num;
  return `<button class="live-channel ${selected ? 'is-selected' : ''} ${compact ? 'is-compact' : ''}" data-action="tune" data-id="${channel.num}" aria-pressed="${selected}" aria-label="Tune to ${esc(channel.name)}, channel ${channel.num}"><span class="live-channel-no">${channel.num}</span><span class="live-channel-copy"><strong>${esc(channel.name)}</strong><span data-channel-title="${channel.num}">${esc(program.title)}</span><span class="live-channel-progress" aria-hidden="true"><i data-channel-progress="${channel.num}" style="width:${program.percent}%"></i></span></span><span class="live-channel-signal" aria-hidden="true">${icon('radio')}</span></button>`;
}
function liveGuide() {
  const current = currentProgram(liveChannel());
  return `<section class="section live-guide-section" aria-labelledby="live-guide-title"><div class="section-heading"><div><h2 id="live-guide-title">The TV guide</h2><p class="section-sub">A little less choosing. A little more discovering.</p></div><span class="live-guide-date">${new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}<span>Sample schedule</span></span></div><p class="live-guide-hint">Swipe or scroll to explore the next two hours. Select a program for details.</p><div class="live-guide-scroll" role="region" aria-label="Six-channel sample television guide, scroll horizontally for upcoming programs" tabindex="0"><div class="live-guide-grid"><div class="live-guide-head live-guide-corner">Channel <span>Local time</span></div>${[0,1,2,3].map(index => `<div class="live-guide-head" data-guide-time="${index}">${liveTime(current.start + index * LIVE_SLOT_MS)}</div>`).join('')}${D.channels.map(channel => `<button class="live-guide-station ${channel.num === state.channel ? 'is-selected' : ''}" data-action="tune" data-id="${channel.num}" aria-label="Tune to ${esc(channel.name)}"><b>${channel.num}</b><span>${esc(channel.name)}</span></button>${[0,1,2,3].map(index => { const program = currentProgram(channel, current.start + index * LIVE_SLOT_MS); return `<button class="live-guide-program ${index === 0 ? 'is-now' : ''}" data-action="liveProgram" data-id="${channel.num}|${program.start}" data-guide-channel="${channel.num}" data-guide-index="${index}"><span>${index === 0 ? 'On now' : liveTime(program.start)}</span><strong>${esc(program.title)}</strong><small>${esc(channel.genre)}</small></button>`; }).join('')}`).join('')}<span class="live-now-line" id="live-now-line" aria-hidden="true" style="--now-fraction:${current.percent / 400}"><span>Now</span></span></div></div></section>`;
}
function live() {
  const channel = liveChannel(), playing = currentProgram(channel, livePosition());
  return `<div class="live-heading"><div><span class="live-eyebrow">Glint Live</span><h1>Something good is on.</h1><p>Six channels. Familiar favorites. Settle into the moment.</p></div><button class="btn outline live-recordings-button" data-action="recordings">${icon('record')} My recordings <span data-live-recordings-count>${state.recordings.length}</span></button></div>
  <div class="live-room"><section class="live-cinema" id="live-cinema" aria-label="Simulated television player">
    <div class="live-screen" id="live-stage-art" ${artStyle(channel.theme)} tabindex="0" aria-label="Simulated channel screen. Space to pause, left and right arrows to seek, Page Up and Page Down to change channel, F for fullscreen."><div class="live-screen-top"><span class="live-station-mark"><b id="live-channel-number">${channel.num}</b><span id="live-channel-name">${esc(channel.name)}</span></span><span class="live-demo-tag">Picture preview</span></div><div class="live-screen-copy"><span class="live-on-air" id="live-status">On now · sample schedule</span><h2 id="live-program-title">${esc(playing.title)}</h2><p><span id="live-program-time">${liveTime(playing.start)} – ${liveTime(playing.end)}</span><span id="live-program-genre">${esc(channel.genre)}</span></p></div><span class="live-picture-caption">Original station artwork · no video stream</span></div>
    <div class="live-transport"><div class="live-timeline-meta"><span id="live-start-time">${liveTime(playing.start)}</span><span id="live-position-label">At the live edge</span><span id="live-end-time">${liveTime(playing.end)}</span></div><div class="live-scrub" role="progressbar" id="live-progress" aria-label="Simulated program progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(playing.percent)}"><span id="live-progress-fill" style="width:${playing.percent}%"></span></div>
    <div class="live-controls-row"><div class="live-play-controls"><button class="live-icon-button" data-action="channelStep" data-id="-1" aria-label="Previous channel" title="Previous channel (Page Up)">${icon('back')}</button><button class="live-icon-button" data-action="liveRewind" aria-label="Rewind 15 seconds in the demo" title="Rewind 15 seconds (left arrow)">${icon('rewind')}<small>15</small></button><button class="live-icon-button live-play-button" id="live-pause" data-action="pause" aria-label="${state.paused ? 'Resume' : 'Pause'} simulated playback" title="Pause or resume (Space)">${icon(state.paused ? 'play' : 'pause')}</button><button class="live-icon-button" data-action="liveForward" aria-label="Fast-forward 15 seconds in the demo" title="Forward 15 seconds (right arrow)">${icon('forward')}<small>15</small></button><button class="live-icon-button" data-action="channelStep" data-id="1" aria-label="Next channel" title="Next channel (Page Down)">${icon('chev')}</button></div><button class="live-edge-button" id="live-go-live" data-action="goLive"><span></span> Go live</button><div class="live-view-controls"><button class="live-icon-button" data-action="liveMiniGuide" aria-label="Open compact channel guide" aria-expanded="${liveSession.guide}" aria-controls="live-mini-guide" title="Compact guide (G)">${icon('list')}</button><button class="live-icon-button" id="live-fullscreen-button" data-action="liveFullscreen" aria-label="Enter fullscreen player" aria-pressed="false" title="Fullscreen (F)">${icon('maximize')}</button></div></div>
    <div class="live-dvr-row"><span class="live-next"><span>Up next</span><strong id="live-next-title">${esc(playing.next)}</strong></span><div class="live-dvr-actions"><button data-action="restart">${icon('restart')} Restart</button><button id="live-record-button" data-action="record">${icon('record')} <span>Record</span></button></div></div></div>
    <div class="live-mini-guide" id="live-mini-guide" ${liveSession.guide ? '' : 'hidden'}><div class="live-mini-heading"><strong>Find your channel</strong><button class="live-icon-button" data-action="liveMiniGuide" aria-label="Close compact guide">${icon('close')}</button></div><div class="live-mini-channels">${D.channels.map(channel => liveChannelButton(channel, true)).join('')}</div></div></section>
    <aside class="live-lineup" aria-label="Channel lineup"><div class="live-lineup-heading"><h2>On air</h2><span>6 channels</span></div><div class="live-lineup-channels">${D.channels.map(channel => liveChannelButton(channel)).join('')}</div><p class="live-lineup-note">A sample schedule, always in motion.</p></aside></div>
    <div class="live-footnote"><span>${icon('info')} Interactive TV preview. Playback and DVR controls are simulated.</span><button data-action="liveHelp">Keyboard shortcuts ${icon('chev')}</button></div>${liveGuide()}<div class="live-bottom-note"><span>${icon('clock')} Your own pace</span><p>Pause, rewind, or restart within a 30-minute sample buffer. “Record” saves a local program bookmark, never a video file.</p></div>`;
}

function updateLiveUI() {
  if (state.route !== 'live' || !$('#live-cinema')) return;
  const channel = liveChannel(), now = Date.now(), playing = currentProgram(channel, livePosition(now)), scheduled = currentProgram(channel, now);
  const setText = (selector, text) => { const element = $(selector); if (element && element.textContent !== String(text)) element.textContent = text; };
  setText('#live-channel-number', channel.num); setText('#live-channel-name', channel.name); setText('#live-program-title', playing.title);
  setText('#live-program-time', `${liveTime(playing.start)} – ${liveTime(playing.end)}`); setText('#live-program-genre', channel.genre);
  setText('#live-start-time', liveTime(playing.start)); setText('#live-end-time', liveTime(playing.end)); setText('#live-next-title', playing.next);
  setText('#live-status', state.paused ? 'Paused · picture preview' : state.offset > 1 ? 'Timeshift preview' : 'On now · sample schedule');
  const delay = Math.round(state.offset);
  setText('#live-position-label', delay > 1 ? `${Math.floor(delay / 60)}:${String(delay % 60).padStart(2, '0')} behind live${state.paused ? ' · paused' : ''}` : state.paused ? 'Paused at the live edge' : 'At the live edge');
  $('#live-stage-art').setAttribute('style', artStyle(channel.theme).slice(7, -1));
  $('#live-progress-fill').style.width = `${playing.percent}%`; $('#live-progress').setAttribute('aria-valuenow', String(Math.round(playing.percent)));
  $('#live-progress').setAttribute('aria-valuetext', `${Math.round(playing.percent)} percent of ${playing.title}`);
  const pause = $('#live-pause');
  if (pause.dataset.paused !== String(state.paused)) { pause.innerHTML = icon(state.paused ? 'play' : 'pause'); pause.dataset.paused = String(state.paused); }
  pause.setAttribute('aria-label', `${state.paused ? 'Resume' : 'Pause'} simulated playback`);
  $('#live-go-live').classList.toggle('at-live-edge', !state.paused && state.offset < 1);
  const recorded = state.recordings.some(item => item.channel === channel.num && item.title === playing.title);
  $('#live-record-button').classList.toggle('is-recorded', recorded);
  $('#live-record-button').setAttribute('aria-label', recorded ? 'Program bookmarked in My recordings' : 'Save a virtual recording bookmark');
  setText('#live-record-button span', recorded ? 'Saved' : 'Record');
  document.querySelectorAll('[data-live-recordings-count]').forEach(element => element.textContent = String(state.recordings.length));
  document.querySelectorAll('.live-channel, .live-guide-station').forEach(element => { const active = element.dataset.id === channel.num; element.classList.toggle('is-selected', active); element.setAttribute('aria-pressed', String(active)); });
  for (const station of D.channels) {
    const program = currentProgram(station, now);
    document.querySelectorAll(`[data-channel-title="${station.num}"]`).forEach(element => { if (element.textContent !== program.title) element.textContent = program.title; });
    document.querySelectorAll(`[data-channel-progress="${station.num}"]`).forEach(element => element.style.width = `${program.percent}%`);
  }
  document.querySelectorAll('[data-guide-time]').forEach(element => { element.textContent = liveTime(scheduled.start + Number(element.dataset.guideTime) * LIVE_SLOT_MS); });
  document.querySelectorAll('[data-guide-channel]').forEach(element => {
    const station = D.channels.find(item => item.num === element.dataset.guideChannel), index = Number(element.dataset.guideIndex), program = currentProgram(station, scheduled.start + index * LIVE_SLOT_MS);
    element.dataset.id = `${station.num}|${program.start}`;
    if (element.querySelector('strong').textContent !== program.title) element.querySelector('strong').textContent = program.title;
    element.querySelector('span').textContent = index === 0 ? 'On now' : liveTime(program.start);
    element.setAttribute('aria-label', `${program.title}, ${station.name}, ${liveTime(program.start)} to ${liveTime(program.end)}, sample program details`);
  });
  $('#live-now-line').style.setProperty('--now-fraction', String(scheduled.percent / 400));
}
function tuneLive(id) {
  if (!D.channels.some(channel => channel.num === String(id))) return;
  state.channel = String(id); state.offset = 0; state.paused = false; liveSession.pausedAt = null;
  if (state.route !== 'live') { liveSession.guide = false; route('live'); } else updateLiveUI();
}
function seekLive(seconds) {
  const now = Date.now(), next = Math.max(now - LIVE_SLOT_MS, Math.min(now, livePosition(now) + seconds * 1000));
  state.offset = Math.max(0, (now - next) / 1000); if (state.paused) liveSession.pausedAt = next; updateLiveUI();
}
function liveProgramDetails(id) {
  const [number, at] = String(id).split('|'), channel = D.channels.find(item => item.num === number);
  if (!channel || !Number.isFinite(Number(at))) return;
  const program = currentProgram(channel, Number(at)), upcoming = program.start > Date.now();
  tuneLive(number);
  showModal(`${modalHeader(program.title)}<div class="modal-body"><div class="live-program-art" ${artStyle(channel.theme)}><span>${channel.num}</span><strong>${esc(channel.name)}</strong></div><div class="detail-meta"><span>${esc(channel.genre)}</span><span>${liveTime(program.start)} – ${liveTime(program.end)}</span><span>Sample program</span></div><p class="detail-desc">${upcoming ? 'Coming up in the sample schedule. You’re now tuned to this channel’s current program.' : 'You’re tuned to this channel’s current program. Settle in, explore the guide, or save a virtual recording bookmark.'}</p><div class="live-detail-actions"><button class="btn primary" data-action="close">${icon('tv')} Back to channel</button><button class="btn outline" data-action="liveRecordProgram" data-id="${channel.num}|${program.start}">${icon('record')} Save bookmark</button></div><p class="devnote">Schedule slots are illustrative and do not represent actual episode or film runtimes. No stream is connected.</p></div>`);
}
function saveLiveRecording(channel, program) {
  if (state.recordings.some(item => item.channel === channel.num && item.title === program.title)) { toast('This program is already in My recordings.', 'Already saved'); return; }
  state.recordings.unshift({ channel: channel.num, title: program.title, saved: new Date().toISOString(), start: program.start });
  setStore('recordings', state.recordings); updateLiveUI(); toast('Program bookmark saved in this browser. No video was recorded.', 'Saved to My recordings');
}
function showLiveRecordings() {
  const content = state.recordings.length ? `<div class="live-recording-list">${state.recordings.map((item, index) => { const channel = D.channels.find(station => station.num === item.channel); return `<article class="live-recording"><div class="live-recording-icon">${icon('record')}</div><div><strong>${esc(item.title)}</strong><p>${esc(channel?.name || 'Channel ' + item.channel)}<span>Local bookmark</span></p></div><button class="live-icon-button" data-action="liveRemoveRecording" data-id="${index}" aria-label="Remove ${esc(item.title)} bookmark">${icon('close')}</button></article>`; }).join('')}</div>` : `<div class="empty-state">${icon('record')}<strong>A little something for later.</strong><p>Use Record while watching a sample channel to save your first program bookmark here.</p></div>`;
  showModal(`${modalHeader('My recordings')}<div class="modal-body"><p class="live-recordings-intro">Your virtual DVR shelf. These are local bookmarks, not recorded video files.</p>${content}</div>`);
}
function setLiveImmersive(active) {
  liveSession.immersive = active; $('#live-cinema')?.classList.toggle('live-immersive', active); document.body.classList.toggle('live-is-immersive', active);
  const button = $('#live-fullscreen-button'); button?.setAttribute('aria-pressed', String(active)); button?.setAttribute('aria-label', `${active ? 'Exit' : 'Enter'} fullscreen player`);
  if (active) $('#live-stage-art')?.focus({ preventScroll: true }); else if (liveSession.returnFocus?.isConnected) liveSession.returnFocus.focus({ preventScroll: true });
}
async function toggleLiveFullscreen() {
  const cinema = $('#live-cinema'); if (!cinema) return;
  if (liveSession.immersive) { if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen().catch(() => {}); setLiveImmersive(false); return; }
  liveSession.returnFocus = document.activeElement; setLiveImmersive(true);
  if (cinema.requestFullscreen) await cinema.requestFullscreen().catch(() => {}); // CSS fullscreen remains available when the native API is unavailable.
}
Object.assign(featureActions, {
  tune: tuneLive,
  channelStep: id => { const index = D.channels.findIndex(channel => channel.num === liveChannel().num); tuneLive(D.channels[(index + Number(id) + D.channels.length) % D.channels.length].num); },
  pause: () => { const position = livePosition(); state.paused = !state.paused; liveSession.pausedAt = state.paused ? position : null; updateLiveUI(); },
  liveRewind: () => seekLive(-15), liveForward: () => seekLive(15),
  goLive: () => { state.offset = 0; state.paused = false; liveSession.pausedAt = null; updateLiveUI(); },
  restart: () => { const now = Date.now(), program = currentProgram(liveChannel(), livePosition(now)); state.offset = Math.min(1800, (now - program.start) / 1000); state.paused = false; liveSession.pausedAt = null; updateLiveUI(); toast('Restarted the sample program within the virtual 30-minute buffer.', 'Playback preview'); },
  record: () => saveLiveRecording(liveChannel(), currentProgram(liveChannel(), livePosition())), recordings: showLiveRecordings,
  liveRemoveRecording: id => { const index = Number(id); if (!Number.isInteger(index) || index < 0 || index >= state.recordings.length) return; state.recordings.splice(index, 1); setStore('recordings', state.recordings); updateLiveUI(); showLiveRecordings(); },
  liveRecordProgram: id => { const [number, at] = String(id).split('|'), channel = D.channels.find(item => item.num === number); if (channel && Number.isFinite(Number(at))) saveLiveRecording(channel, currentProgram(channel, Number(at))); },
  liveProgram: liveProgramDetails,
  liveMiniGuide: () => { liveSession.guide = !liveSession.guide; const panel = $('#live-mini-guide'); if (!panel) return; panel.hidden = !liveSession.guide; const button = $('[aria-controls="live-mini-guide"]'); button?.setAttribute('aria-expanded', String(liveSession.guide)); if (liveSession.guide) panel.querySelector('.live-channel.is-selected')?.focus({ preventScroll: true }); else button?.focus({ preventScroll: true }); },
  liveFullscreen: toggleLiveFullscreen,
  liveHelp: () => showModal(`${modalHeader('Your TV remote')}<div class="modal-body"><p class="live-recordings-intro">Focus the picture to use these shortcuts. All playback controls are simulated.</p><dl class="live-shortcuts"><div><dt>Pause or resume</dt><dd><kbd>Space</kbd></dd></div><div><dt>Seek 15 seconds</dt><dd><kbd>←</kbd> <kbd>→</kbd></dd></div><div><dt>Previous / next channel</dt><dd><kbd>Page Up</kbd> <kbd>Page Down</kbd></dd></div><div><dt>Compact guide</dt><dd><kbd>G</kbd></dd></div><div><dt>Fullscreen</dt><dd><kbd>F</kbd></dd></div><div><dt>Close guide / fullscreen</dt><dd><kbd>Esc</kbd></dd></div></dl></div>`)
});
featureHooks.render.push(() => {
  clearInterval(liveSession.timer); liveSession.timer = null;
  if (liveSession.immersive && !$('#live-cinema')) setLiveImmersive(false);
  if (state.route === 'live' && $('#live-cinema')) { updateLiveUI(); liveSession.timer = setInterval(updateLiveUI, 1000); }
});
featureHooks.keydown.push(event => {
  if (state.route !== 'live' || !$('#live-cinema') || $('#portal').children.length || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key === 'Escape') { if (liveSession.guide) { event.preventDefault(); featureActions.liveMiniGuide(); } else if (liveSession.immersive) { event.preventDefault(); toggleLiveFullscreen(); } return; }
  if (liveSession.immersive && event.key === 'Tab') {
    const items = Array.from($('#live-cinema').querySelectorAll('button:not([disabled]), [tabindex="0"]')).filter(element => element.getClientRects().length), first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } return;
  }
  if (!document.activeElement?.closest('#live-cinema') || ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
  const key = event.key.toLowerCase();
  if (key === ' ' && document.activeElement.tagName !== 'BUTTON') { event.preventDefault(); featureActions.pause(); }
  else if (key === 'arrowleft') { event.preventDefault(); seekLive(-15); } else if (key === 'arrowright') { event.preventDefault(); seekLive(15); }
  else if (key === 'pageup' || key === 'pagedown') { event.preventDefault(); featureActions.channelStep(key === 'pageup' ? -1 : 1); }
  else if (key === 'f') { event.preventDefault(); toggleLiveFullscreen(); } else if (key === 'g') { event.preventDefault(); featureActions.liveMiniGuide(); }
});
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && liveSession.immersive) setLiveImmersive(false); });
