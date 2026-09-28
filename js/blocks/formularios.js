/* ──────────────────────────────────────────────────────────────────────────
   blocks/formularios.js  ·  Showcase BLOQUE 2 · FORMULARIOS
   Login con validación y simulated, e inscripción con precio calculado
   a partir del tipo de participante.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const VERDE = "#00e5b8";
  const ROSA = "#ff6b9d";

  global.Web07.use("bloque:formularios", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      /* 1 · login (credenciales de la demo: admin / 123456) */
      dom.alClic("#btn-login", () => {
        const u = dom.valor("login-user");
        const p = dom.valor("login-pass");
        if (!u || !p) {
          alerts.aviso("Atención", "Completa usuario y contraseña");
          return;
        }
        if (u === "admin" && p === "123456") {
          alerts.ok(`✅ Bienvenido, ${u}!`, "Inicio de sesión exitoso.", VERDE);
        } else {
          alerts.error(
            "❌ Error",
            "Credenciales incorrectas. Usa admin / 123456",
            ROSA,
          );
        }
      });

      /* 2 · inscripción: el costo depende del tipo de participante */
      const semTipo = dom.porId("sem-tipo");
      const semCosto = dom.porId("sem-costo");

      const costoDe = (tipo) => (tipo === "estudiante" ? 50 : 90);
      const pintarCosto = (tipo) => {
        semCosto.textContent = tipo
          ? `💰 Bs. ${costoDe(tipo)}`
          : "Seleccione un tipo";
        semCosto.className = tipo ? "result-box" : "result-box empty";
      };

      semTipo.addEventListener("change", () => pintarCosto(semTipo.value));

      dom.alClic("#btn-inscribir", () => {
        const nombre = dom.valor("sem-nombre").trim();
        const tipo = semTipo.value;
        if (!nombre) {
          alerts.aviso("Atención", "Ingresa tu nombre");
          return;
        }
        if (!tipo) {
          alerts.aviso("Atención", "Elige un tipo de participante");
          return;
        }
        alerts.ok(
          "🎉 ¡Inscripción Exitosa!",
          `<b>Nombre:</b> ${nombre}<br><b>Tipo:</b> ${tipo}<br><b>Costo:</b> Bs. ${costoDe(tipo)}`,
          VERDE,
        );
        dom.porId("sem-nombre").value = "";
        semTipo.value = "";
        pintarCosto("");
      });
    },
  });
})(window);
