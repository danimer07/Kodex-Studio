/* Cabecera, pie y utilidades compartidas de las páginas internas */
(function () {
  var ESTADOS = {
    idea: 'Idea',
    desarrollo: 'En desarrollo',
    pruebas: 'En pruebas',
    produccion: 'En producción',
    mantenimiento: 'Mantenimiento'
  };
  var NAV = [['Servicios', '/servicios'], ['Proyectos', '/proyectos'], ['Proceso', '/proceso'], ['Contacto', '/contacto']];
  var here = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  async function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    var body = opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body;
    var r = await fetch(path, Object.assign({}, opts, { headers: headers, body: body }));
    var data = null;
    try { data = await r.json(); } catch (e) { /* sin cuerpo */ }
    if (!r.ok) {
      var err = new Error((data && data.error) || 'Error ' + r.status);
      err.status = r.status;
      throw err;
    }
    return data;
  }

  var links = NAV.map(function (n) {
    return '<a href="' + n[1] + '"' + (here === n[1] ? ' class="active"' : '') + '>' + n[0] + '</a>';
  }).join('');

  var tpl = document.createElement('div');
  tpl.innerHTML =
    '<header class="site-header">' +
      '<a class="brand" href="/">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
          '<path d="M2.5 9c2.5 0 2.5 4.2 5 4.2S10 9 12 9s2.5 4.2 5 4.2S19.5 9 21.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M2.5 15c2.5 0 2.5 4.2 5 4.2S10 15 12 15s2.5 4.2 5 4.2S19.5 15 21.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>' +
        '</svg>Kodex Studio</a>' +
      '<nav class="links">' + links + '</nav>' +
      '<a class="pill" href="/contacto">Empezar</a>' +
    '</header>' +
    '<nav class="mnav">' + links + '</nav>';
  // header primero, luego la barra móvil
  document.body.prepend(tpl.querySelector('.mnav'));
  document.body.prepend(tpl.querySelector('.site-header'));

  var foot = document.createElement('footer');
  foot.className = 'site-footer';
  foot.textContent = '© 2026 Kodex Studio — código con propósito.';
  document.body.appendChild(foot);

  window.K = { ESTADOS: ESTADOS, esc: esc, api: api };
})();
