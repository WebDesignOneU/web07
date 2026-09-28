/* ──────────────────────────────────────────────────────────────────────────
   core/dom.js  ·  Núcleo 2/5 · DOM
   Selectores, lectura/escritura de campos y los atajos que las páginas
   necesitan exponer en window porque los usa un onclick inline.
   Se consume así:  const { dom } = Web07.mods;
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const api = {
    $(sel, ctx) {
      return (ctx || document).querySelector(sel);
    },

    $$(sel, ctx) {
      return Array.from((ctx || document).querySelectorAll(sel));
    },

    porId(id) {
      return document.getElementById(id);
    },

    /* valor crudo de un input */
    valor(id) {
      const e = this.porId(id);
      return e ? e.value : "";
    },

    /* valor de un input como número finito, o NaN */
    num(id) {
      const n = parseFloat(this.valor(id));
      return Number.isFinite(n) ? n : NaN;
    },

    /* valor de un input como entero acotado a [min, max] */
    int(id, min, max, porDefecto) {
      const n = parseInt(this.valor(id), 10);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : porDefecto;
    },

    texto(id, contenido) {
      const e = this.porId(id);
      if (e) e.textContent = contenido;
    },

    /* lectura del texto de un nodo (no de un input) */
    leer(id) {
      const e = this.porId(id);
      return e ? e.textContent : "";
    },

    html(id, contenido) {
      const e = this.porId(id);
      if (e) e.innerHTML = contenido;
    },

    /* engancha un listener; acepta selector o elemento */
    alClic(sel, fn, ctx) {
      const e = typeof sel === "string" ? this.$(sel, ctx) : sel;
      if (e) e.addEventListener("click", fn);
      return e;
    },

    /* alClic para varios nodos de un selector */
    alClicTodos(sel, fn, ctx) {
      this.$$(sel, ctx).forEach((e) => e.addEventListener("click", fn));
    },

    /* abre/cierra el panel de código que sigue al botón (tutoriales) */
    alternarCodigo(btn) {
      btn.classList.toggle("open");
      const panel = btn.nextElementSibling;
      if (panel) panel.classList.toggle("visible");
    },

    /* los onclick inline del HTML necesitan encontrarlo en window */
    init() {
      global.toggleCode = api.alternarCodigo;
    },
  };

  global.Web07.use("dom", api);
})(window);
