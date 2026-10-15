#!/usr/bin/env python3
"""Build the whole site as ONE self-contained HTML file (SPA shell + router)."""
import re, base64, os, json

os.chdir(os.path.join(os.path.dirname(__file__), '..'))

PAGES = ['index', 'about', 'cashflow', 'raag', 'profiling', 'workshops',
         'w-think-like-an-entrepreneur', 'w-marketing-as-a-system', 'w-sales-system-management',
         'w-operational-excellence', 'w-building-an-a-team', 'sprint', 'business-machine',
         'ceo-coaching', 'deck', 'resources']

MIMES = {'.webp': 'image/webp', '.png': 'image/png', '.pdf': 'application/pdf',
         '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.mp4': 'video/mp4'}

def datauri(p):
    ext = os.path.splitext(p)[1].lower()
    with open(p, 'rb') as f:
        return f'data:{MIMES[ext]};base64,' + base64.b64encode(f.read()).decode()

css = open('assets/css/sb.css', encoding='utf-8').read()
js = open('assets/js/sb.js', encoding='utf-8').read()

vid_b64 = base64.b64encode(open('assets/video/july-2026.mp4', 'rb').read()).decode()
imgmap = {f: datauri('assets/books/' + f) for f in sorted(os.listdir('assets/books'))}

pages_obj = {}
for name in PAGES:
    html = open(name + '.html', encoding='utf-8').read()
    title = re.search(r'<title>(.*?)</title>', html).group(1)
    # strip shared css + sb.js references (shell provides them)
    html = re.sub(r'<link rel="stylesheet" href="assets/css/sb.css"\s*/?>', '', html)
    html = re.sub(r'<script src="assets/js/sb.js"[^>]*></script>', '', html)
    if name == 'deck':
        # video via blob; SB_IMG map is injected once by the shell
        html = html.replace(' src="assets/video/july-2026.mp4"', ' data-blobsrc="july-2026"')
        html = html.replace('</main>',
            '</main>\n<script>(function(){function go(){var bin=atob(window.SB_VID);'
            'var u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);'
            'var url=URL.createObjectURL(new Blob([u],{type:"video/mp4"}));'
            'var v=document.querySelector("video[data-blobsrc]");if(v)v.src=url;}'
            "if(document.readyState!=='loading')go();else document.addEventListener('DOMContentLoaded',go);})();</script>")
    # inline every asset reference
    def repl(m):
        a, p = m.group(1), m.group(2)
        if os.path.exists(p):
            return f'{a}="{datauri(p)}"'
        print('MISSING:', name, p)
        return m.group(0)
    html = re.sub(r'(src|href|data-file|poster)="(assets/(?:img|prev|dl|books|res|video)/[^"]+)"', repl, html)
    body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
    pages_obj[name + '.html'] = {'t': title, 'b': body}
    print(name, 'body', len(body) // 1024, 'KB')

pages_json = json.dumps(pages_obj).replace('</', '<\\/')
imgmap_json = json.dumps(imgmap).replace('</', '<\\/')

router = r'''
(function(){
  var PAGES = window.SB_PAGES;
  var current = null;
  function runScripts(root){
    var scripts = root.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
      var old = scripts[i];
      var s = document.createElement('script');
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    }
  }
  function render(name, hash, push){
    var pg = PAGES[name];
    if (!pg) return;
    var swap = function(){
      document.body.innerHTML = pg.b;
      document.title = pg.t;
      runScripts(document.body);
      if (window.SB_INIT) window.SB_INIT();
      current = name;
      if (hash) {
        var el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView();
        else window.scrollTo(0, 0);
      } else window.scrollTo(0, 0);
    };
    if (document.startViewTransition && current) document.startViewTransition(swap);
    else swap();
    if (push !== false) history.pushState({p: name, h: hash || ''}, '', '#/' + name + (hash || ''));
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var m = href.match(/^([a-z0-9-]+\.html)(#[a-z0-9-]+)?$/i);
    if (m && PAGES[m[1]]) {
      e.preventDefault();
      if (m[1] === current && m[2]) {
        var el = document.getElementById(m[2].slice(1));
        if (el) el.scrollIntoView();
        return;
      }
      render(m[1], m[2] || '', true);
    }
  });
  window.addEventListener('popstate', function(e){
    if (e.state && e.state.p) render(e.state.p, e.state.h, false);
    else boot(false);
  });
  function boot(push){
    var m = (location.hash || '').match(/^#\/([a-z0-9-]+\.html)(#[a-z0-9-]+)?$/i);
    if (m && PAGES[m[1]]) render(m[1], m[2] || '', push);
    else render('index.html', '', push);
  }
  boot(true);
})();
'''

shell = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
         '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
         '<title>Boss Your Business · Suresh Balachandar</title>\n'
         '<meta name="theme-color" content="#102A43">\n'
         '<style>\n' + css + '\n</style>\n</head>\n<body>\n'
         '<script>window.SB_IMG=' + imgmap_json + ';</script>\n'
         '<script>window.SB_VID="' + vid_b64 + '";</script>\n'
         '<script>window.SB_PAGES=' + pages_json + ';</script>\n'
         '<script>\n' + js.replace('</', '<\\/') + '\n</script>\n'
         '<script>\n' + router + '\n</script>\n'
         '</body></html>\n')

out = '/home/claude/bossyourbusiness-complete-site-v1.html'
open(out, 'w', encoding='utf-8').write(shell)
print('WRITTEN', out, round(os.path.getsize(out) / 1048576, 1), 'MB')
