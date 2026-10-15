// Shared behaviour for every page: mobile nav toggle and the hero typing effect.
(function(){
  var toggle = document.querySelector('.navtoggle');
  var nav = document.querySelector('.navlinks');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.classList.contains('open')){
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Types out the hero name once on load. The full name is already in the
  // markup, so screen readers and no-JS visitors get it immediately.
  var el = document.getElementById('typed-name');
  if(!el) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var target = el.querySelector('[data-type]');
  if(!target) return;
  var text = target.textContent;
  el.setAttribute('aria-label', el.textContent.trim());
  target.textContent = '';

  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  el.appendChild(cursor);

  var i = 0;
  (function type(){
    if(i <= text.length){
      target.textContent = text.slice(0, i++);
      setTimeout(type, 90);
    } else {
      setTimeout(function(){ cursor.remove(); }, 900);
    }
  })();
})();
