// Projects shown on portfolio.html.
//
// The list is intentionally empty for now. To publish a project, add an object
// like the commented example below; the page renders it in the same terminal
// card style and the "No projects published yet." message disappears.
//
// {
//   slug: 'my-project',                       // shown as ~/projects/my-project
//   title: 'My Project',
//   repo: 'https://github.com/adnansamore/my-project',   // optional
//   demo: 'https://example.com',              // optional
//   summary: 'One or two sentences on what it does and why.',
//   highlights: ['Something concrete you built', 'Another detail'],  // optional
//   tags: ['python', 'docker'],
//   media: [{ type: 'image', src: 'assets/projects/my-project/shot.png', alt: 'Dashboard view' }]  // optional; type 'video' also works
// }
window.PORTFOLIO_PROJECTS = [];

(function(){
  var root = document.getElementById('project-list');
  if(!root) return;
  var projects = window.PORTFOLIO_PROJECTS || [];

  function el(tag, cls, text){
    var n = document.createElement(tag);
    if(cls) n.className = cls;
    if(text != null) n.textContent = text;
    return n;
  }
  function link(href, label){
    var a = el('a', null, label);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }
  function termBar(title){
    var bar = el('div', 'term-bar');
    bar.setAttribute('aria-hidden', 'true');
    ['r','y','g'].forEach(function(c){ bar.appendChild(el('span', 'term-dot ' + c)); });
    bar.appendChild(el('span', 'term-title', title));
    return bar;
  }

  root.textContent = '';

  if(!projects.length){
    var term = el('div', 'term');
    term.appendChild(termBar('~/projects'));
    var body = el('div', 'term-body');
    body.appendChild(el('div', 'term-cmd', 'ls ~/projects'));
    var msg = el('p', 'term-empty', 'No projects published yet.');
    body.appendChild(msg);
    body.appendChild(el('p', 'term-empty muted', '// work in progress. check back soon, or browse my GitHub in the meantime.'));
    var links = el('div', 'term-links');
    links.appendChild(link('https://github.com/adnansamore', 'github.com/adnansamore →'));
    body.appendChild(links);
    term.appendChild(body);
    root.appendChild(term);
    return;
  }

  projects.forEach(function(p){
    var term = el('article', 'term');
    term.appendChild(termBar('~/projects/' + p.slug));
    var body = el('div', 'term-body');
    if(p.repo) body.appendChild(el('div', 'term-cmd', 'git clone ' + p.repo.replace(/^https?:\/\//, '')));
    body.appendChild(el('h3', null, p.title));
    if(p.summary) body.appendChild(el('p', null, p.summary));
    if(p.highlights && p.highlights.length){
      var ul = el('ul');
      p.highlights.forEach(function(h){ ul.appendChild(el('li', null, h)); });
      body.appendChild(ul);
    }
    (p.media || []).forEach(function(m){
      var wrap = el('div');
      wrap.style.cssText = 'margin:16px 0; border-radius:8px; overflow:hidden; border:1px solid var(--border);';
      var node;
      if(m.type === 'video'){
        node = document.createElement('video');
        node.controls = true;
        node.src = m.src;
      } else {
        node = document.createElement('img');
        node.src = m.src;
        node.alt = m.alt || '';
        node.loading = 'lazy';
      }
      node.style.cssText = 'width:100%; display:block;';
      wrap.appendChild(node);
      body.appendChild(wrap);
    });
    if(p.tags && p.tags.length){
      var tags = el('div', 'tags');
      p.tags.forEach(function(t){ tags.appendChild(el('span', 'tag', t)); });
      body.appendChild(tags);
    }
    if(p.repo || p.demo){
      var links = el('div', 'term-links');
      if(p.repo) links.appendChild(link(p.repo, 'Code →'));
      if(p.demo) links.appendChild(link(p.demo, 'Live demo →'));
      body.appendChild(links);
    }
    term.appendChild(body);
    root.appendChild(term);
  });
})();
