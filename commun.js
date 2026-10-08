/* commun.js — calcul partagé (pages generateur.html et image.html).
   Les deux pages chargent ce même fichier : elles calculent la même valeur
   sans communiquer entre elles. Ce n'est pas une protection réelle. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Commun = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var D = "IAkTAhxjOy40M1MOER4cOMG/cYWMwqS7sqvm9ZvSmSo76/Xj8Fq6yw04I23Gqx8FcllcaGwsdbegvZrk5/vr59XExZHdu7nk9OsKZVZBe3UrPSJdah9d0ahpaSLc19bsqr20vrCc3N7y0fuisLFOUAAUFT0ZbIqbV0tIBDw9JDW0jZKcnKOpraOq05y3q5ul0Fs5EgBNHTMvLSMwFAdKD3d9fER3x40hWN6y5aXym4rR2dfk9ZpK2xULBURwZ3h1eklCWFUnbWNld5nO2efZyr6Kv8/Nm9XR7uPruUZBQ0Y8NBM0KxxcD1dXeiU5AdXUgI2CoKfqtfHOwsmeu7fqurHAAxkcch0DAiJ1LTYrJglueX7BjZkqe7evpeWUhoOG/PTF//pCFgsCEThuYG8fF1ZEYGR7M2CBwYiDxenR5efBwcff3LLJ++PxGllWR2ZJAXgj4oAdXGBoesX5yfPHzLwLabT5ip7D2MzqkKq2X1gXWBkvKnsnVkhLWjk7MS8nloGFjToHuq6wt8SBgoemnUEx9wAOWwQ3Lzo6VQ0GAwdxfGl+d9Krh5KRo/Dg75+X1sTiQiC/6gYIAQgQdGcqb1ddXHxYJ3cicnGD0sTM7vy+n6XIzZuE9Oji46xxW0xPJzslJCtOSk1fUWQlORbf1JKXgqi6/73bzsDaprC8vqYHGwUNLXcpJ3ETSjAXofMva2t5jofCurOyspT1kpuZneDt/Mf2RxxCFBAxaWtxBjpNVF9vZzspmpSDj9Tw7tnmwNzJ1MWP6vH07ABJVlF/dCc2JF1sBl17b21yNcDA1vqBgbyCiqf48s3z96mrtl9XAxYTJDVfJVdTWkMMA5HjO5uOiZKY+rCtv6L0koyR+r3nuPcNCF0MLgIhM2AQXwwMZ3RBYnrLl5GUi6T8wUFTj8vc3+j7osszJD0ac3lzemxGVHNBSyd3aX17g9LZ4fv3tre+z8yTzPz18su/TFdEWnIsJXEqC1pNRExlPBYn2daXioO9jV1g0c3LyJO9t7+7DjsJHxB9LTA0In8TFhc/JUF5fpWG0JWQoKKv45SVj5XT5OHj9EsFJwkbJGNsYR8FZvuZcmwwb4eMj4HV6cbl/MDNzN3cssnj4/tbRklDd3QnKyzioApIfGJmxfncxmkArowDeL+H29DY0vqhsadPSx47Hyw5fztGSENDHiEzLSyOrYaXnO2tq7ei5IWVjaitovy3AAVfGz8kMhR1FgsJBXNvZW1DwZeH0ZqzoOFBU43H28To5rD1MQgcBUV5c35gXUZcclY7aXdje4rp0cv0Wmuqscjbm9XX7Oz0sUZXR0w8PDwdPBj6i1QeciVlJtXMlp2MkbvxudPGz9KZury2igcETRUcIyojMiJlCQIMOzXBsWSImMuMrpKrpf+AgIOa/+381/VPCgoNvd90ZGAWEFFLVWxsMH2OtKmnzMX94+fGiMSW3K/s/lIXAEFGV3ttKzc+";
  var K = "ronde-ssiap-1980";
  var JOUR0 = Date.UTC(2026, 9, 8); // 8 octobre 2026 (jour 0)
  var GRAINES = [0x5a17c3e1, 0x9e3779b9, 0xc0fe2026];

  function mod(a, n) { return ((a % n) + n) % n; }

  function decoder() {
    var bin = atob(D), k = K, bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i) ^ k.charCodeAt(i % k.length) ^ ((i * 7) & 0xff);
    }
    return new TextDecoder('utf-8').decode(bytes).split('|');
  }

  function prng(seed) { // mulberry32
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function melanger(liste, seed) { // Fisher–Yates à graine fixe
    var r = prng(seed), t = liste.slice();
    for (var i = t.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var x = t[i]; t[i] = t[j]; t[j] = x;
    }
    return t;
  }

  var _listes = null;
  function listes() {
    if (!_listes) {
      var base = decoder();
      _listes = [base].concat(GRAINES.map(function (s) { return melanger(base, s); }));
    }
    return _listes;
  }

  // Date civile à Paris (Y, M, D) pour un instant donné.
  function dateParis(instant) {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(instant || new Date());
    var o = {};
    parts.forEach(function (p) { if (p.type !== 'literal') o[p.type] = parseInt(p.value, 10); });
    return { y: o.year, m: o.month, d: o.day };
  }

  // Créneau quotidien "AAAA-MM-JJ" (Paris), utilisé pour le paramètre anti-cache.
  function creneau(instant) {
    var p = dateParis(instant);
    return p.y + '-' + String(p.m).padStart(2, '0') + '-' + String(p.d).padStart(2, '0');
  }

  // Nombre de jours civils écoulés depuis le 8 octobre 2026 (Paris). Indépendant de l'heure d'été.
  function indexJour(instant) {
    var p = dateParis(instant);
    return Math.round((Date.UTC(p.y, p.m - 1, p.d) - JOUR0) / 86400000);
  }

  function position(index) {
    return { liste: mod(Math.floor(index / 100), 4), pos: mod(index, 100) };
  }

  function motIndex(index) {
    var p = position(index);
    return listes()[p.liste][p.pos];
  }

  function motDuJour(instant) { return motIndex(indexJour(instant)); }

  // Insensible à la casse, aux accents, aux espaces, tirets et apostrophes.
  function normaliser(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function verifier(saisie, instant) {
    var n = normaliser(saisie);
    return n.length > 0 && n === normaliser(motDuJour(instant));
  }

  function auHasard() {
    var b = listes()[0];
    return b[Math.floor(Math.random() * b.length)];
  }

  // Lit la valeur de "#k=..." dans le fragment courant (ou chaîne vide).
  function lireFragment(hash) {
    var h = hash != null ? hash : (typeof location !== 'undefined' ? location.hash : '');
    var m = /^#k=([A-Za-z0-9_\-]{16,})$/.exec(h || '');
    return m ? m[1] : '';
  }

  // Retire le fragment de la barre d'adresse et de l'entrée d'historique courante.
  function effacerFragment() {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }

  function sha256hex(texte) {
    if (typeof crypto === 'undefined' || !crypto.subtle) return Promise.resolve('');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  function vider() {
    document.title = '\u200b';
    document.body.innerHTML = '';
    document.body.className = 'vide';
  }

  return {
    mod: mod, dateParis: dateParis, creneau: creneau, indexJour: indexJour, position: position,
    motIndex: motIndex, motDuJour: motDuJour, normaliser: normaliser, verifier: verifier,
    auHasard: auHasard, lireFragment: lireFragment, effacerFragment: effacerFragment,
    sha256hex: sha256hex, vider: vider,
    _listes: listes // usage interne / tests uniquement, jamais affiché
  };
});
