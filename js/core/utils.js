/* ──────────────────────────────────────────────────────────────────────────
   core/utils.js  ·  Núcleo 1/5 · UTILIDADES
   Funciones puras: no tocan el DOM ni la red, se pueden probar y
   reutilizar desde cualquier página o bloque.
   Se consume así:  const { utils } = Web07.mods;
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const ENTIDADES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  global.Web07.use("utils", {
    /* escapa texto antes de inyectarlo con innerHTML */
    esc(valor) {
      return String(valor).replace(/[&<>"']/g, (c) => ENTIDADES[c]);
    },

    /* convierte a número finito; NaN si no lo es */
    num(valor) {
      const n = parseFloat(valor);
      return Number.isFinite(n) ? n : NaN;
    },

    /* entero acotado a [min, max]; devuelve el valor por defecto si no es número */
    int(valor, min, max, porDefecto) {
      const n = parseInt(valor, 10);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : porDefecto;
    },

    /* acota cualquier número a un rango */
    limite(valor, min, max) {
      return Math.min(max, Math.max(min, valor));
    },

    /* formato monetario con 2 decimales */
    dinero(n) {
      return Number(n).toFixed(2);
    },

    /* espera no bloqueante (setTimeout como Promise) */
    esperar(ms) {
      return new Promise((r) => setTimeout(r, ms));
    },

    /* milisegundos transcurridos desde la carga de la página */
    ahora() {
      return Math.round(performance.now());
    },
  });
})(window);
