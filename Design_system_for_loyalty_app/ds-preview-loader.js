/* Preview fallback: if the compiled _ds_bundle.js is not present (e.g. opening a
   card straight from the filesystem before the compiler has run), fetch the sibling
   .jsx sources, strip their module syntax and evaluate them into one namespace. */
window.DSResolve = async function (files) {
 try {
  for (const k of Object.keys(window)) {
    try {
      const v = window[k];
      if (v && typeof v === 'object' && v.Button && v.Card && v.StampGrid) return v;
    } catch (_) { /* cross-origin or throwing getter */ }
  }
  const srcs = await Promise.all(files.map((p) => fetch(p).then((r) => {
    if (!r.ok) throw new Error('missing ' + p);
    return r.text();
  })));
  let code = srcs.join('\n\n')
    .replace(/^[ \t]*import[^\n]*\n/gm, '')
    .replace(/^[ \t]*export[ \t]+function/gm, 'function');
  const names = Array.from(code.matchAll(/^function ([A-Z][A-Za-z0-9_]*)/gm)).map((m) => m[1]);
  const compiled = Babel.transform(
    code + '\nreturn {' + names.join(', ') + '};',
    { presets: ['react'] }
  ).code;
  return new Function('React', compiled)(React);
 } catch (e) {
   document.body.insertAdjacentHTML('beforeend',
     '<pre style="white-space:pre-wrap;padding:16px;color:#C4351F;font:12px monospace">DSResolve failed: ' + (e && e.message) + '</pre>');
   throw e;
 }
};
