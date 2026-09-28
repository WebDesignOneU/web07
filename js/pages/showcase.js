/* ──────────────────────────────────────────────────────────────────────────
   pages/showcase.js  ·  Script propio de showcase.html
   Lo único que le corresponde a la página (no a un bloque) es la
   navegación activa según la sección visible: IntersectionObserver.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("pagina:showcase", {
    init() {
      const { dom, alerts } = global.Web07.mods;

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

      // Demo buttons for Auth section
      const btnAuthDemo = dom.porId("btn-auth-demo");
      if (btnAuthDemo) {
        btnAuthDemo.addEventListener("click", () => {
          const user = dom.valor("auth-demo-user") || "admin";
          const pass = dom.valor("auth-demo-pass") || "123456";
          if (user === "admin" && pass === "123456") {
            alerts.ok("Login Demo", "¡Credenciales correctas! (Demo en auth.html)");
          } else {
            alerts.error("Login Demo", "Credenciales incorrectas. Use admin / 123456");
          }
        });
      }

      const btnRegDemo = dom.porId("btn-reg-demo");
      if (btnRegDemo) {
        btnRegDemo.addEventListener("click", () => {
          const nombre = dom.valor("reg-demo-nombre");
          const email = dom.valor("reg-demo-email");
          const pass = dom.valor("reg-demo-pass");
          const confirm = dom.valor("reg-demo-confirm");
          if (!nombre || !email || !pass) {
            alerts.warning("Registro Demo", "Complete todos los campos");
            return;
          }
          if (pass !== confirm) {
            alerts.error("Registro Demo", "Las contraseñas no coinciden");
            return;
          }
          if (pass.length < 6) {
            alerts.error("Registro Demo", "Mínimo 6 caracteres");
            return;
          }
          alerts.ok("Registro Demo", `Usuario ${nombre} creado (demo). Use auth.html para registro real.`);
        });
      }
    },
  });
})(window);
