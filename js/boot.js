if(location.hash.length>1)state.route=location.hash.slice(1);
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();document.getElementById('maincontent')?.focus();});
render();
