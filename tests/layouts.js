async page => {
  const errors=[]; const failures=[]; const results=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  const root=page.url().split('#')[0];
  await page.goto(root);await page.reload();
  const routes=['home','watch','live','comics','arcade','projects','servers','vip','account','admin'];
  for(const width of [375,430,768,1024,1440,1920]){
    await page.setViewportSize({width,height:width<600?900:1000});
    for(const route of routes){
      await page.goto(root+'#'+route);
      await page.locator('main h1').waitFor();
      await page.evaluate(()=>document.fonts.ready);
      const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,heading:document.querySelector('main h1').textContent,images:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),background:[...document.querySelectorAll('[style*="--art-image"]')].slice(0,1).map(e=>getComputedStyle(e).getPropertyValue('--art-image'))}));
      results.push({route,width,scroll:layout.scroll});
      if(layout.scroll>width+1)failures.push({route,width,problem:'horizontal overflow',actual:layout.scroll});
      if(layout.images.length)failures.push({route,width,problem:'broken images',images:layout.images});
      if(width===1440||width===375)await page.screenshot({path:'docs/screenshots/'+route+'-'+width+'.png',fullPage:true});
    }
  }
  return {checks:results.length,failures,errors:[...new Set(errors)],results};
}
