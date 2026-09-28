/* ──────────────────────────────────────────────────────────────────────────
   pages/formulario.js  ·  Script propio de formulario.html
   Login de la demo: admin / 123456. Sin jQuery ni Zepto.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("pagina:formulario", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      const form = dom.porId("loginForm");
      if (!form) return;

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const usuario = dom.valor("usuario");
        const contrasena = dom.valor("contrasena");

        if (usuario === "admin" && contrasena === "123456") {
          alerts.ok("Ingreso aceptado", "Inicio de sesión exitoso.");
        } else {
          alerts.error(
            "Error",
            "Credenciales incorrectas. Inténtalo nuevamente.",
          );
        }
      });
    },
  });
})(window);
