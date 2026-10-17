async page=>{
 const root=page.url().split('#')[0], issues=[],contrast=[];
 await page.goto(root);await page.reload();
 await page.setViewportSize({width:1440,height:1000});
 for(const route of ['home','watch','live','comics','arcade','projects','servers','vip','account','admin']){
  await page.goto(root+'#'+route);await page.locator('main h1').waitFor();
  const audit=await page.evaluate(()=>{
   const issues=[],contrast=[];
   const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
   const name=e=>e.getAttribute('aria-label')||e.getAttribute('title')||(e.getAttribute('aria-labelledby')||'').split(' ').map(id=>document.getElementById(id)?.textContent||'').join('')||e.textContent.trim();
   for(const e of document.querySelectorAll('button,a[href],input,select')){
    if(!visible(e)||e.disabled)continue;
    let label=name(e);if(e.matches('input,select'))label=e.getAttribute('aria-label')||[...e.labels||[]].map(l=>l.textContent).join('');
    if(!label.trim())issues.push({problem:'Unnamed control',html:e.outerHTML.slice(0,180)});
   }
   for(const e of document.images)if(!e.hasAttribute('alt'))issues.push({problem:'Missing image alt',src:e.src});
   if(document.querySelectorAll('main h1').length!==1)issues.push({problem:'Expected one primary heading'});
   const rgb=s=>{const m=s.match(/[\d.]+/g);return m?[Number(m[0]),Number(m[1]),Number(m[2]),m[3]===undefined?1:Number(m[3])]:[0,0,0,0]};
   const over=(a,b)=>[0,1,2].map(i=>a[i]*a[3]+b[i]*(1-a[3])).concat(1);
   const lum=c=>c.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);
   for(const e of document.querySelectorAll('main *,header *,aside *')){
    if(!visible(e)||e.closest('[inert]')||e.closest('svg')||!e.childNodes.length||![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||e.matches('button:disabled'))continue;
    let layers=[],node=e,art=false;
    while(node){let s=getComputedStyle(node);if(s.backgroundImage!=='none'||Number(s.opacity)<1){art=true;break;}let bg=rgb(s.backgroundColor);layers.push(bg);if(bg[3]===1)break;node=node.parentElement;}
    if(art||e.closest('.poster,.cinema-hero,.c-art,.c-detail-art,.c-membership-card'))continue;
    let bg=[11,12,16,1];for(let i=layers.length-1;i>=0;i--)bg=over(layers[i],bg);
    const s=getComputedStyle(e),fg=over(rgb(s.color),bg),a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),large=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.67&&Number(s.fontWeight)>=700);
    if(ratio<(large?3:4.5))contrast.push({text:e.textContent.trim().slice(0,70),class:e.className,color:s.color,background:bg.slice(0,3),ratio:Math.round(ratio*100)/100});
   }
   return {issues,contrast};
  });
  issues.push(...audit.issues.map(i=>({route,...i})));contrast.push(...audit.contrast.map(i=>({route,...i})));
 }
 await page.setViewportSize({width:375,height:812});await page.goto(root+'#home');
 await page.locator('.skip-link').focus();await page.keyboard.press('Enter');
 if(!await page.evaluate(()=>document.activeElement.id==='maincontent'))issues.push({problem:'Skip link did not focus main'});
 await page.locator('.mobile-menu').click();await page.keyboard.press('Control+k');await page.keyboard.press('Escape');
 if(await page.locator('.layout').getAttribute('inert')!==null)issues.push({problem:'Navigation-to-search left page inert'});
 return {routesChecked:10,issues,contrast};
}
