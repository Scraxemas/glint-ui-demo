async page => {
  const root=page.url().split('#')[0], passed=[],failed=[],errors=[];
  await page.goto(root);await page.reload();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  const check=(value,label)=>{if(!value)throw Error(label);};
  const test=async(name,run)=>{try{await run();passed.push(name);}catch(error){failed.push({name,error:error.message.slice(0,600)});await page.keyboard.press('Escape').catch(()=>{});}};
  const go=async(route)=>{await page.goto(root+'#'+route);await page.locator('main h1').waitFor();};
  const action=(name,id)=>page.locator(`[data-action="${name}"]:not(#app[inert] *)${id?`[data-id="${id}"]`:''}`).filter({visible:true}).first();
  const close=async()=>{if(await page.locator('.modal-close').count())await page.locator('.modal-close').click();};
  await page.setViewportSize({width:1440,height:1000});
  await go('home');
  await page.evaluate(()=>{for(const key of Object.keys(localStorage))if(key.startsWith('glint_'))localStorage.removeItem(key);});
  await page.reload();
  await test('Keyboard search, results, focus trap and dismissal',async()=>{
    await page.keyboard.press('Control+k');await page.locator('#globalSearch').fill('interstellar');
    check(await page.locator('.search-result').count()===1,'Expected one matching title');
    await page.keyboard.press('Tab');check(await page.evaluate(()=>!!document.activeElement.closest('.modal')),'Focus escaped dialog');
    await action('searchResult','interstellar').click();check(await page.locator('#dialog-title').textContent()==='Interstellar','Search result did not open details');
    await page.keyboard.press('Escape');check(await page.locator('.modal').count()===0,'Escape did not dismiss');
    check(await page.evaluate(()=>!document.querySelector('#app').inert),'App remained inert');
  });
  await test('Watch genres, search, empty state, sort and list persistence',async()=>{
    await go('watch');await action('watchFilter','Anime').click();check(await page.locator('#watchResults .media-card').count()===2,'Anime filtering failed');
    await page.locator('#watchSearch').fill('nothing matches 123');check(await page.locator('.media-empty').count()===1,'Missing empty state');
    await action('mediaReset').click();await page.locator('#watchSearch').fill('interstellar');check(await page.locator('#watchResults .media-card').count()===1,'Search failed');
    await page.locator('#watchSort').selectOption('title');await page.locator('#watchResults .media-card').first().click();
    await action('watchlist','interstellar').click();check(await action('watchlist','interstellar').getAttribute('aria-pressed')==='true','Watchlist not added');
    await close();await page.reload();await action('watchFilter','My List').click();check(await page.locator('#watchResults .media-card').count()===1,'Watchlist did not persist');
  });
  await test('Simulated player pause, seek, captions, mute and fullscreen',async()=>{
    await go('home');await action('fakePlay','interstellar').click();
    const initial=await page.locator('#mediaSeek').inputValue();await action('mediaSkip','15').click();check(Number(await page.locator('#mediaSeek').inputValue())===Number(initial)+15,'Skip failed');
    await action('mediaPause').click();check(await page.locator('#mediaPause').getAttribute('aria-label')==='Pause simulation','Play state failed');
    await action('mediaPause').click();await action('mediaCaptions').click();check(await page.locator('#mediaCaption').isVisible(),'Captions failed');
    await action('mediaMute').click();check(await page.locator('#mediaMute').getAttribute('aria-pressed')==='true','Mute failed');
    await action('mediaFullscreen','mediaPlayer').click();check(await page.evaluate(()=>document.fullscreenElement?.id)==='mediaPlayer','Player fullscreen failed');
    await action('mediaFullscreen','mediaPlayer').click();await close();
  });
  await test('Series episode preview',async()=>{await go('watch');await page.locator('.media-card[data-id="the-last-of-us"]').first().click();check(await page.locator('.media-episode').count()===3,'Sample episodes missing');await page.locator('.media-episode').nth(1).click();check(await page.locator('.media-player-title').textContent().then(t=>t.includes('Sample episode 2')),'Episode launch failed');await close();});
  await test('Live six channels, progress, pause, timeshift, restart and live edge',async()=>{
    await go('live');check(await page.locator('.live-lineup .live-channel').count()===6,'Expected six canonical channels');
    await page.locator('.live-lineup [data-id="103"]').click();check(await page.locator('#live-channel-name').textContent()==='Glint Cinema','Tune failed');
    await action('pause').click();check((await page.locator('#live-pause').getAttribute('aria-label')).includes('Resume'),'Pause failed');
    const value=await page.locator('#live-progress-fill').getAttribute('style');await page.waitForTimeout(1100);check(await page.locator('#live-progress-fill').getAttribute('style')===value,'Paused progress moved');
    await action('liveRewind').click();check((await page.locator('#live-position-label').textContent()).includes('behind live'),'Rewind failed');
    await action('liveForward').click();await action('restart').click();check(Number(await page.locator('#live-progress').getAttribute('aria-valuenow'))<=1,'Restart failed');
    await action('goLive').click();check(await page.locator('#live-position-label').textContent()==='At the live edge','Go live failed');
    await action('channelStep','1').click();check(await page.locator('#live-channel-number').textContent()==='105','Channel surf failed');
  });
  await test('Live guide, virtual recordings, compact guide and fullscreen',async()=>{
    await action('record').click();await action('recordings').click();check(await page.locator('.live-recording').count()===1,'Record bookmark failed');await close();
    await action('liveMiniGuide').click();check(await page.locator('#live-mini-guide').isVisible(),'Compact guide failed');await page.keyboard.press('Escape');check(!await page.locator('#live-mini-guide').isVisible(),'Compact guide dismissal failed');
    await page.locator('[data-guide-channel="108"][data-guide-index="1"]').click();check((await page.locator('.detail-desc').textContent()).includes('Coming up'),'Upcoming program details failed');await close();
    await action('liveFullscreen').click();check(await page.locator('#live-cinema').evaluate(e=>e.classList.contains('live-immersive')),'Live fullscreen failed');await action('liveFullscreen').click();
    await page.reload();await action('recordings').click();check(await page.locator('.live-recording').count()===1,'DVR bookmarks not persisted');await close();
  });
  await test('Comics filters, search, reader navigation, RTL and bookmark persistence',async()=>{
    await go('comics');await action('comicFilter','Manga').click();check(await page.locator('#comicResults .comic-card').count()===6,'Manga filter failed');
    await page.locator('#comicSearch').fill('One Piece');check(await page.locator('#comicResults .comic-card').count()===1,'Comic search failed');
    await page.locator('#comicResults .comic-card').click();await action('readComic','one-piece').click();
    await action('readerNext').click();check((await page.locator('#readerPageNumber').textContent()).includes('2 of 12'),'Next page failed');
    await page.locator('#readerCanvas').focus();await page.keyboard.press('ArrowRight');check((await page.locator('#readerPageNumber').textContent()).includes('3 of 12'),'Keyboard reading failed');
    await action('readerDirection').click();await page.locator('#readerCanvas').focus();await page.keyboard.press('ArrowLeft');check((await page.locator('#readerPageNumber').textContent()).includes('4 of 12'),'RTL failed');
    await page.locator('#readerPageSelect').selectOption('8');check((await page.locator('#readerPageNumber').textContent()).includes('8 of 12'),'Page picker failed');
    await action('readerMode').click();check(await page.locator('.reader-sheet').count()===12,'Scroll mode missing pages');
    await action('readerMode').click();await close();await page.reload();await action('readComic','one-piece').first().click();check((await page.locator('#readerPageNumber').textContent()).includes('8 of 12'),'Bookmark did not persist');
    await action('mediaFullscreen','mediaReader').click();check(await page.evaluate(()=>document.fullscreenElement?.id)==='mediaReader','Reader fullscreen failed');await action('mediaFullscreen','mediaReader').click();
    await page.screenshot({path:'docs/screenshots/reader-1440.png'});await close();
  });
  await test('Arcade categories, game launch, keyboard and touch controls',async()=>{
    await go('arcade');await action('arcadeFilter','Playable Demo').click();check(await page.locator('.c-game-card').count()===1,'Game filter failed');
    await action('gameDetails','glint-snake').click();check(await page.locator('#snakeCanvas').isVisible(),'Snake missing');
    await action('startSnake').click();await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>state.game?.dir.y===1);await action('snakeDir','left').click();
    check(await page.evaluate(()=>state.game.started&&state.game.alive&&state.game.queued.x===-1),'Snake controls failed');await close();
    await action('arcadeFilter','Original').click();await action('gameDetails','pancake').first().click();check(await page.locator('.modal button[disabled]').count()>0,'Unverified game launch is enabled');await close();
  });
  await test('Project details and verified-only links',async()=>{await go('projects');await action('projectDetails','rain-project').click();check(await page.locator('.modal').textContent().then(t=>t.includes('No verified public build')),'Missing development disclosure');await close();await action('projectDetails','glint-project').click();check(await page.locator('.modal a[href="https://github.com/Scraxemas/glint-ui-demo"]').count()===1,'Verified project link missing');await close();});
  await test('Server details and simulated access request validation',async()=>{
    await go('servers');await action('serverDetails','mc-survival').first().click();check(await page.locator('.modal').textContent().then(t=>t.includes('Not connected')),'Server disclosure missing');
    await action('serverAccess','mc-survival').click();await action('serverAccessSubmit').click();check((await page.locator('#accessError').textContent()).length>0,'Access validation missing');
    await page.locator('#accessGuidelines').check();await action('serverAccessSubmit').click();check((await page.locator('.modal').textContent()).includes('No request was sent'),'Request demo disclaimer missing');await close();
  });
  await test('VIP local-only preview and cancellation',async()=>{
    await go('vip');await action('vipToggle').click();await action('activateVipPreview').click();check(await page.locator('body').evaluate(e=>e.classList.contains('vip-demo')),'VIP not enabled');await page.reload();check(await page.locator('body').evaluate(e=>e.classList.contains('vip-demo')),'VIP not persisted');
    await action('vipBilling').click();check((await page.locator('.modal').textContent()).includes('$0.00'),'Billing preview incorrect');await action('disableVipPreview').click();check(!await page.locator('body').evaluate(e=>e.classList.contains('vip-demo')),'VIP cancellation failed');
  });
  await test('Profile save, avatar, preferences, admin and logout/login',async()=>{
    await go('account');await page.locator('#profileName').fill('Glint Explorer');await page.locator('#profileEmail').fill('explorer@example.test');await page.locator('#profile-form button[type="submit"]').click();await page.reload();check(await page.locator('#profileName').inputValue()==='Glint Explorer','Profile save failed');
    await action('profileAppearance').first().click();await action('selectAvatar','sage').click();check(await page.locator('.c-profile-banner .c-avatar-sage').count()===1,'Avatar save failed');
    await action('settingsTab','preferences').click();await action('settingToggle','reduceMotion').click();check(await page.locator('body').evaluate(e=>e.classList.contains('reduce-motion')),'Reduced motion class missing');await action('settingToggle','dense').click();check(await page.locator('body').evaluate(e=>e.classList.contains('compact-mode')),'Compact preference failed');
    await go('admin');await action('integrationPreview','Plex').click();check(await page.locator('.modal button[disabled]').count()===1,'Integration action should be disconnected');await close();await action('adminMock','Channel schedules').click();check(await page.locator('.c-admin-channel-list button').count()===6,'Admin schedule preview failed');await close();
    await go('account');await action('logout').click();check(await page.locator('#login-form').count()===1,'Logout failed');await page.locator('#authName').fill('Demo Member');await page.locator('#authEmail').fill('demo@glint.local');await page.locator('#login-form button').click();check(await page.locator('main h1').count()===1,'Local login failed');
  });
  await test('Mobile navigation drawer, focus, modal, reader and touch game',async()=>{
    await page.setViewportSize({width:375,height:812});await go('home');await page.locator('.mobile-menu').click();check(await page.locator('.side.open').isVisible(),'Drawer failed');
    await page.keyboard.press('Shift+Tab');check(await page.evaluate(()=>!!document.activeElement.closest('.side')),'Drawer focus escaped');await page.locator('.side [data-route="servers"]').click();check(page.url().endsWith('#servers'),'Mobile route failed');check(await page.locator('.side.open').count()===0,'Drawer remained open');
    await page.locator('.mobile-bottom [data-route="comics"]').click();await action('readComic','one-piece').first().click();check(await page.locator('.modal').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Reader overflow');await action('readerNext').click();await page.screenshot({path:'docs/screenshots/reader-375.png'});await close();
    await page.locator('.mobile-bottom [data-route="arcade"]').click();await action('gameDetails','glint-snake').first().click();await action('startSnake').click();await action('snakeDir','down').click();check(await page.evaluate(()=>state.game.queued.y===1),'Touch game input failed');await close();
    await page.locator('.top-search').click();await page.locator('#globalSearch').fill('asdfqwerty');check((await page.locator('#searchResults').textContent()).includes('No results'),'Global search empty state failed');await page.keyboard.press('Escape');
  });
  await test('Reduced motion, image assets and navigation history',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});await go('home');check(await page.locator('.media-card').first().evaluate(e=>getComputedStyle(e).transitionDuration)==='0s','OS reduced motion ignored');
    await page.locator('.mobile-bottom [data-route="watch"]').click();await page.goBack();check(page.url().endsWith('#home'),'History back failed');
    check(await page.evaluate(()=>[...document.images].every(i=>!i.complete||i.naturalWidth>0)),'Broken artwork');
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  return {passed:passed.length,failed,errors:[...new Set(errors)],checks:passed};
}
