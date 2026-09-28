/* ──────────────────────────────────────────────────────────────────────────
   pages/index.js  ·  Script propio de index.html
   Menú hamburguesa: abre/cierra la lista y se cierra al hacer clic fuera.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("pagina:index", {
    init() {
      const { dom } = global.Web07.mods;

      const boton = dom.porId("nav-toggle");
      const links = dom.porId("nav-links");
      if (!boton || !links) return;

      boton.addEventListener("click", () => links.classList.toggle("open"));

      document.addEventListener("click", (e) => {
        if (!e.target.closest("#navbar")) links.classList.remove("open");
      });
    },
  });
})(window);
