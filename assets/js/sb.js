
/* =========================================================================
   THE ONE LINE THAT MATTERS.
   Paste the Google Calendar booking link between the quotes and every
   booking button on the site repoints itself on the next load. While it
   is empty, every button falls back to WhatsApp.
   ========================================================================= */
window.SB_BOOK = window.SB_BOOK || '';

/* =========================================================================
   THE SETTINGS. Everything that changes without touching the rest of the
   site lives between these quotes. Change a value here and every page on
   the site picks it up the next time it loads.
   ========================================================================= */

/* The WhatsApp number every button on this site opens. Country code first,
   no plus sign and no spaces. Changing this one line moves the whole site
   to another number. 919840591014 is the number the site runs on, and it is
   the one on the WhatsApp API. 919840591014 is the official number that sits
   in Suresh's own phone, so change it to that if the site should reach him
   directly instead of the API. */
window.SB_WA = window.SB_WA || '919840591014';

/* Google Analytics 4. Paste the Measurement ID between the quotes. It looks
   like G-ABC1234567. While this is empty nothing is loaded and nothing is
   sent anywhere, so the page costs the visitor nothing. */
window.SB_GA4 = window.SB_GA4 || '';

/* The Meta pixel. Paste the Pixel ID between the quotes. It is 15 or 16
   digits. While this is empty nothing is loaded and nothing is sent. */
window.SB_PIXEL = window.SB_PIXEL || '';

/* Where a lead is posted the moment somebody fills in a download gate.
   Paste the endpoint your CRM gives you. While this is empty the lead is
   not posted anywhere, and every other part of the page still works. */
window.SB_LEADS = window.SB_LEADS || '';

/* The Razorpay public Key ID does NOT live here. It lives inside join.html,
   near the bottom of that file, because the payment screen has to read it
   before this file has finished loading. Everything else about the join
   page is explained in the comment block that sits around it. */


(function(){
'use strict';
function IMG(n){ return (window.SB_IMG && window.SB_IMG[n]) ? window.SB_IMG[n] : 'assets/books/'+n; }
var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 00 · THE BOOKING BUTTONS. One constant repoints all of them. ---- */
function booking(){
  var link = (window.SB_BOOK || '').replace(/\s+/g, '');
  if(!link) return;
  var as = document.querySelectorAll('a[data-book]');
  for(var i=0;i<as.length;i++){
    as[i].setAttribute('href', link);
    as[i].setAttribute('target', '_blank');
    as[i].setAttribute('rel', 'noopener');
  }
}

/* ---- 00a2 · THE NUMBER. Every WhatsApp link on the site is built here, so
        the whole site moves when the setting above changes. ---- */
function WA(){ return String(window.SB_WA || '919840591014').replace(/[^0-9]/g, ''); }
function waHref(msg){ return 'https://wa.me/' + WA() + '?text=' + encodeURIComponent(msg); }
function esc(t){ return String(t == null ? '' : t)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function here(){ return location.pathname.split('/').pop() || 'index.html'; }

/* ---- 00a3 · THE INSTRUMENTS. Google Analytics and the Meta pixel are
        loaded only when an ID has been filled in above. An empty setting
        loads nothing at all, so the page stays as fast as it is today. ---- */
function instruments(){
  var ga = String(window.SB_GA4 || '').trim();
  var px = String(window.SB_PIXEL || '').trim();
  if(ga){
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga);
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ga);
  }
  if(px){
    if(!window.fbq){
      var n = window.fbq = function(){
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if(!window._fbq) window._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      var t = document.createElement('script'); t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(t);
    }
    window.fbq('init', px);
    window.fbq('track', 'PageView');
  }
}

/* ---- 00a4 · THE COUNT. One call, sent to whichever instrument is switched
        on. Nothing here can throw and stop the page. ---- */
function track(name, params){
  var p = params || {};
  try{ if(window.gtag) window.gtag('event', name, p); }catch(e){}
  try{ if(window.fbq) window.fbq('trackCustom', name, p); }catch(e){}
}

/* ---- 00a5 · THE LEAD. Posted before anything else happens, so a visitor
        who never presses send inside WhatsApp is still recorded. Plain text
        is used deliberately, because it needs no permission from the
        receiving server. ---- */
function lead(data){
  var url = String(window.SB_LEADS || '').trim();
  if(!url) return false;
  var body;
  try{ body = JSON.stringify(data); }catch(e){ return false; }
  try{
    if(navigator.sendBeacon){
      navigator.sendBeacon(url, new Blob([body], {type: 'text/plain;charset=UTF-8'}));
      return true;
    }
  }catch(e){}
  try{
    fetch(url, {method:'POST', mode:'no-cors', keepalive:true,
                headers:{'Content-Type':'text/plain;charset=UTF-8'}, body:body});
    return true;
  }catch(e){ return false; }
}

/* ---- 00a6 · THE CLICKS. Every route out of the site is counted, so you can
        see which page produced a conversation. ---- */
function clicks(){
  document.addEventListener('click', function(e){
    var t = e.target, a = null;
    while(t && t !== document){
      if(t.tagName === 'A'){ a = t; break; }
      t = t.parentNode;
    }
    if(!a) return;
    var h = a.getAttribute('href') || '';
    var label = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    if(a.hasAttribute('data-dl')) track('download_click', {doc: a.getAttribute('data-dl'), page: here()});
    else if(a.hasAttribute('data-book')) track('booking_click', {page: here(), label: label});
    else if(h.indexOf('wa.me/') > -1) track('whatsapp_click', {page: here(), label: label});
  }, true);
}

/* ---- 00b · A same page repaint crossfades when the browser can. ---- */
function vt(fn){
  if(document.startViewTransition && !RM){ document.startViewTransition(fn); }
  else { fn(); }
}

/* ---- 00c · THE TYPE ARRIVES IN LINES. h1 and h2 only, split into
        masked lines, raised once on arrival, then never moved again. ---- */
function lines(){
  if(RM) return;
  var els = document.querySelectorAll('main h1, main .h2');
  var targets = [];
  for(var i=0;i<els.length;i++){
    if(els[i].children.length === 0 && els[i].textContent.trim()) targets.push(els[i]);
  }
  if(!targets.length) return;

  function split(el){
    var text = el.getAttribute('data-lntext') || el.textContent;
    el.setAttribute('data-lntext', text);
    var words = text.split(/\s+/).filter(Boolean);
    el.textContent = '';
    var probe = [];
    for(var i=0;i<words.length;i++){
      var s = document.createElement('span');
      s.textContent = words[i];
      s.style.display = 'inline-block';
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
      probe.push(s);
    }
    var rows = [], top = null;
    for(var j=0;j<probe.length;j++){
      var t = probe[j].offsetTop;
      if(t !== top){ rows.push([]); top = t; }
      rows[rows.length-1].push(probe[j].textContent);
    }
    el.textContent = '';
    for(var r=0;r<rows.length;r++){
      var ln = document.createElement('span'); ln.className = 'ln';
      ln.style.setProperty('--ln', r);
      var inner = document.createElement('span');
      inner.textContent = rows[r].join(' ');
      ln.appendChild(inner);
      el.appendChild(ln);
    }
  }

  var io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('ttl-in'); io.unobserve(e.target); }
        });
      }, {rootMargin:'0px 0px -8% 0px', threshold:.1})
    : null;

  for(var k=0;k<targets.length;k++) split(targets[k]);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){
    for(var k=0;k<targets.length;k++){
      if(io) io.observe(targets[k]); else targets[k].classList.add('ttl-in');
    }
  });});

  var w = window.innerWidth, t2 = null;
  window.addEventListener('resize', function(){
    if(Math.abs(window.innerWidth - w) < 60) return;
    clearTimeout(t2);
    t2 = setTimeout(function(){
      w = window.innerWidth;
      for(var k=0;k<targets.length;k++){
        split(targets[k]); targets[k].classList.add('ttl-in');
      }
    }, 250);
  });
}

/* ---- 01 · THE REVEAL. Opacity and a small rise. Once, then it holds. ---- */
function reveal(){
  /* build 28: [data-rv] moved to CSS scroll driven animation. the observer
     now serves only the ink drawings and the section state. */
  var els = document.querySelectorAll('.ink,.sec,.top');
  if(!('IntersectionObserver' in window) || RM){
    for(var i=0;i<els.length;i++) els[i].classList.add('is-in');
    return;
  }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  },{rootMargin:'0px 0px -12% 0px',threshold:.08});
  for(var j=0;j<els.length;j++) io.observe(els[j]);
}

/* ---- 02 · THE LINE DRAWINGS. Each path told its own length, so the ink
        moves at one speed whatever the shape. ---- */
function inkLengths(){
  var svgs = document.querySelectorAll('.ink');
  for(var i=0;i<svgs.length;i++){
    var ps = svgs[i].querySelectorAll('path,line,circle,rect,polyline,polygon');
    for(var j=0;j<ps.length;j++){
      try{
        var L = Math.ceil(ps[j].getTotalLength ? ps[j].getTotalLength() : 1200) + 4;
        ps[j].style.setProperty('--len', L);
        ps[j].style.transitionDelay = Math.min(j*55, 620) + 'ms';
      }catch(e){}
    }
  }
}

/* ---- 03 · THE HEADER. It takes the colour of the band beneath it. ---- */
function header(){
  var h = document.querySelector('.hdr');
  if(!h) return;
  var darks = document.querySelectorAll('.on-navy,.on-deep');
  function f(){
    h.classList.toggle('is-stuck', window.scrollY > 12);
    var y = window.scrollY + 40, dark = false;
    for(var i=0;i<darks.length;i++){
      var d = darks[i], t = d.offsetTop;
      if(y >= t && y <= t + d.offsetHeight){ dark = true; break; }
    }
    h.classList.toggle('on-dark', dark);
  }
  f();
  window.addEventListener('scroll', f, {passive:true});
  window.addEventListener('resize', f);
}

/* ---- 04 · THE INDEX. Tells the reader where he is on a long page. ---- */
function index(){
  var idx = document.querySelector('.idx');
  if(!idx) return;
  var links = idx.querySelectorAll('a');
  var secs = [];
  for(var i=0;i<links.length;i++){
    var href = links[i].getAttribute('href') || '';
    /* a rail of pages rather than sections, or a route in the one file build */
    if(!/^#[A-Za-z][\w-]*$/.test(href)) continue;
    var t = document.querySelector(href);
    if(t) secs.push({a:links[i], el:t});
  }
  /* a page rail has nothing to track. it still has a job, so leave it alone. */
  if(!secs.length){
    var dk = document.querySelector('.on-navy,.on-deep');
    function pf(){
      var y = window.scrollY + window.innerHeight*0.5, dark = false;
      var ds = document.querySelectorAll('.on-navy,.on-deep');
      for(var k=0;k<ds.length;k++){
        var d = ds[k];
        if(y >= d.offsetTop && y <= d.offsetTop + d.offsetHeight){ dark = true; break; }
      }
      idx.classList.toggle('on-dark', dark);
    }
    pf(); window.addEventListener('scroll', pf, {passive:true});
    return;
  }
  function f(){
    var y = window.scrollY + window.innerHeight*0.34, cur = secs[0];
    for(var i=0;i<secs.length;i++){ if(secs[i].el.offsetTop <= y) cur = secs[i]; }
    for(var j=0;j<secs.length;j++){
      if(secs[j] === cur) secs[j].a.setAttribute('aria-current','true');
      else secs[j].a.removeAttribute('aria-current');
    }
    var dark = cur.el.classList.contains('on-navy') || cur.el.classList.contains('on-deep');
    idx.classList.toggle('on-dark', dark);
  }
  f(); window.addEventListener('scroll', f, {passive:true});
  window.addEventListener('resize', f);
}

/* ---- 05 · THE STACK. Three lines, the middle one lit. ---- */
function stack(){
  var s = document.querySelector('.stack');
  if(!s) return;
  var lis = s.querySelectorAll('li');
  if(!lis.length) return;
  function f(){
    var r = s.getBoundingClientRect();
    var p = 1 - (r.top + r.height/2) / window.innerHeight;
    var k = Math.max(0, Math.min(lis.length-1, Math.floor(p * lis.length * 1.35)));
    for(var i=0;i<lis.length;i++){
      if(i===k) lis[i].setAttribute('data-on','');
      else lis[i].removeAttribute('data-on');
    }
  }
  f(); window.addEventListener('scroll', f, {passive:true});
}

/* ---- 06 · THE MOBILE SHEET ---- */
function sheet(){
  var b = document.querySelector('.burger'), s = document.querySelector('.sheet');
  if(!b || !s) return;
  var x = s.querySelector('.sheet__x');
  function open(){ s.classList.add('is-open'); document.body.style.overflow='hidden';
    b.setAttribute('aria-expanded','true'); }
  function close(){ s.classList.remove('is-open'); document.body.style.overflow='';
    b.setAttribute('aria-expanded','false'); }
  b.addEventListener('click', open);
  if(x) x.addEventListener('click', close);
  var as = s.querySelectorAll('a');
  for(var i=0;i<as.length;i++) as[i].addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
}

/* ---- 07 · THE WORKBOOK PICKER. The offer at the top of the page. ---- */
function picker(){
  var box = document.getElementById('bookq');
  var hits = document.getElementById('hits');
  if(!box || !hits || !window.SB_BOOKS) return;
  var DATA = window.SB_BOOKS;

  function draw(q){
    hits.innerHTML = '';
    q = (q||'').trim().toLowerCase();
    if(q.length < 2) return;
    var out = [], i;
    for(i=0;i<DATA.length && out.length<8;i++){
      var b = DATA[i];
      if((b.t+' '+b.a).toLowerCase().indexOf(q) > -1) out.push(b);
    }
    if(!out.length){
      var d = document.createElement('div');
      d.className = 'no';
      d.textContent = 'Nothing on that one yet. Send me the title anyway and I will tell you honestly whether it is worth your evening.';
      hits.appendChild(d); return;
    }
    for(i=0;i<out.length;i++){
      (function(b){
        var btn = document.createElement('button');
        btn.type = 'button';
        var im = document.createElement('img'); im.src = IMG(b.i); im.alt='';
        im.loading = 'lazy';
        var w = document.createElement('div');
        var t = document.createElement('b'); t.textContent = b.t;
        var a = document.createElement('span');
        a.textContent = b.a + (b.w ? '  ·  8 pages ready' : '  ·  note not written yet');
        w.appendChild(t); w.appendChild(a);
        btn.appendChild(im); btn.appendChild(w);
        btn.addEventListener('click', function(){
          box.value = b.t; hits.innerHTML = '';
          var wn = document.getElementById('wanum');
          if(wn) wn.focus();
        });
        hits.appendChild(btn);
      })(out[i]);
    }
  }
  box.addEventListener('input', function(){ draw(box.value); });
  box.addEventListener('focus', function(){ draw(box.value); });
}

/* ---- 08 · THE 100. Filter, and the reading panel. ---- */
function hundred(){
  var wall = document.getElementById('wall');
  if(!wall || !window.SB_BOOKS) return;
  var DATA = window.SB_BOOKS;
  var chips = document.querySelectorAll('.chip');
  var more = document.getElementById('more');
  var shelf = 'all', shown = 24;   /* build 28: the pager goes 24, then 48 */

  function card(b){
    /* the format of the Deck document. number, title, category, gist. */
    var el = document.createElement('article');
    el.className = 'entry';
    var n = (b.k < 10 ? '00' : b.k < 100 ? '0' : '') + b.k;
    var tag = b.w
      ? '<span class="entry__tag">8 page note ready</span>'
      : '<span class="entry__tag entry__tag--no">No note written yet</span>';
    var msg = 'Hello Suresh. Please send me the 8 page operator\'s note on ' + b.t + '.';
    el.innerHTML =
      '<div class="entry__c"><img loading="lazy" src="' + IMG(b.i) + '" alt=""></div>' +
      '<div class="entry__b">' +
        '<p class="entry__m"><span class="entry__n">' + n + '</span>' +
        '<span class="entry__cat">' + (b.c || b.s) + '</span></p>' +
        '<h3 class="entry__t">' + b.t + '</h3>' +
        '<p class="entry__a">' + b.a + '</p>' +
        '<p class="entry__g">' + b.g + '</p>' +
        '<p class="entry__act">' + tag +
        (b.w ? '<a class="entry__go" target="_blank" rel="noopener" ' +
               'href="' + waHref(msg) + '">' +
               'Ask for it on WhatsApp</a>' : '') +
        '</p>' +
      '</div>';
    return el;
  }
  function paint(){
    wall.innerHTML='';
    var list = DATA.filter(function(b){ return shelf==='all' || b.s===shelf; });
    var slice = list.slice(0, shown);
    for(var i=0;i<slice.length;i++) wall.appendChild(card(slice[i]));
    if(more) more.style.display = (shown < list.length) ? '' : 'none';
    if(more) more.textContent = 'Show the next ' + Math.min(24, list.length-shown) + ' of ' + list.length;
  }
  for(var i=0;i<chips.length;i++){
    (function(c){
      c.addEventListener('click', function(){
        for(var j=0;j<chips.length;j++) chips[j].setAttribute('aria-pressed','false');
        c.setAttribute('aria-pressed','true');
        shelf = c.getAttribute('data-shelf'); shown = 24; vt(paint);
      });
    })(chips[i]);
  }
  if(more) more.addEventListener('click', function(){ shown += 24; vt(paint); });
  paint();

  /* the reading panel */
  var panel = document.getElementById('panel');
  function openPanel(b){
    if(!panel) return;
    panel.querySelector('#p-img').src = IMG(b.i);
    panel.querySelector('#p-n').textContent = 'Book ' + (b.n<10?'00':b.n<100?'0':'') + b.n;
    panel.querySelector('#p-h').textContent = b.t;
    panel.querySelector('#p-a').textContent = b.a;
    panel.querySelector('#p-s').textContent = b.s;
    panel.querySelector('#p-g').textContent = b.g;
    var cta = panel.querySelector('#p-cta');
    if(b.w){
      cta.innerHTML = '<p class="p" style="font-size:.95rem">There are 8 pages written on this one. Ask for it by name and it comes to you on WhatsApp.</p>'+
        '<p style="margin-top:1rem"><a class="btn" href="#offer">Ask for these 8 pages</a></p>';
    } else {
      cta.innerHTML = '<p class="p" style="font-size:.95rem">I have read this one and I have not written the 8 pages yet. Ask anyway and I will tell you where it sits in the queue.</p>'+
        '<p style="margin-top:1rem"><a class="btn btn--o" href="#offer">Ask about this one</a></p>';
    }
    panel.classList.add('is-open'); document.body.style.overflow='hidden';
  }
  function closePanel(){ if(!panel) return; panel.classList.remove('is-open');
    document.body.style.overflow=''; }
  if(panel){
    panel.querySelector('.panel__bg').addEventListener('click', closePanel);
    panel.querySelector('.panel__x').addEventListener('click', closePanel);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closePanel(); });
    var links = panel.querySelectorAll('a[href="#offer"]');
    for(var k=0;k<links.length;k++) links[k].addEventListener('click', closePanel);
  }
}

/* ---- 09 · THE MONTHLY READ. Nothing plays until it is pressed. ---- */
function player(){
  var ps = document.querySelectorAll('.player[data-yt]');
  for(var i=0;i<ps.length;i++){
    (function(p){
      var b = p.querySelector('.player__b');
      if(!b) return;
      b.addEventListener('click', function(){
        var id = p.getAttribute('data-yt');
        if(!id) return;
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
        f.title = 'The monthly read';
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
        f.setAttribute('allowfullscreen','');
        p.innerHTML=''; p.appendChild(f);
      });
    })(ps[i]);
  }
}

/* ---- 10 · THE SCORE THAT SETTLES. Once, on the RAAG figure, nowhere else. ---- */
function settle(){
  var el = document.getElementById('score');
  /* only a real reading takes the settle. it must declare its own value. */
  if(!el || RM || !el.getAttribute('data-v')) return;
  var done = false;
  var target = el.getAttribute('data-v') || '68';
  var glyphs = '0123456789';
  function run(){
    if(done) return; done = true;
    var frame = 0, total = 22;
    var t = setInterval(function(){
      frame++;
      var out = '';
      for(var i=0;i<target.length;i++){
        var settled = frame > (total * (i+1) / target.length);
        out += settled ? target[i] : glyphs[Math.floor(Math.random()*10)];
      }
      el.textContent = out;
      if(frame >= total){ clearInterval(t); el.textContent = target; }
    }, 42);
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting) run(); });
    },{threshold:.6});
    io.observe(el);
  } else { run(); }
}


/* ---- 11 · THE PROGRESS LINE. How much of this page is left. ---- */
function progress(){
  var el = document.createElement('div');
  el.className = 'prog'; document.body.appendChild(el);
  function f(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    el.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  f(); window.addEventListener('scroll', f, {passive:true});
  window.addEventListener('resize', f);
}

/* ---- 12 · THE MOBILE BAR. One action, always within a thumb. ---- */
function bar(){
  if(window.innerWidth > 720) return;
  var b = document.querySelector('.bar');
  if(!b) return;
  var last = 0;
  function f(){
    var y = window.scrollY;
    b.classList.toggle('is-up', y > 520 && y > last - 40);
    last = y;
  }
  f(); window.addEventListener('scroll', f, {passive:true});
}

/* ---- 13 · THE CAPTURE. The file goes first. Then I ask. ---- */
function capture(){
  var g = document.getElementById('grab');
  if(!g) return;
  var h = document.getElementById('grab-h');
  var txt = document.getElementById('grab-text');
  var nm = document.getElementById('grab-name');
  var bz = document.getElementById('grab-biz');
  var last = '';
  function open(name){
    last = name || 'the guide';
    h.textContent = name ? (name + ' is on its way to you.') : 'It is on its way to you.';
    g.classList.add('is-open'); document.body.style.overflow = 'hidden';
    setTimeout(function(){ if(nm) nm.focus(); }, 260);
  }
  function close(){ g.classList.remove('is-open'); document.body.style.overflow = ''; }
  g.querySelector('.grab__bg').addEventListener('click', close);
  g.querySelector('.grab__x').addEventListener('click', close);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && g.classList.contains('is-open')) close();
  });
  g.querySelector('.grab__f').addEventListener('submit', function(){
    var n = (nm && nm.value.trim()) || '';
    var b = (bz && bz.value.trim()) || '';
    var m = 'Hello Suresh. I have just downloaded ' + last + '.';
    if(n) m += ' My name is ' + n + '.';
    if(b) m += ' My business does ' + b + '.';
    m += ' Please send me the rest of your free guides.';
    if(txt) txt.value = m;
    setTimeout(close, 400);
  });
  var dls = document.querySelectorAll('[data-dl]');
  for(var i=0;i<dls.length;i++){
    (function(a){
      a.addEventListener('click', function(){
        /* the download is not blocked. this simply arrives after it. */
        setTimeout(function(){ open(a.getAttribute('data-dl')); }, 900);
      });
    })(dls[i]);
  }
}

/* ---- 14 · THE CHOOSER. 3 questions, then one of the 7. ---- */
function quiz(){
  var box = document.getElementById('quiz-stage');
  if(!box || !window.SB_QUIZ || !window.SB_PROD) return;
  var Q = window.SB_QUIZ, P = window.SB_PROD;
  var fill = document.getElementById('quiz-fill');
  var picked = [];

  function decide(){
    var pain = picked[0], size = picked[1], will = picked[2];
    if(will === 'read')  return pain === 'self' ? 'profiling' : 'cashflow';
    if(pain === 'money' && (size === 'small' || size === 'mid')) return 'cashflow';
    if(pain === 'self')  return size === 'big' ? 'ceo-coaching' : 'profiling';
    if(will === 'learn') return 'workshops';
    if(will === 'build') return size === 'big' ? 'ceo-coaching'
                                : (size === 'large' ? 'business-machine' : 'sprint');
    if(pain === 'people') return will === 'measure' ? 'raag' : 'workshops';
    return 'raag';
  }

  function ask(i){
    if(fill) fill.style.width = (i / Q.q.length) * 100 + '%';
    var item = Q.q[i];
    box.innerHTML = '';
    var n = document.createElement('p'); n.className = 'quiz__n';
    n.textContent = 'Question ' + (i+1) + ' of ' + Q.q.length;
    var q = document.createElement('p'); q.className = 'quiz__q'; q.textContent = item.q;
    var as = document.createElement('div'); as.className = 'quiz__as';
    for(var k=0;k<item.a.length;k++){
      (function(pair){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'quiz__a'; b.textContent = pair[0];
        b.addEventListener('click', function(){
          picked[i] = pair[1];
          if(i + 1 < Q.q.length) ask(i + 1); else result();
        });
        as.appendChild(b);
      })(item.a[k]);
    }
    box.appendChild(n); box.appendChild(q); box.appendChild(as);
  }

  function result(){
    if(fill) fill.style.width = '100%';
    var key = decide(), p = P[key], why = Q.out[key] || '';
    box.innerHTML = '';
    var n = document.createElement('p'); n.className = 'quiz__n'; n.textContent = 'What I would take';
    var wrap = document.createElement('div'); wrap.className = 'quiz__res';
    var l = document.createElement('div');
    l.innerHTML = '<p class="quiz__name">' + p.name + '</p>' +
                  (p.x ? '<p class="mrow__x">' + p.x + '</p>' : '') +
                  '<p class="quiz__price">' + p.price + '</p>';
    var r = document.createElement('div');
    r.innerHTML = '<p class="quiz__why">' + why + '</p>' +
      '<p class="quiz__acts"><a class="btn btn--gold" href="' + p.href + '">Read the page' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
      '<button type="button" class="quiz__again">Ask me the 3 again</button></p>';
    wrap.appendChild(l); wrap.appendChild(r);
    box.appendChild(n); box.appendChild(wrap);
    track('quiz_complete', {recommended: p.name, page: here()});
    box.querySelector('.quiz__again').addEventListener('click', function(){
      picked = []; ask(0);
    });
  }
  ask(0);
}


/* ---- 15 · THE INSTRUMENT. 10 statements, nothing collected. ---- */
function instrument(){
  var stage = document.getElementById('inst-stage');
  if(!stage || !window.SB_SCORE) return;
  var S = window.SB_SCORE, fill = document.getElementById('inst-fill');
  var yes = 0, i = 0, answers = [];

  function ask(){
    if(fill) fill.style.width = (i / S.q.length) * 100 + '%';
    stage.innerHTML = '';
    var n = document.createElement('p'); n.className = 'inst__n';
    n.textContent = 'Statement ' + (i+1) + ' of ' + S.q.length;
    var q = document.createElement('p'); q.className = 'inst__q'; q.textContent = S.q[i];
    var as = document.createElement('div'); as.className = 'inst__as';
    [['Yes',1],['No',0]].forEach(function(pair){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'inst__a'; b.textContent = pair[0];
      b.addEventListener('click', function(){
        answers[i] = pair[1]; yes += pair[1]; i++;
        if(i < S.q.length) ask(); else result();
      });
      as.appendChild(b);
    });
    if(i > 0){
      var back = document.createElement('button');
      back.type = 'button'; back.className = 'inst__back'; back.textContent = 'Back one';
      back.addEventListener('click', function(){ i--; yes -= answers[i] || 0; ask(); });
      as.appendChild(back);
    }
    stage.appendChild(n); stage.appendChild(q); stage.appendChild(as);
  }

  function result(){
    if(fill) fill.style.width = '100%';
    var band = S.bands[S.bands.length-1];
    for(var k=0;k<S.bands.length;k++){
      if(yes >= S.bands[k][0] && yes <= S.bands[k][1]){ band = S.bands[k]; break; }
    }
    stage.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'inst__res';
    var l = document.createElement('div');
    l.innerHTML = '<p class="inst__score">' + yes + '</p><p class="inst__out">out of ' + S.q.length + '</p>';
    track('score_complete', {score: yes, outOf: S.q.length, page: here()});
    var r = document.createElement('div');
    var msg = 'Hello Suresh. I scored ' + yes + ' out of ' + S.q.length +
              ' on the 10 statements. I would like your reading of it.';
    r.innerHTML = '<p class="inst__h">' + band[2] + '</p><p class="inst__p">' + band[3] + '</p>' +
      '<p class="inst__acts"><a class="btn btn--gold" href="' + waHref(msg) + '" target="_blank" rel="noopener">' + S.cta +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
      '<button type="button" class="inst__again">' + S.again + '</button></p>';
    wrap.appendChild(l); wrap.appendChild(r);
    stage.appendChild(wrap);
    stage.querySelector('.inst__again').addEventListener('click', function(){
      yes = 0; i = 0; answers = []; ask();
    });
  }
  ask();
}


/* ---- 16 · THE GATE. 2 fields, then the document opens and it also goes to
        WhatsApp, so the founder has it in both places and Suresh has the number. ---- */
function gate(){
  var fs = document.querySelectorAll('.gate');
  for(var i=0;i<fs.length;i++){
    (function(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var who = (f.querySelector('[name=who]').value || '').trim();
        var num = (f.querySelector('[name=num]').value || '').trim();
        if(!who || !num){ return; }
        var file = f.getAttribute('data-file');
        var name = f.getAttribute('data-name');

        /* 1. The lead is recorded first. A visitor who never presses send
              inside WhatsApp is still a person you know about. */
        lead({name: who, number: num, wanted: name, page: here(),
              at: new Date().toISOString(), source: 'website gate'});
        track('lead_submit', {doc: name, page: here()});

        /* 2. WhatsApp opens next, while the visitor is still waiting for
              something to happen. This is the step that reaches Suresh. */
        var m = 'Hello Suresh. This is ' + who + '. Please send me ' + name +
                '. My WhatsApp number is ' + num + '.';
        window.open(waHref(m), '_blank');

        /* 3. The document arrives last, so there is no reason to stop at
              step 2 with the file already in hand. */
        if(file){
          setTimeout(function(){
            var a = document.createElement('a');
            a.href = file; a.download = ''; a.target = '_blank'; a.rel = 'noopener';
            document.body.appendChild(a); a.click(); a.remove();
          }, 1200);
        }
        f.innerHTML = '<p class="gate__done"><b>' +
          (file ? esc(name) + ' is opening now.' : 'Thank you, ' + esc(who) + '.') + '</b> ' +
          'It is also on its way to you on WhatsApp. Nothing else will be sent to you.</p>';
      });
    })(fs[i]);
  }
}

/* ---- go ---- */
function go(){
  instruments(); clicks();
  booking(); lines();
  inkLengths(); reveal(); header(); index(); stack(); sheet();
  picker(); hundred(); player(); settle();
  progress(); bar(); capture(); quiz(); instrument(); gate();
}
window.SB_INIT = go;   /* the one file build calls this after each route */
if(document.readyState !== 'loading') go();
else document.addEventListener('DOMContentLoaded', go);
})();
