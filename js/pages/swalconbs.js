/* ──────────────────────────────────────────────────────────────────────────
   pages/swalconbs.js  ·  Script propio de swalconbs.html
   Generador de múltiplos: valida el número y muestra los 10 primeros.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("pagina:swalconbs", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      const form = dom.porId("multiplosForm");
      if (!form) return;

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const numero = parseInt(dom.valor("numero"), 10);

        if (isNaN(numero)) {
          alerts.error("Error", "Por favor ingrese un número válido.");
          return;
        }

        const multiplos = [];
        for (let i = 1; i <= 10; i++) multiplos.push(numero * i);
        alerts.ok(
          "Múltiplos Generados",
          `Los múltiplos de ${numero} son: ${multiplos.join(", ")}`,
        );
      });
    },
  });
})(window);
