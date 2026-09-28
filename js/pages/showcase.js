/* ──────────────────────────────────────────────────────────────────────────
   pages/showcase.js  ·  Script propio de showcase.html
   Lo único que le corresponde a la página (no a un bloque) es la
   navegación activa según la sección visible: IntersectionObserver.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("pagina:showcase", {
    init() {
      const { dom } = global.Web07.mods;

      const secciones = dom.$$("section[id]");
      const enlaces = dom.$$(".nav-link");
      if (!secciones.length || !enlaces.length) return;

      const obs = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            enlaces.forEach((l) => l.classList.remove("active"));
            const activo = document.querySelector(
              `.nav-link[href="#${e.target.id}"]`,
            );
            if (activo) activo.classList.add("active");
          });
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );

      secciones.forEach((s) => obs.observe(s));
    },
  });
})(window);
